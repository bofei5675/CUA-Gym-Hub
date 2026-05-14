import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { COUNTRIES } from '../utils/constants';

const PersonalInfo2 = () => {
  const { state, updateState } = useApp();
  const data = state.personalInfo.personal2;

  const handleChange = (field, value) => {
    updateState(`personalInfo.personal2.${field}`, value);
  };

  return (
    <FormPage
      title="Personal Information 2"
      sectionId="personal2"
      prevRoute="/application/personal1"
      prevLabel="Personal 1"
      nextRoute="/application/address"
      nextLabel="Address & Phone"
    >
      <div className="space-y-3">
        {/* Nationality */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Nationality <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center">
            <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
              value={data.nationality} onChange={(e) => handleChange('nationality', e.target.value)}>
              <option value="">- SELECT ONE -</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Other Nationalities */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Do you hold or have you held any nationality other than indicated above? <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="otherNat" id="otherNatY" className="m-0 mr-1"
              checked={data.otherNationalities === 'Yes'}
              onChange={() => handleChange('otherNationalities', 'Yes')} />
            <label htmlFor="otherNatY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="otherNat" id="otherNatN" className="m-0 mr-1"
              checked={data.otherNationalities === 'No'}
              onChange={() => handleChange('otherNationalities', 'No')} />
            <label htmlFor="otherNatN" className="text-[11px]">No</label>
          </div>
        </div>

        {/* National ID */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              National Identification Number
            </label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input type="text" className="w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                disabled={data.nationalIdDoesNotApply}
                value={data.nationalId} onChange={(e) => handleChange('nationalId', e.target.value)} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="natId_dna" className="m-0 mr-1"
                checked={data.nationalIdDoesNotApply}
                onChange={(e) => {
                  handleChange('nationalIdDoesNotApply', e.target.checked);
                  if (e.target.checked) handleChange('nationalId', '');
                }} />
              <label htmlFor="natId_dna" className="text-[10px] text-black">Does Not Apply</label>
            </div>
          </div>
        </div>

        {/* SSN */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              U.S. Social Security Number
            </label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input type="text" className="w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                disabled={data.ssnDoesNotApply}
                value={data.ssn} onChange={(e) => handleChange('ssn', e.target.value)}
                placeholder="XXX-XX-XXXX" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="ssn_dna" className="m-0 mr-1"
                checked={data.ssnDoesNotApply}
                onChange={(e) => {
                  handleChange('ssnDoesNotApply', e.target.checked);
                  if (e.target.checked) handleChange('ssn', '');
                }} />
              <label htmlFor="ssn_dna" className="text-[10px] text-black">Does Not Apply</label>
            </div>
          </div>
        </div>

        {/* ITIN */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              U.S. Taxpayer ID Number
            </label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input type="text" className="w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                disabled={data.itinDoesNotApply}
                value={data.itin} onChange={(e) => handleChange('itin', e.target.value)} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="itin_dna" className="m-0 mr-1"
                checked={data.itinDoesNotApply}
                onChange={(e) => {
                  handleChange('itinDoesNotApply', e.target.checked);
                  if (e.target.checked) handleChange('itin', '');
                }} />
              <label htmlFor="itin_dna" className="text-[10px] text-black">Does Not Apply</label>
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
};

export default PersonalInfo2;
