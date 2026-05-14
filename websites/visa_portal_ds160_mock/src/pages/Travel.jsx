import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { VISA_TYPES } from '../utils/constants';

const Travel = () => {
  const { state, updateState } = useApp();
  const data = state.travel || {};

  const handleChange = (field, value) => {
    updateState(`travel.${field}`, value);
  };

  return (
    <FormPage
      title="Travel"
      sectionId="travel"
      prevRoute="/application/passport"
      prevLabel="Passport"
      nextRoute="/application/travelCompanions"
      nextLabel="Travel Companions"
    >
      <div className="space-y-3">
        {/* Purpose of Trip */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Purpose of Trip to the U.S. <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[300px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.purposeOfTrip || ''} onChange={(e) => handleChange('purposeOfTrip', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            {VISA_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* Specific Travel Plans */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Have you made specific travel plans? <span className="text-[#CC0000]">*</span></label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="travelPlans" id="travelPlansY" className="m-0 mr-1"
              checked={data.specificTravelPlans === 'Yes'} onChange={() => handleChange('specificTravelPlans', 'Yes')} />
            <label htmlFor="travelPlansY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="travelPlans" id="travelPlansN" className="m-0 mr-1"
              checked={data.specificTravelPlans === 'No'} onChange={() => handleChange('specificTravelPlans', 'No')} />
            <label htmlFor="travelPlansN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.specificTravelPlans === 'Yes' && (
          <>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Date of Arrival in the U.S.</label>
              </div>
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                placeholder="DD-MMM-YYYY"
                value={data.arrivalDate || ''} onChange={(e) => handleChange('arrivalDate', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Arrival City</label>
              </div>
              <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                value={data.arrivalCity || ''} onChange={(e) => handleChange('arrivalCity', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Date of Departure from the U.S.</label>
              </div>
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                placeholder="DD-MMM-YYYY"
                value={data.departureDate || ''} onChange={(e) => handleChange('departureDate', e.target.value)} />
            </div>
          </>
        )}

        {data.specificTravelPlans === 'No' && (
          <>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Intended Length of Stay</label>
              </div>
              <div className="flex items-center gap-1">
                <input type="text" className="w-[60px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                  value={data.lengthOfStay || ''} onChange={(e) => handleChange('lengthOfStay', e.target.value)} />
                <select className="w-[80px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
                  value={data.lengthOfStayUnit || 'Days'} onChange={(e) => handleChange('lengthOfStayUnit', e.target.value)}>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Address Where Staying */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Address Where You Will Stay in the U.S.</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.addressWhereStaying || ''} onChange={(e) => handleChange('addressWhereStaying', e.target.value)} />
        </div>

        {/* Who is Paying */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Who is paying for your trip?</label>
          </div>
          <select className="w-[200px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.payingForTrip || ''} onChange={(e) => handleChange('payingForTrip', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            <option value="SELF">SELF</option>
            <option value="OTHER PERSON">OTHER PERSON</option>
            <option value="OTHER COMPANY/ORGANIZATION">OTHER COMPANY/ORGANIZATION</option>
          </select>
        </div>
      </div>
    </FormPage>
  );
};

export default Travel;
