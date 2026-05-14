import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RetrieveApplication = () => {
  const navigate = useNavigate();
  const { state, updateState } = useApp();
  const [formData, setFormData] = useState({
    appId: '',
    location: '',
    question: '',
    answer: ''
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleRetrieve = () => {
    if (!formData.appId || !formData.location || !formData.question || !formData.answer) {
      setError('Please fill in all required fields.');
      window.scrollTo(0, 0);
      return;
    }

    const storedAppId = state.ds160Application.applicationId;
    const storedQuestion = state.securityQuestion;
    const storedAnswer = state.securityAnswer;

    if (!storedAppId || formData.appId.toUpperCase() !== storedAppId.toUpperCase()) {
      setError('Information does not match our records. Please verify your Application ID and try again.');
      window.scrollTo(0, 0);
      return;
    }

    if (storedQuestion && formData.question !== storedQuestion) {
      setError('The security question you selected does not match our records.');
      window.scrollTo(0, 0);
      return;
    }

    if (storedAnswer && formData.answer.toLowerCase() !== storedAnswer.toLowerCase()) {
      setError('The answer you provided does not match our records. Please try again.');
      window.scrollTo(0, 0);
      return;
    }

    updateState('ds160Application.location', formData.location);
    navigate('/application/personal1');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white p-4 font-sans text-[13px]">
      <h2 className="text-[#003366] text-[22px] font-serif border-b border-[#CCCCCC] pb-1 mb-3">
        Retrieve Application
      </h2>

      {error && (
        <div className="bg-[#FFEEEE] border border-[#CC0000] text-[#990000] p-2 mb-4 font-bold text-[12px]">
          {error}
        </div>
      )}

      <div className="max-w-[600px]">
        <div className="mb-4">
          <label className="block font-bold mb-1">Application ID <span className="text-[#CC0000]">*</span></label>
          <input
            type="text"
            className="w-full border border-[#7F9DB9] p-1 uppercase"
            value={formData.appId}
            onChange={(e) => handleChange('appId', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1">Location <span className="text-[#CC0000]">*</span></label>
          <select
            className="w-full border border-[#7F9DB9] p-1"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          >
            <option value="">- SELECT ONE -</option>
            <option value="CAN">CANADA, TORONTO</option>
            <option value="CHN">CHINA, BEIJING</option>
            <option value="FRA">FRANCE, PARIS</option>
            <option value="GBR">UNITED KINGDOM, LONDON</option>
            <option value="IND">INDIA, NEW DELHI</option>
            <option value="MEX">MEXICO, MEXICO CITY</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1">Security Question <span className="text-[#CC0000]">*</span></label>
          <select
            className="w-full border border-[#7F9DB9] p-1"
            value={formData.question}
            onChange={(e) => handleChange('question', e.target.value)}
          >
            <option value="">- SELECT ONE -</option>
            <option value="MOTHERS_MAIDEN_NAME">WHAT IS YOUR MOTHER'S MAIDEN NAME?</option>
            <option value="PET_NAME">WHAT IS THE NAME OF YOUR FIRST PET?</option>
            <option value="FAVORITE_CITY">WHAT IS YOUR FAVORITE CITY?</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-1">Answer <span className="text-[#CC0000]">*</span></label>
          <input
            type="text"
            className="w-full border border-[#7F9DB9] p-1"
            value={formData.answer}
            onChange={(e) => handleChange('answer', e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRetrieve}
            className="bg-[#800000] text-white font-bold px-4 py-1 shadow-btn hover:bg-[#600000]"
          >
            Retrieve Application
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-[#F0F0F0] border border-[#999999] text-black font-bold px-4 py-1 shadow-btn hover:bg-[#E0E0E0]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetrieveApplication;
