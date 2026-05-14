import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { COUNTRIES, MONTHS } from '../utils/constants';

const Passport = () => {
  const { state, updateState } = useApp();
  const data = state.passport || {};

  const handleChange = (field, value) => {
    updateState(`passport.${field}`, value);
  };

  return (
    <FormPage
      title="Passport"
      sectionId="passport"
      prevRoute="/application/address"
      prevLabel="Address & Phone"
      nextRoute="/application/travel"
      nextLabel="Travel"
    >
      <div className="space-y-3">
        {/* Passport Type */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Passport/Travel Document Type <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.passportType || ''} onChange={(e) => handleChange('passportType', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            <option value="REGULAR">REGULAR</option>
            <option value="OFFICIAL">OFFICIAL</option>
            <option value="DIPLOMATIC">DIPLOMATIC</option>
            <option value="LAISSEZ-PASSER">LAISSEZ-PASSER</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        {/* Passport Number */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Passport/Travel Document Number <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] uppercase"
            value={data.passportNumber || ''} onChange={(e) => handleChange('passportNumber', e.target.value)} />
        </div>

        {/* Passport Book Number */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Passport Book Number</label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                disabled={data.passportBookNumberDoesNotApply}
                value={data.passportBookNumber || ''} onChange={(e) => handleChange('passportBookNumber', e.target.value)} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="bookNum_dna" className="m-0 mr-1"
                checked={data.passportBookNumberDoesNotApply || false}
                onChange={(e) => {
                  handleChange('passportBookNumberDoesNotApply', e.target.checked);
                  if (e.target.checked) handleChange('passportBookNumber', '');
                }} />
              <label htmlFor="bookNum_dna" className="text-[10px] text-black">Does Not Apply</label>
            </div>
          </div>
        </div>

        {/* Country of Issuance */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Country/Authority That Issued Passport <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.issuingCountry || ''} onChange={(e) => handleChange('issuingCountry', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* City of Issuance */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">City Where Issued <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.issuingCity || ''} onChange={(e) => handleChange('issuingCity', e.target.value)} />
        </div>

        {/* Issuance Date */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Issuance Date <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            placeholder="DD-MMM-YYYY"
            value={data.issuanceDate || ''} onChange={(e) => handleChange('issuanceDate', e.target.value)} />
        </div>

        {/* Expiration Date */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Expiration Date <span className="text-[#CC0000]">*</span></label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                placeholder="DD-MMM-YYYY"
                disabled={data.expirationDateDoesNotApply}
                value={data.expirationDate || ''} onChange={(e) => handleChange('expirationDate', e.target.value)} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="exp_dna" className="m-0 mr-1"
                checked={data.expirationDateDoesNotApply || false}
                onChange={(e) => {
                  handleChange('expirationDateDoesNotApply', e.target.checked);
                  if (e.target.checked) handleChange('expirationDate', '');
                }} />
              <label htmlFor="exp_dna" className="text-[10px] text-black">Does Not Apply</label>
            </div>
          </div>
        </div>

        {/* Lost/Stolen */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Have you ever lost a passport or had one stolen? <span className="text-[#CC0000]">*</span></label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="lostStolen" id="lostY" className="m-0 mr-1"
              checked={data.lostOrStolen === 'Yes'} onChange={() => handleChange('lostOrStolen', 'Yes')} />
            <label htmlFor="lostY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="lostStolen" id="lostN" className="m-0 mr-1"
              checked={data.lostOrStolen === 'No'} onChange={() => handleChange('lostOrStolen', 'No')} />
            <label htmlFor="lostN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.lostOrStolen === 'Yes' && (
          <>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Lost Passport Number</label>
              </div>
              <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                value={data.lostPassportNumber || ''} onChange={(e) => handleChange('lostPassportNumber', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Country That Issued Lost Passport</label>
              </div>
              <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
                value={data.lostPassportCountry || ''} onChange={(e) => handleChange('lostPassportCountry', e.target.value)}>
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

export default Passport;
