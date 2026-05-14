import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';

const SecurityQuestion = ({ question, field, value, onChange }) => (
  <div className="grid grid-cols-[65%_35%] gap-2 items-start mb-2">
    <div className="text-[12px] text-[#333333] pt-1">{question} <span className="text-[#CC0000]">*</span></div>
    <div className="flex items-center pt-1">
      <input type="radio" name={field} id={`${field}Y`} className="m-0 mr-1"
        checked={value === 'Yes'} onChange={() => onChange('Yes')} />
      <label htmlFor={`${field}Y`} className="text-[11px] mr-3">Yes</label>
      <input type="radio" name={field} id={`${field}N`} className="m-0 mr-1"
        checked={value === 'No'} onChange={() => onChange('No')} />
      <label htmlFor={`${field}N`} className="text-[11px]">No</label>
    </div>
  </div>
);

const Security5 = () => {
  const { state, updateState } = useApp();
  const data = state.security?.part5 || {};

  const handleChange = (field, value) => {
    updateState(`security.part5.${field}`, value);
  };

  return (
    <FormPage
      title="Security and Background - Part 5"
      sectionId="security"
      prevRoute="/application/security4"
      prevLabel="Security Part 4"
      nextRoute="/application/photo"
      nextLabel="Photo"
    >
      <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
        <span className="font-bold text-[#990000]">Important:</span> Answer all questions accurately and truthfully.
      </div>
      <div className="space-y-2">
        <SecurityQuestion
          question="Do you intend to engage in the United States in any activity that would violate any law, or do you seek entry in order to engage in activities that would be in violation of the law?"
          field="seekIllegalEntry" value={data.seekIllegalEntry || 'No'}
          onChange={(v) => handleChange('seekIllegalEntry', v)} />
        <SecurityQuestion
          question="Have you ever engaged in any other activities that would be in violation of any immigration law or regulation?"
          field="otherActivities" value={data.otherActivities || 'No'}
          onChange={(v) => handleChange('otherActivities', v)} />
      </div>
    </FormPage>
  );
};

export default Security5;
