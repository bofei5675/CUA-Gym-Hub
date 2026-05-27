#!/usr/bin/env python3
"""Minimal single-task runner for CUA-Gym dataset bundles.

It executes the OSWorld-style `task.json[config]` steps locally, lets you
hand the instruction to an agent (or skip the agent loop entirely for
smoke testing), then runs `reward.py` and parses the score.

This intentionally does NOT spin up a headed browser by default; the
upstream `initial_setup.py` already runs `google-chrome ...` itself if a
DISPLAY is available. Use --skip-setup or --no-browser-env to control that.

Examples
--------

# 1. End-to-end with an interactive prompt before reward (you operate Chrome):
python3 run_task.py \\
    --task-dir /path/to/cua_gym_tasks/0018392e-cfed-5e2f-8278-a4580d64a00a

# 2. Smoke test: setup + immediate reward (expect REWARD: 0.0 since agent
#    didn't do anything):
python3 run_task.py --task-dir <dir> --no-agent

# 3. Re-score only (after agent finished and the sid file still exists):
python3 run_task.py --task-dir <dir> --skip-setup

# 4. Run setup but suppress the GUI launch (e.g. headless mock test):
python3 run_task.py --task-dir <dir> --no-display
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path


REWARD_RE = re.compile(r"REWARD:\s*([0-9]*\.?[0-9]+)")


def run(cmd: list[str] | str, *, env: dict[str, str] | None = None,
        check: bool = True, capture: bool = False) -> subprocess.CompletedProcess:
    if isinstance(cmd, str):
        printable = cmd
        cmd_list = shlex.split(cmd)
    else:
        printable = " ".join(shlex.quote(c) for c in cmd)
        cmd_list = cmd
    print(f"$ {printable}")
    return subprocess.run(
        cmd_list, env=env, check=check,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.STDOUT if capture else None,
        text=True,
    )


def apply_config(task_dir: Path, config: list[dict], *, no_display: bool) -> None:
    """Execute task.json[config] steps with paths resolved relative to task_dir."""
    env = os.environ.copy()
    if no_display:
        env.pop("DISPLAY", None)
        env["DISPLAY"] = ""   # makes upstream `launch_gui` no-op chrome

    for i, step in enumerate(config):
        stype = step.get("type")
        params = step.get("parameters", {})
        print(f"\n--- config[{i}] type={stype} ---")
        if stype == "download":
            for f in params.get("files", []):
                src = (task_dir / f["url"]).resolve()
                dst = Path(f["path"]).expanduser()
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy(src, dst)
                print(f"  copied {src}  ->  {dst}")
        elif stype == "execute":
            run(params["command"], env=env)
        elif stype == "launch":
            # Some tasks use `launch` to start GUI apps. Honour --no-display.
            run(params["command"], env=env, check=False)
        else:
            print(f"  WARN: unknown step type '{stype}', skipping", file=sys.stderr)


def parse_reward(stdout: str) -> float | None:
    matches = REWARD_RE.findall(stdout)
    if not matches:
        return None
    # Take the LAST match (some rewards print intermediate per-component lines).
    try:
        return float(matches[-1])
    except ValueError:
        return None


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--task-dir", required=True, help="Path to an extracted task directory.")
    p.add_argument("--skip-setup", action="store_true",
                   help="Don't run task.json[config]; assume sid file already exists.")
    p.add_argument("--no-agent", action="store_true",
                   help="Don't wait for agent rollout; run reward right after setup.")
    p.add_argument("--no-display", action="store_true",
                   help="Unset DISPLAY before running setup (suppresses chrome launch).")
    p.add_argument("--reward-only", action="store_true",
                   help="Equivalent to --skip-setup --no-agent (just re-score).")
    p.add_argument("--reward-cmd", default=None,
                   help="Override reward command (default: python3 <task_dir>/reward.py).")
    args = p.parse_args()

    task_dir = Path(args.task_dir).expanduser().resolve()
    if not task_dir.is_dir():
        print(f"task dir not found: {task_dir}", file=sys.stderr)
        return 2

    task_json = task_dir / "task.json"
    if not task_json.is_file():
        print(f"task.json missing under {task_dir}", file=sys.stderr)
        return 2

    task = json.loads(task_json.read_text())
    print(f"Task ID:     {task.get('id')}")
    print(f"App type:    {task.get('app_type')}")
    print(f"Difficulty:  {task.get('difficulty')}")
    print(f"Instruction: {task.get('instruction')}")

    if args.reward_only:
        args.skip_setup = True
        args.no_agent = True

    # --- Stage 1: setup ---
    if not args.skip_setup:
        config = task.get("config") or []
        if not config:
            print("WARN: task.json has empty config[]", file=sys.stderr)
        apply_config(task_dir, config, no_display=args.no_display)
    else:
        print("\n-- skipping setup --")

    # --- Stage 2: agent rollout (manual gate) ---
    if not args.no_agent:
        print("\n" + "=" * 60)
        print("AGENT ROLLOUT PHASE")
        print("Operate the browser (or let your agent run) now.")
        print("When done, return here and press ENTER to score.")
        print("=" * 60)
        try:
            input("[press ENTER to run reward.py] ")
        except (EOFError, KeyboardInterrupt):
            print("\naborted before reward", file=sys.stderr)
            return 130
    else:
        print("\n-- skipping agent wait --")

    # --- Stage 3: reward ---
    reward_cmd = args.reward_cmd or f"python3 {shlex.quote(str(task_dir / 'reward.py'))}"
    print(f"\n--- reward ---")
    proc = run(reward_cmd, capture=True, check=False)
    sys.stdout.write(proc.stdout)
    score = parse_reward(proc.stdout)

    print("\n" + "=" * 60)
    if score is None:
        print("RESULT: could not parse REWARD: line from reward.py output")
        return 1
    print(f"RESULT: score = {score}")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
