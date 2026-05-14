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

const Security1 = () => {
  const { state, updateState } = useApp();
  const data = state.security?.part1 || {};

  const handleChange = (field, value) => {
    updateState(`security.part1.${field}`, value);
  };

  return (
    <FormPage
      title="Security and Background - Part 1"
      sectionId="security"
      prevRoute="/application/work"
      prevLabel="Work / Education"
      nextRoute="/application/security2"
      nextLabel="Security Part 2"
    >
      <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
        <span className="font-bold text-[#990000]">Important:</span> Answer all questions accurately and truthfully. A &quot;Yes&quot; answer does not necessarily mean you are ineligible for a visa.
      </div>
      <div className="space-y-2">
        <SecurityQuestion
          question="Do you have a communicable disease of public health significance such as tuberculosis (TB)?"
          field="communicable" value={data.communicableDiseaseDisorder || 'No'}
          onChange={(v) => handleChange('communicableDiseaseDisorder', v)} />
        <SecurityQuestion
          question="Do you have a physical or mental disorder that poses or is likely to pose a threat to the safety or welfare of yourself or others?"
          field="physicalMental" value={data.physicalOrMentalDisorder || 'No'}
          onChange={(v) => handleChange('physicalOrMentalDisorder', v)} />
        <SecurityQuestion
          question="Are you or have you ever been a drug abuser or addict?"
          field="drugAbuser" value={data.drugAbuser || 'No'}
          onChange={(v) => handleChange('drugAbuser', v)} />
      </div>
    </FormPage>
  );
};

export default Security1;
