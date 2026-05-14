import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { COUNTRIES } from '../utils/constants';

const Family = () => {
  const { state, updateState } = useApp();
  const data = state.family || {};

  const handleChange = (field, value) => {
    updateState(`family.${field}`, value);
  };

  return (
    <FormPage
      title="Family Information: Relatives"
      sectionId="family"
      prevRoute="/application/usContact"
      prevLabel="U.S. Contact"
      nextRoute="/application/work"
      nextLabel="Work / Education"
    >
      <div className="space-y-3">
        <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1">Father's Information</h3>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Father's Surname <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
            value={data.fatherSurname || ''} onChange={(e) => handleChange('fatherSurname', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Father's Given Names <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
            value={data.fatherGivenName || ''} onChange={(e) => handleChange('fatherGivenName', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Father's Date of Birth</label>
          </div>
          <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            placeholder="DD-MMM-YYYY"
            value={data.fatherDOB || ''} onChange={(e) => handleChange('fatherDOB', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Is your father in the U.S.?</label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="fatherInUS" id="fatherInUSY" className="m-0 mr-1"
              checked={data.fatherInUS === 'Yes'} onChange={() => handleChange('fatherInUS', 'Yes')} />
            <label htmlFor="fatherInUSY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="fatherInUS" id="fatherInUSN" className="m-0 mr-1"
              checked={data.fatherInUS === 'No'} onChange={() => handleChange('fatherInUS', 'No')} />
            <label htmlFor="fatherInUSN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.fatherInUS === 'Yes' && (
          <div className="grid grid-cols-[35%_65%] gap-2 items-start">
            <div className="text-right pt-1">
              <label className="text-[12px] font-bold text-[#333333]">Father's U.S. Status</label>
            </div>
            <select className="w-[200px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
              value={data.fatherUSStatus || ''} onChange={(e) => handleChange('fatherUSStatus', e.target.value)}>
              <option value="">- SELECT ONE -</option>
              <option value="U.S. CITIZEN">U.S. CITIZEN</option>
              <option value="U.S. LPR">U.S. LPR (LAWFUL PERMANENT RESIDENT)</option>
              <option value="NONIMMIGRANT">NONIMMIGRANT</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        )}

        <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1 mt-4">Mother's Information</h3>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Mother's Surname <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
            value={data.motherSurname || ''} onChange={(e) => handleChange('motherSurname', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Mother's Given Names <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
            value={data.motherGivenName || ''} onChange={(e) => handleChange('motherGivenName', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Mother's Date of Birth</label>
          </div>
          <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            placeholder="DD-MMM-YYYY"
            value={data.motherDOB || ''} onChange={(e) => handleChange('motherDOB', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Is your mother in the U.S.?</label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="motherInUS" id="motherInUSY" className="m-0 mr-1"
              checked={data.motherInUS === 'Yes'} onChange={() => handleChange('motherInUS', 'Yes')} />
            <label htmlFor="motherInUSY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="motherInUS" id="motherInUSN" className="m-0 mr-1"
              checked={data.motherInUS === 'No'} onChange={() => handleChange('motherInUS', 'No')} />
            <label htmlFor="motherInUSN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.motherInUS === 'Yes' && (
          <div className="grid grid-cols-[35%_65%] gap-2 items-start">
            <div className="text-right pt-1">
              <label className="text-[12px] font-bold text-[#333333]">Mother's U.S. Status</label>
            </div>
            <select className="w-[200px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
              value={data.motherUSStatus || ''} onChange={(e) => handleChange('motherUSStatus', e.target.value)}>
              <option value="">- SELECT ONE -</option>
              <option value="U.S. CITIZEN">U.S. CITIZEN</option>
              <option value="U.S. LPR">U.S. LPR (LAWFUL PERMANENT RESIDENT)</option>
              <option value="NONIMMIGRANT">NONIMMIGRANT</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        )}

        {state.personalInfo?.personal1?.maritalStatus === 'MARRIED' && (
          <>
            <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1 mt-4">Spouse Information</h3>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Spouse's Surname</label>
              </div>
              <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
                value={data.spouseSurname || ''} onChange={(e) => handleChange('spouseSurname', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Spouse's Given Names</label>
              </div>
              <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
                value={data.spouseGivenName || ''} onChange={(e) => handleChange('spouseGivenName', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Spouse's Date of Birth</label>
              </div>
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                placeholder="DD-MMM-YYYY"
                value={data.spouseDOB || ''} onChange={(e) => handleChange('spouseDOB', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Spouse's Nationality</label>
              </div>
              <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
                value={data.spouseNationality || ''} onChange={(e) => handleChange('spouseNationality', e.target.value)}>
                <option value="">- SELECT ONE -</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </>
        )}
      </div>
    </FormPage>
  );
};

export default Family;
