# 火山云 Ubuntu 一键部署

把这个目录里的脚本传到一台干净的火山云 Ubuntu 22.04 虚拟机，跑 `sudo bash bootstrap.sh`，半小时左右就能拿到 98 个本机端口（`8000–8097`）上的 Mock。

## 0. 准备工作

### 0.1 推荐虚拟机规格

| 维度 | 最低 | 推荐 |
|---|---|---|
| CPU | 4 vCPU | 8 vCPU |
| 内存 | 8 GB | **16 GB** |
| 系统盘 | 40 GB | **60 GB** |
| 镜像 | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

实际占用：源码 + `node_modules` + `dist/` 约 15–25 GB，98 个常驻 vite 进程 6–10 GB 内存。

### 0.2 火山云安全组

|场景| 需要放行的入站端口 |
|---|---|
| Agent 只在 VM 桌面内部访问 Mock（最常见） | 22；远程桌面端口（RDP/VNC）|
| 外部直连每个 Mock | 22；`8000–8097` TCP |
| 外部通过反代访问 | 22；`80`、`443`（TCP） |

## 1. 上传脚本到 VM

在你本地（已经 clone 仓库的机器上）执行：

```bash
# 整个 deploy/volcano 目录传过去
scp -r deploy/volcano ubuntu@<vm-public-ip>:~/
```

或者用对象存储/Git 拉。脚本不依赖仓库其他文件，自包含。

## 2. 三种典型部署方式

### 方式 A：Agent 跑在 VM 桌面里，只本机访问（最简单，推荐）

```bash
ssh ubuntu@<vm-ip>
cd ~/volcano
sudo bash bootstrap.sh
```

跑完后：
- 桌面浏览器访问 `http://localhost:8000` ~ `http://localhost:8097`
- Mock 进程由 systemd 托管（`systemctl status cua-gym-hub`），开机自启
- 端口 8000–8097 **不对外暴露**，安全

### 方式 B：外部直连每台 Mock（内网/局域网训练集群）

跟方式 A 完全相同的命令，**但记得在火山云安全组放行 `8000–8097` TCP**，源 IP 段尽量收紧。

外部访问：

```bash
curl http://<vm-public-ip>:8000/go?sid=task_001
```

### 方式 C：公网反代 + HTTPS 子域

需要一个域名（例如 `mocks.example.com`）和一条**通配 A 记录** `*.mocks.example.com` → VM 公网 IP。

```bash
sudo bash bootstrap.sh \
    --enable-nginx \
    --nginx-domain mocks.example.com
```

然后上 HTTPS（Certbot DNS-01 是通配证书唯一方式，需要你 DNS 服务商插件；下面的 HTTP-01 仅适用非通配）：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d mocks.example.com -d gmail.mocks.example.com \
    -d slack.mocks.example.com  # ...逐个域名签
```

或者 DNS-01 一次性签通配（推荐，但要 DNS 服务商支持 API）：

```bash
sudo certbot certonly --manual --preferred-challenges=dns -d "*.mocks.example.com"
```

部署完成后：

| URL | 对应 Mock |
|---|---|
| `https://gmail.mocks.example.com` | `gmail_mock` |
| `https://slack.mocks.example.com` | `slack_mock` |
| `https://aws-console.mocks.example.com` | `aws_console_mock` |
| `https://canvas-lms.mocks.example.com` | `Canvas-LMS_mock` |
| ... | ... |

> 子域名规则：`foo_mock` → `foo`，下划线和大写都转成小写中划线。

可以把这些 URL 灌到 `CUA_GYM_*_URL` 环境变量给 CUA-Gym 训练器用。

## 3. bootstrap.sh 常用参数

```bash
sudo bash bootstrap.sh \
    --repo-dir /opt/CUA-Gym-Hub \
    --service-user ubuntu \
    --base-port 8000 \
    --node-version 20 \
    --npm-registry https://registry.npmmirror.com \
    --state-retain-days 7
```

| 参数 | 说明 |
|---|---|
| `--repo-dir` | 仓库放哪，默认 `/opt/CUA-Gym-Hub` |
| `--service-user` | 跑 vite preview 的用户；默认用 `SUDO_USER` 或 `ubuntu` |
| `--base-port` | 起始端口，默认 `8000`，自动连续分配 98 个 |
| `--node-version` | Node 主版本，默认 20（最低 18） |
| `--npm-registry` | npm 镜像源，默认 npmmirror（国内快） |
| `--enable-nginx` | 安装并启用 nginx 反代（需 `--nginx-domain`） |
| `--nginx-domain` | 通配反代根域，如 `mocks.example.com` |
| `--no-cleanup-cron` | 不安装每日清理 cron |
| `--state-retain-days` | 状态文件保留天数，默认 7 |
| `--skip-install` | 跳过 `npm install`（二次部署快很多） |
| `--skip-build` | 跳过 `npm run build` |
| `--skip-systemd` | 不写 systemd unit（只用 tmux） |

## 4. 部署完成后的常用操作

