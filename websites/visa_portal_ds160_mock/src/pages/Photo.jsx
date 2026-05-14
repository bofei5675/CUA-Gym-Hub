import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';

const Photo = () => {
  const { state, updateState } = useApp();
  const data = state.photo || {};

  const handleChange = (field, value) => {
    updateState(`photo.${field}`, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('photoUrl', reader.result);
      handleChange('photoUploaded', true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    handleChange('photoUrl', '');
    handleChange('photoUploaded', false);
  };

  return (
    <FormPage
      title="Photo Upload"
      sectionId="photo"
      prevRoute="/application/security5"
      prevLabel="Security Part 5"
      nextRoute="/application/review"
      nextLabel="Review"
    >
      <div className="space-y-4">
        <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
          <span className="font-bold text-[#990000]">Photo Requirements:</span> Your photo must be a recent, color photo taken within the last 6 months. The photo must be 2x2 inches (51x51mm), with a white or off-white background.
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Upload Photo <span className="text-[#CC0000]">*</span>
            </label>
          </div>
          <div>
            {data.photoUploaded && data.photoUrl ? (
              <div className="flex items-start gap-3">
                <div className="border border-[#CCCCCC] p-1 bg-white">
                  <img
                    src={data.photoUrl}
                    alt="Uploaded passport photo"
                    className="w-[100px] h-[100px] object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-green-700 font-bold">Photo uploaded successfully.</div>
                  <button
                    onClick={handleRemovePhoto}
                    className="text-[10px] font-bold text-[#CC0000] underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="border-2 border-dashed border-[#7F9DB9] bg-[#F9F9F9] p-4 text-center w-[250px]">
                  <div className="text-[11px] text-gray-600 mb-2">Click to select a photo file</div>
                  <div className="text-[10px] text-gray-400 mb-3">JPG, JPEG, or PNG format</div>
                  <label className="cursor-pointer bg-[#003366] text-white font-bold text-[11px] px-3 py-[3px] hover:bg-[#002244]">
                    Choose File
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Maximum file size: 240 KB
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-4">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Photo Requirements</label>
          </div>
          <div className="text-[11px] text-[#333333] space-y-1">
            <div className="flex items-start gap-1">
              <span className="text-[#CC0000] font-bold">•</span>
              <span>The photo must be 2 x 2 inches (51 x 51 mm) in size.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-[#CC0000] font-bold">•</span>
              <span>Head must be between 1 inch and 1 3/8 inches (25 mm - 35 mm) from the bottom of the chin to the top of the head.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-[#CC0000] font-bold">•</span>
              <span>The background of the photo must be plain white or off-white.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-[#CC0000] font-bold">•</span>
              <span>Recent photo — taken within the last 6 months to reflect current appearance.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-[#CC0000] font-bold">•</span>
              <span>Photo must be in color.</span>
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
};

export default Photo;
