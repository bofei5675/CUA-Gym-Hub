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

const Security2 = () => {
  const { state, updateState } = useApp();
  const data = state.security?.part2 || {};

  const handleChange = (field, value) => {
    updateState(`security.part2.${field}`, value);
  };

  return (
    <FormPage
      title="Security and Background - Part 2"
      sectionId="security"
      prevRoute="/application/security1"
      prevLabel="Security Part 1"
      nextRoute="/application/security3"
      nextLabel="Security Part 3"
    >
      <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
        <span className="font-bold text-[#990000]">Important:</span> Answer all questions accurately and truthfully.
      </div>
      <div className="space-y-2">
        <SecurityQuestion
          question="Have you ever been arrested or convicted for any offense or crime, even though subject of a pardon, amnesty or other similar action?"
          field="arrested" value={data.arrestedOrConvicted || 'No'}
          onChange={(v) => handleChange('arrestedOrConvicted', v)} />
        <SecurityQuestion
          question="Have you ever violated, or engaged in a conspiracy to violate, any law relating to controlled substances?"
          field="controlled" value={data.controlledSubstancesViolator || 'No'}
          onChange={(v) => handleChange('controlledSubstancesViolator', v)} />
        <SecurityQuestion
          question="Are you coming to the United States to engage in prostitution or unlawful commercialized vice or have you been engaged in prostitution or procuring prostitutes within the past 10 years?"
          field="prostitution" value={data.prostitutionInvolved || 'No'}
          onChange={(v) => handleChange('prostitutionInvolved', v)} />
        <SecurityQuestion
          question="Have you ever been involved in, or do you seek to engage in, money laundering?"
          field="moneyLaundering" value={data.moneyLaunderingInvolved || 'No'}
          onChange={(v) => handleChange('moneyLaunderingInvolved', v)} />
        <SecurityQuestion
          question="Have you ever committed or conspired to commit a human trafficking offense in the United States or outside the United States?"
          field="humanTrafficking" value={data.humanTraffickingInvolved || 'No'}
          onChange={(v) => handleChange('humanTraffickingInvolved', v)} />
      </div>
    </FormPage>
  );
};

export default Security2;
