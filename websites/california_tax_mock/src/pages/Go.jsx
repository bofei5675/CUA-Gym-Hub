import React, { useState, useEffect } from 'react';
import { useTax } from '../context/TaxContext';
import { getSessionId } from '../utils/initialState';

function calculateDiff(initial, current) {
  if (!initial || !current) return {};
  const diff = {};

  const allKeys = new Set([...Object.keys(initial), ...Object.keys(current)]);

  for (const key of allKeys) {
    const initialVal = initial[key];
    const currentVal = current[key];

    if (JSON.stringify(initialVal) !== JSON.stringify(currentVal)) {
      if (initialVal === undefined) {
        diff[key] = { added: currentVal };
      } else if (currentVal === undefined) {
        diff[key] = { removed: initialVal };
      } else {
        diff[key] = { from: initialVal, to: currentVal };
      }
    }
  }

  return diff;
}

function Go() {
  const { state, initialState } = useTax();
  const [serverData, setServerData] = useState(null);
  const [loadingServer, setLoadingServer] = useState(false);

  const sid = getSessionId();

  useEffect(() => {
    if (!sid) return;
    // When a sid is present, fetch the authoritative state from the server-side /go endpoint
    setLoadingServer(true);
    const url = `/go?sid=${encodeURIComponent(sid)}`;
    fetch(url, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setServerData(data);
        setLoadingServer(false);
      })
      .catch((err) => {
        console.warn('Go: failed to fetch server state, falling back to localStorage:', err);
        setLoadingServer(false);
      });
  }, [sid]);

  let output;
  if (sid && serverData) {
    // Use server-side state for session-isolated access
    output = serverData;
  } else if (sid && loadingServer) {
    output = { message: 'Loading session state...' };
  } else {
    // No sid or server fetch failed: fall back to context state (localStorage-based)
    const stateDiff = calculateDiff(initialState, state);
    output = {
      initial_state: initialState,
      current_state: state,
      state_diff: stateDiff
    };
  }

  return (
    <pre
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        margin: 0,
        minHeight: '100vh'
      }}
    >
      {JSON.stringify(output, null, 2)}
    </pre>
  );
}

export default Go;
