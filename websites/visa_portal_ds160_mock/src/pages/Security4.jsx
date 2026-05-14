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

const Security4 = () => {
  const { state, updateState } = useApp();
  const data = state.security?.part4 || {};

  const handleChange = (field, value) => {
    updateState(`security.part4.${field}`, value);
  };

  return (
    <FormPage
      title="Security and Background - Part 4"
      sectionId="security"
      prevRoute="/application/security3"
      prevLabel="Security Part 3"
      nextRoute="/application/security5"
      nextLabel="Security Part 5"
    >
      <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
        <span className="font-bold text-[#990000]">Important:</span> Answer all questions accurately and truthfully.
      </div>
      <div className="space-y-2">
        <SecurityQuestion
          question="Have you ever committed fraud or misrepresented yourself or others to obtain, or assist others to obtain, a visa or entry into the United States?"
          field="immigrationFraud" value={data.immigrationFraud || 'No'}
          onChange={(v) => handleChange('immigrationFraud', v)} />
        <SecurityQuestion
          question="Have you ever been removed or deported from any country?"
          field="removedFromUS" value={data.removedFromUS || 'No'}
          onChange={(v) => handleChange('removedFromUS', v)} />
        <SecurityQuestion
          question="Have you ever been deported from the United States?"
          field="deportedFromUS" value={data.deportedFromUS || 'No'}
          onChange={(v) => handleChange('deportedFromUS', v)} />
        <SecurityQuestion
          question="Have you ever withheld custody of a U.S. citizen child outside the United States from a person granted legal custody by a U.S. court?"
          field="childCustody" value={data.childCustodyViolation || 'No'}
          onChange={(v) => handleChange('childCustodyViolation', v)} />
        <SecurityQuestion
          question="Have you voted in the United States in violation of any law or regulation?"
          field="votingViolation" value={data.votingViolation || 'No'}
          onChange={(v) => handleChange('votingViolation', v)} />
        <SecurityQuestion
          question="Have you ever renounced United States citizenship for the purpose of avoiding taxation?"
          field="taxEvader" value={data.taxEvader || 'No'}
          onChange={(v) => handleChange('taxEvader', v)} />
      </div>
    </FormPage>
  );
};

export default Security4;
