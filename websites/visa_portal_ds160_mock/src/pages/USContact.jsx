import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { US_STATES } from '../utils/constants';

const USContact = () => {
  const { state, updateState } = useApp();
  const data = state.usContact || {};

  const handleChange = (field, value) => {
    updateState(`usContact.${field}`, value);
  };

  return (
    <FormPage
      title="U.S. Point of Contact Information"
      sectionId="usContact"
      prevRoute="/application/previousTravel"
      prevLabel="Previous U.S. Travel"
      nextRoute="/application/family"
      nextLabel="Family"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Contact Person or Organization Name <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.contactName || ''} onChange={(e) => handleChange('contactName', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Organization Name</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.organizationName || ''} onChange={(e) => handleChange('organizationName', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Relationship to You <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[200px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.relationship || ''} onChange={(e) => handleChange('relationship', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            <option value="RELATIVE">RELATIVE</option>
            <option value="FRIEND">FRIEND</option>
            <option value="BUSINESS ASSOCIATE">BUSINESS ASSOCIATE</option>
            <option value="EMPLOYER">EMPLOYER</option>
            <option value="SCHOOL">SCHOOL</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">U.S. Street Address <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">City <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.city || ''} onChange={(e) => handleChange('city', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">State <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[200px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.state || ''} onChange={(e) => handleChange('state', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">ZIP Code <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[100px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.zip || ''} onChange={(e) => handleChange('zip', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Phone Number <span className="text-[#CC0000]">*</span></label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Email Address</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
        </div>
      </div>
    </FormPage>
  );
};

export default USContact;
