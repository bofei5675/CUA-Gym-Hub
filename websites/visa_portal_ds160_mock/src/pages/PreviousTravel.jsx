import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';

const PreviousTravel = () => {
  const { state, updateState } = useApp();
  const data = state.previousUSTravel || {};

  const handleChange = (field, value) => {
    updateState(`previousUSTravel.${field}`, value);
  };

  return (
    <FormPage
      title="Previous U.S. Travel"
      sectionId="previousTravel"
      prevRoute="/application/travelCompanions"
      prevLabel="Travel Companions"
      nextRoute="/application/usContact"
      nextLabel="U.S. Contact"
    >
      <div className="space-y-3">
        {/* Previously in US */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Have you ever been in the U.S.? <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="prevInUS" id="prevInUSY" className="m-0 mr-1"
              checked={data.previouslyInUS === 'Yes'} onChange={() => handleChange('previouslyInUS', 'Yes')} />
            <label htmlFor="prevInUSY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="prevInUS" id="prevInUSN" className="m-0 mr-1"
              checked={data.previouslyInUS === 'No'} onChange={() => handleChange('previouslyInUS', 'No')} />
            <label htmlFor="prevInUSN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.previouslyInUS === 'Yes' && (
          <>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Date of Last Arrival</label>
              </div>
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                placeholder="DD-MMM-YYYY"
                value={data.arrivalDate || ''} onChange={(e) => handleChange('arrivalDate', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Length of Stay</label>
              </div>
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                value={data.lengthOfStay || ''} onChange={(e) => handleChange('lengthOfStay', e.target.value)} />
            </div>
          </>
        )}

        {/* Previous Visa */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Have you ever been issued a U.S. Visa? <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="prevVisa" id="prevVisaY" className="m-0 mr-1"
              checked={data.previousVisaIssued === 'Yes'} onChange={() => handleChange('previousVisaIssued', 'Yes')} />
            <label htmlFor="prevVisaY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="prevVisa" id="prevVisaN" className="m-0 mr-1"
              checked={data.previousVisaIssued === 'No'} onChange={() => handleChange('previousVisaIssued', 'No')} />
            <label htmlFor="prevVisaN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.previousVisaIssued === 'Yes' && (
          <>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Date Last Visa Was Issued</label>
              </div>
              <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                placeholder="DD-MMM-YYYY"
                value={data.previousVisaDate || ''} onChange={(e) => handleChange('previousVisaDate', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Visa Number</label>
              </div>
              <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                value={data.previousVisaNumber || ''} onChange={(e) => handleChange('previousVisaNumber', e.target.value)} />
            </div>
            <div className="grid grid-cols-[35%_65%] gap-2 items-start">
              <div className="text-right pt-1">
                <label className="text-[12px] font-bold text-[#333333]">Are you applying for the same type of visa?</label>
              </div>
              <div className="flex items-center pt-1">
                <input type="radio" name="sameType" id="sameTypeY" className="m-0 mr-1"
                  checked={data.sameTypeVisa === 'Yes'} onChange={() => handleChange('sameTypeVisa', 'Yes')} />
                <label htmlFor="sameTypeY" className="text-[11px] mr-3">Yes</label>
                <input type="radio" name="sameType" id="sameTypeN" className="m-0 mr-1"
                  checked={data.sameTypeVisa === 'No'} onChange={() => handleChange('sameTypeVisa', 'No')} />
                <label htmlFor="sameTypeN" className="text-[11px]">No</label>
              </div>
            </div>
          </>
        )}

        {/* Visa Refused */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Have you ever been refused a U.S. Visa? <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="visaRefused" id="visaRefusedY" className="m-0 mr-1"
              checked={data.visaEverRefused === 'Yes'} onChange={() => handleChange('visaEverRefused', 'Yes')} />
            <label htmlFor="visaRefusedY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="visaRefused" id="visaRefusedN" className="m-0 mr-1"
              checked={data.visaEverRefused === 'No'} onChange={() => handleChange('visaEverRefused', 'No')} />
            <label htmlFor="visaRefusedN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.visaEverRefused === 'Yes' && (
          <div className="grid grid-cols-[35%_65%] gap-2 items-start">
            <div className="text-right pt-1">
              <label className="text-[12px] font-bold text-[#333333]">Explain</label>
            </div>
            <textarea className="w-[300px] h-[60px] border-[#7F9DB9] px-1 text-[11px]"
              value={data.visaRefusedDetails || ''} onChange={(e) => handleChange('visaRefusedDetails', e.target.value)} />
          </div>
        )}

        {/* Immigration Petition */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Has anyone ever filed an immigration petition on your behalf? <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="immPetition" id="immPetitionY" className="m-0 mr-1"
              checked={data.immigrationPetitionFiled === 'Yes'} onChange={() => handleChange('immigrationPetitionFiled', 'Yes')} />
            <label htmlFor="immPetitionY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="immPetition" id="immPetitionN" className="m-0 mr-1"
              checked={data.immigrationPetitionFiled === 'No'} onChange={() => handleChange('immigrationPetitionFiled', 'No')} />
            <label htmlFor="immPetitionN" className="text-[11px]">No</label>
          </div>
        </div>
      </div>
    </FormPage>
  );
};

export default PreviousTravel;
