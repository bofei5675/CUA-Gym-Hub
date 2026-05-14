import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const FormPage = ({ title, sectionId, prevRoute, prevLabel, nextRoute, nextLabel, children }) => {
  const navigate = useNavigate();
  const { updateState, state } = useApp();

  const handleSave = () => {
    updateState('meta.lastSavedAt', new Date().toISOString());
    alert('Application saved successfully.');
  };

  const handleNext = () => {
    if (sectionId && !state.completedSections?.includes(sectionId)) {
      const updated = [...(state.completedSections || []), sectionId];
      updateState('completedSections', updated);
    }
    if (nextRoute) {
      const nextSectionId = nextRoute.split('/').pop();
      updateState('ds160Application.currentSection', nextSectionId);
      navigate(nextRoute);
    }
  };

  const handleBack = () => {
    if (prevRoute) navigate(prevRoute);
  };

  return (
    <div className="w-full font-sans text-[13px]">
      <div className="flex justify-between items-end border-b border-black pb-1 mb-3">
        <h2 className="text-[#003366] text-[18px] font-serif font-bold">{title}</h2>
        <div className="flex gap-2 text-[10px] font-bold">
          <button onClick={() => window.print()} className="text-[#003366] underline bg-transparent border-none cursor-pointer p-0 text-[10px] font-bold">Print</button>
          <span className="text-[#003366] underline cursor-help" title="For help, hover over the blue 'i' icons next to each field.">Help</span>
        </div>
      </div>

      <p className="text-[11px] mb-4 text-black">
        <span className="font-bold">NOTE:</span> Please fill in all required fields marked with an asterisk (*).
      </p>

      {children}

      <div className="mt-8 flex justify-end gap-2 border-t border-gray-300 pt-4">
        {prevRoute && (
          <button
            onClick={handleBack}
            className="text-black font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-gray-200 border border-[#888888]"
            style={{background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)'}}
          >
            Back: {prevLabel || 'Previous'}
          </button>
        )}
        <button
          onClick={handleSave}
          className="text-black font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-gray-200 border border-[#888888]"
          style={{background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)'}}
        >
          Save
        </button>
        {nextRoute && (
          <button
            onClick={handleNext}
            className="text-white font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-[#002244] border border-[#002244]"
            style={{background: 'linear-gradient(to bottom, #004488 0%, #003366 100%)'}}
          >
            Next: {nextLabel || 'Next Section'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormPage;
