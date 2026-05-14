import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Confirmation = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { applicationId, location } = state.ds160Application;
  const p1 = state.personalInfo?.personal1 || {};
  const sig = state.signature || {};

  const submittedDate = sig.signedDate
    ? new Date(sig.signedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase()
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase();

  const applicantName = p1.surname && p1.givenName
    ? `${p1.surname}, ${p1.givenName}`
    : sig.signedBy || 'APPLICANT';

  return (
    <div className="w-full font-sans text-[13px]">
      <div className="flex justify-between items-end border-b border-black pb-1 mb-3">
        <h2 className="text-[#003366] text-[18px] font-serif font-bold">Confirmation</h2>
        <button
          onClick={() => window.print()}
          className="text-[#003366] underline bg-transparent border-none cursor-pointer p-0 text-[10px] font-bold"
        >
          Print Confirmation Page
        </button>
      </div>

      <div className="bg-[#E8F8E8] border border-[#009900] p-3 mb-4 text-[12px]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#009900] text-[18px] font-bold">&#10003;</span>
          <span className="font-bold text-[#006600] text-[14px]">Application Successfully Submitted</span>
        </div>
        <p className="text-black">
          Your DS-160 Nonimmigrant Visa Application has been submitted. Please print this confirmation page for your records and bring it to your visa interview.
        </p>
      </div>

      {/* Confirmation Details Box */}
      <div className="border border-[#CCCCCC] mb-4">
        <div className="bg-[#003366] text-white font-bold text-[12px] px-3 py-[4px]">
          APPLICATION CONFIRMATION
        </div>
        <div className="p-3 bg-white">
          <div className="flex justify-center mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/U.S._Department_of_State_official_seal.svg/1200px-U.S._Department_of_State_official_seal.svg.png"
              alt="Department of State Seal"
              className="w-[60px] h-[60px] opacity-60"
            />
          </div>

          <div className="grid grid-cols-[40%_60%] gap-y-2 text-[11px]">
            <div className="font-bold text-[#333333] text-right pr-3">Applicant Name:</div>
            <div className="font-bold text-black uppercase">{applicantName}</div>

            <div className="font-bold text-[#333333] text-right pr-3">Application ID:</div>
            <div className="font-bold text-[#990000] text-[14px] font-mono tracking-wider">{applicationId || 'AA00XXXXXX'}</div>

            <div className="font-bold text-[#333333] text-right pr-3">Date Submitted:</div>
            <div className="text-black">{submittedDate}</div>

            <div className="font-bold text-[#333333] text-right pr-3">Interview Location:</div>
            <div className="text-black">{location || 'NOT SELECTED'}</div>

            <div className="font-bold text-[#333333] text-right pr-3">Application Status:</div>
            <div className="font-bold text-[#006600]">SUBMITTED</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="border border-[#CCCCCC] mb-4">
        <div className="bg-[#E8F0F8] font-bold text-[12px] text-[#003366] px-3 py-[4px] border-b border-[#CCCCCC]">
          NEXT STEPS
        </div>
        <div className="p-3 text-[11px] space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#003366] text-[13px]">1.</span>
            <span><span className="font-bold">Print this confirmation page</span> and bring it to your visa interview appointment.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#003366] text-[13px]">2.</span>
            <span><span className="font-bold">Schedule your interview appointment</span> at the U.S. Embassy or Consulate where you applied.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#003366] text-[13px]">3.</span>
            <span><span className="font-bold">Pay the visa application fee</span> as directed by the Embassy or Consulate.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#003366] text-[13px]">4.</span>
            <span><span className="font-bold">Gather required documents</span> as listed on the Embassy or Consulate website.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#003366] text-[13px]">5.</span>
            <span><span className="font-bold">Attend your interview</span> at the scheduled time with all required documents.</span>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFCC] border border-[#CCCCCC] p-2 text-[11px] mb-4">
        <span className="font-bold">Important:</span> Write down or print your Application ID (<span className="font-bold text-[#990000]">{applicationId}</span>). You will need this number to retrieve your application or check your status.
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => window.print()}
          className="text-black font-bold text-[11px] px-4 py-[3px] shadow-btn hover:bg-gray-200 border border-[#888888]"
          style={{ background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)' }}
        >
          Print This Page
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-white font-bold text-[11px] px-4 py-[3px] shadow-btn hover:bg-[#002244] border border-[#002244]"
          style={{ background: 'linear-gradient(to bottom, #004488 0%, #003366 100%)' }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
