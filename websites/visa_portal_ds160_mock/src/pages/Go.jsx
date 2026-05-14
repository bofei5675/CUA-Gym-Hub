import React from 'react';
import { useApp } from '../context/AppContext';

const Go = () => {
  const { state, initialStateSnapshot } = useApp();

  // Simple diff function
  const getDiff = (obj1, obj2) => {
    const diff = {};
    for (const key in obj1) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        diff[key] = {
          from: obj2[key],
          to: obj1[key]
        };
      }
    }
    return diff;
  };

  const diff = getDiff(state, initialStateSnapshot);

  return (
    <div className="p-4 font-mono text-xs">
      <h1 className="text-xl font-bold mb-4">Application State Inspector (/go)</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-2 overflow-auto h-[80vh]">
          <h2 className="font-bold mb-2 bg-gray-200 p-1">Initial State</h2>
          <pre>{JSON.stringify(initialStateSnapshot, null, 2)}</pre>
        </div>
        
        <div className="border p-2 overflow-auto h-[80vh]">
          <h2 className="font-bold mb-2 bg-blue-200 p-1">Current State</h2>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>

        <div className="border p-2 overflow-auto h-[80vh]">
          <h2 className="font-bold mb-2 bg-red-200 p-1">State Diff</h2>
          <pre>{JSON.stringify(diff, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default Go;