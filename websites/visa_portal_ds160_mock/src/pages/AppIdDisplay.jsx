import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AppIdDisplay = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { applicationId } = state.ds160Application;

  return (
    <div className="w-full font-sans text-[13px]">
      <h2 className="text-[#003366] text-[18px] font-serif font-bold border-b border-black pb-1 mb-3">
        Application Information
      </h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <p className="mb-4">
            <span className="font-bold text-[#990000]">Please record your Application ID in a safe and secure place.</span>
          </p>
          <p className="mb-4">
            If there are technical issues with the system, or you want to complete your application some other time, you can save your work and later, start where you left off. In order to access your application later, however, you will need: (1) your Application ID, and (2) the answer to the security question that you will choose on this page.
          </p>
        </div>
        
        <div className="w-[300px] border border-[#CCCCCC] p-4 bg-[#F9F9F9] flex flex-col items-center text-center">
          {/* Mock Seal */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/U.S._Department_of_State_official_seal.svg/1200px-U.S._Department_of_State_official_seal.svg.png" 
            alt="Seal" 
            className="w-16 h-16 mb-2 opacity-50"
          />
          <div className="text-left w-full pl-4">
            <div className="text-[11px] text-gray-600">Your Application ID is:</div>
            <div className="text-[24px] font-bold text-[#990000] tracking-wider font-mono">{applicationId}</div>
            <div className="text-[11px] text-gray-600 mt-2">Date</div>
            <div className="font-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => navigate('/application/personal1')}
          className="bg-[#003366] text-white font-bold px-8 py-2 shadow-btn hover:bg-[#002244]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AppIdDisplay;