```bash
# 进 tmux 看 98 个 vite preview 输出
sudo -u ubuntu tmux attach -t cua-gym-hub
# Ctrl+b 后输入窗口号切换；Ctrl+b d 退出 tmux

# systemd 控制
sudo systemctl status  cua-gym-hub
sudo systemctl restart cua-gym-hub
sudo systemctl stop    cua-gym-hub
sudo journalctl -u cua-gym-hub -e

# 98 个端口全量探活
bash deploy/volcano/healthcheck.sh

# 导出 端口↔mock 映射表
bash deploy/volcano/healthcheck.sh \
     --write-port-map /tmp/port-map.tsv >/dev/null
cat /tmp/port-map.tsv

# 手动清理状态文件
sudo bash deploy/volcano/cleanup.sh --retain-days 3        # 删 3 天前的
sudo bash deploy/volcano/cleanup.sh --all                  # 全删（先停服务）
sudo bash deploy/volcano/cleanup.sh --dry-run              # 预演

# 重新生成 nginx 配置（比如换了域名或基础端口）
sudo bash deploy/volcano/gen-nginx.sh --domain new.example.com --base-port 18000
```

## 5. 验证 State API 工作

```bash
# 选任意一个 mock，比如 8000 端口
curl -X POST "http://localhost:8000/post?sid=t1" \
     -H "Content-Type: application/json" \
     -d '{"action":"set","state":{"hello":"world"}}'

curl "http://localhost:8000/go?sid=t1"
# 应返回 {"initial_state":{...},"current_state":{...},"state_diff":{...}}

curl -X POST "http://localhost:8000/post?sid=t1" -d '{"action":"reset"}'
```

## 6. 常见问题

### Q1：`npm install` 跑了很久还没完
98 个项目串行装，平均每个 30–60 秒，**总耗时 30–60 分钟正常**。看进度：

```bash
sudo tail -f /var/log/syslog | grep CUA   # 不一定有
# 或者直接看磁盘增长
watch -n 5 'du -sh /opt/CUA-Gym-Hub/websites/'
```

### Q2：build 阶段有几个 Mock 报错
`deploy-all.sh` 把每个 build 日志放在临时目录里（脚本输出会打印路径，类似 `/tmp/tmp.XXXX/<mock>.log`）。失败的进对应目录手动复现：

```bash
cd /opt/CUA-Gym-Hub/websites/<failed_mock>
rm -rf node_modules package-lock.json
npm install
npm run build
```

修好后再跑 `sudo bash bootstrap.sh --skip-install` 让它接着把没起的进程拉起来（重启 systemd 即可）。

### Q3：systemd 启动后某些端口没监听
进 tmux 看具体窗口报错。常见原因：

- 端口被其它服务占了 → 改 `--base-port`
- 单个 mock build 失败 → `dist/` 缺失 → vite preview 起不来
- 内存不够被 OOM 杀了 → 升内存或减少并发

### Q4：状态文件越来越多，磁盘吃紧
默认装了每天清理 7 天前的 cron。手动一次：

```bash
sudo bash /opt/CUA-Gym-Hub/deploy/volcano/cleanup.sh --retain-days 1
```

### Q5：重启 VM 后端口没起来
检查 systemd：

```bash
sudo systemctl status cua-gym-hub
sudo journalctl -u cua-gym-hub -e
```

最常见原因：systemd 启动太早，HOME 目录没准备好。bootstrap 已经显式设了 `Environment=HOME=/home/<user>`，如果用户不是 `ubuntu`，记得 `--service-user` 正确传入。

### Q6：能否只部署一部分 Mock
当前 `deploy-all.sh` 是全量。如果只想跑一部分，最简单的办法是把不要的目录从 `websites/` 移出去：

```bash
sudo systemctl stop cua-gym-hub
mkdir -p /opt/cua-disabled
cd /opt/CUA-Gym-Hub/websites
sudo mv tableau_mock mailchimp_mock /opt/cua-disabled/   # 举例
sudo systemctl start cua-gym-hub
```

下次跑 `bootstrap.sh` 时它们就不会再被加进 tmux。

### Q7：和 Agent 集成时要注意 sid 怎么传？
每集训练用一个唯一 `sid`（任务 ID）即可。文件按 `sid` 命名空间隔离：

```
/opt/CUA-Gym-Hub/websites/gmail_mock/.mock-states/<sid>.json
/opt/CUA-Gym-Hub/websites/gmail_mock/.mock-files/<sid>/...
```

Agent 用浏览器访问时 URL 带 `?sid=<sid>`，前端会自动把状态保持。

## 7. 卸载

```bash
sudo systemctl disable --now cua-gym-hub
sudo rm /etc/systemd/system/cua-gym-hub.service
sudo rm -f /etc/cron.daily/cua-gym-hub-cleanup
sudo rm -f /etc/nginx/sites-enabled/cua-gym-hub.conf /etc/nginx/sites-available/cua-gym-hub.conf
sudo systemctl reload nginx 2>/dev/null || true
sudo -u <service-user> tmux kill-session -t cua-gym-hub 2>/dev/null || true
sudo rm -rf /opt/CUA-Gym-Hub
```
