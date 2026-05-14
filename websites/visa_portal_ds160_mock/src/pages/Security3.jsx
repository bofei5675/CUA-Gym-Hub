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

const Security3 = () => {
  const { state, updateState } = useApp();
  const data = state.security?.part3 || {};

  const handleChange = (field, value) => {
    updateState(`security.part3.${field}`, value);
  };

  return (
    <FormPage
      title="Security and Background - Part 3"
      sectionId="security"
      prevRoute="/application/security2"
      prevLabel="Security Part 2"
      nextRoute="/application/security4"
      nextLabel="Security Part 4"
    >
      <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
        <span className="font-bold text-[#990000]">Important:</span> Answer all questions accurately and truthfully.
      </div>
      <div className="space-y-2">
        <SecurityQuestion
          question="Do you seek to engage in espionage, sabotage, export control violations, or any other illegal activity while in the United States?"
          field="espionage" value={data.espionageInvolved || 'No'}
          onChange={(v) => handleChange('espionageInvolved', v)} />
        <SecurityQuestion
          question="Do you seek to engage in terrorist activities while in the United States or have you ever engaged in terrorist activities?"
          field="terrorist" value={data.terroristActivity || 'No'}
          onChange={(v) => handleChange('terroristActivity', v)} />
        <SecurityQuestion
          question="Have you ever or do you intend to provide financial assistance or other support to terrorists or terrorist organizations?"
          field="financialTerrorism" value={data.financialAssistanceTerrorism || 'No'}
          onChange={(v) => handleChange('financialAssistanceTerrorism', v)} />
        <SecurityQuestion
          question="Are you a member or representative of a terrorist organization?"
          field="memberTerrorist" value={data.memberTerroristOrg || 'No'}
          onChange={(v) => handleChange('memberTerroristOrg', v)} />
      </div>
    </FormPage>
  );
};

export default Security3;
