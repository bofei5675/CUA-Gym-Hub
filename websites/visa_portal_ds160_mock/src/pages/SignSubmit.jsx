import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SignSubmit = () => {
  const navigate = useNavigate();
  const { state, updateState } = useApp();
  const data = state.signature || {};
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    updateState(`signature.${field}`, value);
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleSave = () => {
    updateState('meta.lastSavedAt', new Date().toISOString());
    alert('Application saved successfully.');
  };

  const handleBack = () => {
    navigate('/application/review');
  };

  const handleSign = () => {
    const newErrors = {};
    if (!data.signedBy) newErrors.signedBy = true;
    if (!data.passportNumber) newErrors.passportNumber = true;
    if (!data.eSigned) newErrors.eSigned = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Please complete all required fields before signing.');
      return;
    }

    const signedDate = new Date().toISOString();
    updateState('signature.signedDate', signedDate);
    updateState('ds160Application.status', 'Submitted');

    if (!state.completedSections?.includes('sign')) {
      const updated = [...(state.completedSections || []), 'sign'];
      updateState('completedSections', updated);
    }
    updateState('ds160Application.currentSection', 'confirmation');
    navigate('/application/confirmation');
  };

  const errorBorder = (field) => errors[field] ? 'border-[#CC0000] bg-[#FFF0F0]' : '';

  return (
    <div className="w-full font-sans text-[13px]">
      <div className="flex justify-between items-end border-b border-black pb-1 mb-3">
        <h2 className="text-[#003366] text-[18px] font-serif font-bold">Sign and Submit Application</h2>
        <div className="flex gap-2 text-[10px] font-bold">
          <button onClick={() => window.print()} className="text-[#003366] underline bg-transparent border-none cursor-pointer p-0 text-[10px] font-bold">Print</button>
          <span className="text-[#003366] underline cursor-help" title="Sign and submit your application.">Help</span>
        </div>
      </div>

      <p className="text-[11px] mb-4 text-black">
        <span className="font-bold">NOTE:</span> Please fill in all required fields marked with an asterisk (*).
      </p>

      {Object.keys(errors).length > 0 && (
        <div className="bg-[#FFEEEE] border border-[#CC0000] text-[#990000] p-2 mb-3 text-[11px] font-bold">
          Please correct the highlighted fields below before proceeding.
        </div>
      )}

      <div className="bg-[#FFFFCC] p-3 mb-4 border border-[#CCCCCC] text-[11px] leading-snug">
        <p className="font-bold text-[#990000] mb-1">Important Statement</p>
        <p className="mb-2">
          I certify that I have read and understood all the questions in this application, and the answers I have furnished are true and correct to the best of my knowledge and belief. I understand that any false or misleading statement may result in the permanent refusal of a visa or denial of entry into the United States.
        </p>
        <p>
          I also understand that possession of a visa does not entitle the bearer to enter the United States of America upon arrival at a port of entry if he or she is found inadmissible.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Applicant's Full Name <span className="text-[#CC0000]">*</span>
            </label>
            <div className="text-[10px] text-gray-500 italic">(as it appears on passport)</div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className={`w-[280px] h-[20px] uppercase border-[#7F9DB9] px-1 text-[11px] ${errorBorder('signedBy')}`}
              value={data.signedBy || ''}
              onChange={(e) => handleChange('signedBy', e.target.value)}
              placeholder="SURNAME, GIVEN NAME"
            />
          </div>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Passport Number <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className={`w-[200px] h-[20px] uppercase border-[#7F9DB9] px-1 text-[11px] ${errorBorder('passportNumber')}`}
              value={data.passportNumber || ''}
              onChange={(e) => handleChange('passportNumber', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Electronic Signature <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-start pt-1 flex-col gap-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="eSign"
                className={`m-0 mr-2 ${errors.eSigned ? 'outline outline-[#CC0000]' : ''}`}
                checked={data.eSigned || false}
                onChange={(e) => handleChange('eSigned', e.target.checked)}
              />
              <label htmlFor="eSign" className="text-[11px] text-[#333333]">
                I certify, under penalty of perjury, that all statements and information provided are true and correct to the best of my knowledge. I am electronically signing this application.
              </label>
            </div>
            {errors.eSigned && <span className="text-[10px] text-[#CC0000] font-bold ml-5">You must certify your application before submitting.</span>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2 border-t border-gray-300 pt-4">
        <button
          onClick={handleBack}
          className="text-black font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-gray-200 border border-[#888888]"
          style={{ background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)' }}
        >
          Back: Review
        </button>
        <button
          onClick={handleSave}
          className="text-black font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-gray-200 border border-[#888888]"
          style={{ background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)' }}
        >
          Save
        </button>
        <button
          onClick={handleSign}
          className="text-white font-bold text-[11px] px-4 py-[2px] shadow-btn hover:bg-[#880000] border border-[#880000]"
          style={{ background: 'linear-gradient(to bottom, #CC0000 0%, #990000 100%)' }}
        >
          Sign Application
        </button>
      </div>
    </div>
  );
};

export default SignSubmit;
