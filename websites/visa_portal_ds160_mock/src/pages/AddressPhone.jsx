import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { COUNTRIES } from '../utils/constants';

const AddressPhone = () => {
  const { state, updateState } = useApp();
  const data = state.addressAndPhone;

  const handleChange = (field, value) => {
    updateState(`addressAndPhone.${field}`, value);
  };

  const handleHomeChange = (field, value) => {
    updateState(`addressAndPhone.homeAddress.${field}`, value);
  };

  return (
    <FormPage
      title="Address and Phone"
      sectionId="address"
      prevRoute="/application/personal2"
      prevLabel="Personal 2"
      nextRoute="/application/passport"
      nextLabel="Passport"
    >
      <div className="space-y-3">
        <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1">Home Address</h3>

        {/* Street Address Line 1 */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Street Address (Line 1) <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.homeAddress.street1} onChange={(e) => handleHomeChange('street1', e.target.value)} />
        </div>

        {/* Street Address Line 2 */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Street Address (Line 2)</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.homeAddress.street2} onChange={(e) => handleHomeChange('street2', e.target.value)} />
        </div>

        {/* City */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">City <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.homeAddress.city} onChange={(e) => handleHomeChange('city', e.target.value)} />
        </div>

        {/* State */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">State/Province</label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.homeAddress.state} onChange={(e) => handleHomeChange('state', e.target.value)} />
        </div>

        {/* Zip */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Postal Code/Zip Code</label>
          </div>
          <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.homeAddress.zip} onChange={(e) => handleHomeChange('zip', e.target.value)} />
        </div>

        {/* Country */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Country <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.homeAddress.country} onChange={(e) => handleHomeChange('country', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Mailing Same */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-4">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Is your mailing address the same as your home address?</label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="mailingSame" id="mailingSameY" className="m-0 mr-1"
              checked={data.mailingSameAsHome === 'Yes'} onChange={() => handleChange('mailingSameAsHome', 'Yes')} />
            <label htmlFor="mailingSameY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="mailingSame" id="mailingSameN" className="m-0 mr-1"
              checked={data.mailingSameAsHome === 'No'} onChange={() => handleChange('mailingSameAsHome', 'No')} />
            <label htmlFor="mailingSameN" className="text-[11px]">No</label>
          </div>
        </div>

        <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1 mt-4">Phone and Email</h3>

        {/* Primary Phone */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Primary Phone Number <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.primaryPhone} onChange={(e) => handleChange('primaryPhone', e.target.value)} />
        </div>

        {/* Secondary Phone */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Secondary Phone Number</label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.secondaryPhone} onChange={(e) => handleChange('secondaryPhone', e.target.value)} />
        </div>

        {/* Work Phone */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Work Phone Number</label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.workPhone} onChange={(e) => handleChange('workPhone', e.target.value)} />
        </div>

        {/* Primary Email */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Email Address <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.primaryEmail} onChange={(e) => handleChange('primaryEmail', e.target.value)} />
        </div>

        {/* Secondary Email */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Secondary Email Address</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.secondaryEmail} onChange={(e) => handleChange('secondaryEmail', e.target.value)} />
        </div>
      </div>
    </FormPage>
  );
};

export default AddressPhone;
