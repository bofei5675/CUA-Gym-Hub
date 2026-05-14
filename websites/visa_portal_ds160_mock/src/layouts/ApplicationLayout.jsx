import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../context/AppContext';

const SESSION_MINUTES = 20;

const ApplicationLayout = () => {
  const { state, updateState } = useApp();
  const { applicationId, location } = state.ds160Application;
  const [timeLeft, setTimeLeft] = useState(SESSION_MINUTES * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Reset timer on any state change (user activity)
  useEffect(() => {
    setTimeLeft(SESSION_MINUTES * 60);
  }, [state]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = timeLeft === 0;

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Application Info Bar */}
      <div className="bg-[#E8F0F8] border-b border-[#99CCFF] px-2 py-1 flex justify-between items-start text-[11px] leading-tight">
        <div className="flex flex-col">
          <div>
            <span className="font-bold text-[#003366] mr-1">Location:</span>
            <span className="text-black">{location || 'NOT SELECTED'}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div>
            <span className="font-bold text-[#003366] mr-1">Your Application ID is:</span>
            <span className="font-bold text-[#990000] text-[13px]">{applicationId || 'AA00XXXXXX'}</span>
          </div>
          <div className={`text-[10px] mt-[1px] ${isExpired ? 'text-[#CC0000]' : 'text-gray-600'}`}>
            {isExpired
              ? <span className="font-bold text-[#CC0000]">Session expired — please save and reload.</span>
              : <>Session Times Out in: <span className="font-bold text-black">{timeDisplay}</span></>
            }
          </div>
        </div>
      </div>

      <ProgressBar />

      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-3 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ApplicationLayout;
