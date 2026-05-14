import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';

const TravelCompanions = () => {
  const { state, updateState } = useApp();
  const data = state.travelCompanions || {};

  const handleChange = (field, value) => {
    updateState(`travelCompanions.${field}`, value);
  };

  const addCompanion = () => {
    const updated = [...(data.companions || []), { name: '', relationship: '' }];
    handleChange('companions', updated);
  };

  const updateCompanion = (index, field, value) => {
    const updated = [...(data.companions || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('companions', updated);
  };

  return (
    <FormPage
      title="Travel Companions"
      sectionId="travelCompanions"
      prevRoute="/application/travel"
      prevLabel="Travel"
      nextRoute="/application/previousTravel"
      nextLabel="Previous U.S. Travel"
    >
      <div className="space-y-3">
        {/* Traveling with others */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Are there other persons traveling with you? <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="travelWithOthers" id="travelWithY" className="m-0 mr-1"
              checked={data.travelingWithOthers === 'Yes'} onChange={() => handleChange('travelingWithOthers', 'Yes')} />
            <label htmlFor="travelWithY" className="text-[11px] mr-3">Yes</label>
            <input type="radio" name="travelWithOthers" id="travelWithN" className="m-0 mr-1"
              checked={data.travelingWithOthers === 'No'} onChange={() => handleChange('travelingWithOthers', 'No')} />
            <label htmlFor="travelWithN" className="text-[11px]">No</label>
          </div>
        </div>

        {data.travelingWithOthers === 'Yes' && (
          <div className="ml-[35%] bg-[#F9F9F9] border border-[#CCCCCC] p-2">
            <div className="mb-2">
              <label className="text-[12px] font-bold text-[#333333] block mb-1">Group Name (if part of a group)</label>
              <input type="text" className="w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                value={data.groupName || ''} onChange={(e) => handleChange('groupName', e.target.value)} />
            </div>

            {(data.companions || []).map((comp, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <div>
                  <label className="text-[10px] font-bold block">Name</label>
                  <input type="text" className="w-[150px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                    value={comp.name} onChange={(e) => updateCompanion(idx, 'name', e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold block">Relationship</label>
                  <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                    value={comp.relationship} onChange={(e) => updateCompanion(idx, 'relationship', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={addCompanion}
              className="text-[10px] font-bold text-[#003366] underline bg-transparent border-none cursor-pointer p-0">
              + Add Companion
            </button>
          </div>
        )}
      </div>
    </FormPage>
  );
};

export default TravelCompanions;
