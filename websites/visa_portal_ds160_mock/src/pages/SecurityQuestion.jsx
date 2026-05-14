import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SecurityQuestion = () => {
  const navigate = useNavigate();
  const { state, updateState } = useApp();
  const [question, setQuestion] = useState(state.securityQuestion || '');
  const [answer, setAnswer] = useState(state.securityAnswer || '');

  const handleSubmit = () => {
    if (!question || !answer) {
      alert("Please select a security question and provide an answer.");
      return;
    }
    updateState('securityQuestion', question);
    updateState('securityAnswer', answer);
    navigate('/application/id-generation');
  };

  return (
    <div className="w-full font-sans text-[13px]">
      <h2 className="text-[#003366] text-[18px] font-serif font-bold border-b border-black pb-1 mb-3">
        Security Question
      </h2>

      <div className="bg-[#E8F0F8] p-2 mb-4 border border-[#6688AA]">
        <p className="mb-2">
          <span className="font-bold text-[#990000]">Please choose a security question.</span> You will need to answer this question to retrieve your application if you stop and return later.
        </p>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Security Question <span className="text-[#CC0000]">*</span></label>
        <select
          className="w-full max-w-[600px] border border-[#7F9DB9] p-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
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
          className="w-full max-w-[600px] border border-[#7F9DB9] p-1"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-[#003366] text-white font-bold px-4 py-1 shadow-btn hover:bg-[#002244]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SecurityQuestion;
