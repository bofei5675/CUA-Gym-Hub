import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CAPTCHA_CODE = 'CMXPHE';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Landing = () => {
  const navigate = useNavigate();
  const { updateState, generateAppId } = useApp();
  const [location, setLocation] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState(CAPTCHA_CODE);
  const [captchaError, setCaptchaError] = useState('');
  const [locationError, setLocationError] = useState('');

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptcha('');
    setCaptchaError('');
  };

  const handleStart = () => {
    let hasError = false;

    if (!location) {
      setLocationError('Please select a location.');
      hasError = true;
    } else {
      setLocationError('');
    }

    if (!captcha) {
      setCaptchaError('Please enter the code shown in the image.');
      hasError = true;
    } else if (captcha.toUpperCase() !== captchaCode) {
      setCaptchaError('The code you entered does not match. Please try again.');
      setCaptchaCode(generateCaptcha());
      setCaptcha('');
      hasError = true;
    } else {
      setCaptchaError('');
    }

    if (hasError) return;

    updateState('ds160Application.location', location);
    generateAppId();
    navigate('/application/security-question');
  };

  return (
    <div className="bg-white px-2 py-2 font-sans">
      <h2 className="text-[#003366] text-[22px] font-serif border-b border-[#CCCCCC] pb-1 mb-3">
        Apply For a Nonimmigrant Visa
      </h2>

      {/* Tooltip Info Bar */}
      <div className="bg-[#FFFFCC] p-[6px] mb-4 border border-[#CCCCCC] text-[11px] leading-tight font-sans text-black">
        <span className="font-bold text-[#990000]">Tooltip Language:</span> English [View Tool Tip Help]
        <br/>
        <span className="text-[#990000]">Most of this application has been translated. To see the translation point your mouse over any sentence on the page.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        {/* Left Column */}
        <div className="text-[13px] text-black leading-snug font-sans">
          <div className="mb-4">
            <h3 className="text-[#990000] font-bold text-[12px] mb-2">Welcome!</h3>
            <p className="mb-3">
              The first step in applying for a U.S. nonimmigrant visa is to complete your application. It takes approximately 90 minutes to do this. After you submit your application, you can move on to the next steps such as scheduling your interview.
            </p>
          </div>

          <div className="border-t border-dotted border-[#999999] pt-2 mb-4">
            <h3 className="text-[#003366] font-bold text-[12px] mb-2">Important: Before You Start</h3>
            <ol className="list-decimal list-inside space-y-1 pl-1 marker:font-normal">
              <li>Learn about <a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/all-visa-categories.html" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Types of Visas</a>.</li>
              <li>
                <span className="font-bold italic underline">This website is designed to be accessed using Chrome, Edge, or Firefox only.</span>
              </li>
              <li><a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application/ds-160-faqs.html" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Gather your documents</a>.</li>
              <li>Review the <a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application.html" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">instructions</a> and <a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application/ds-160-faqs.html" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">FAQ</a>.</li>
            </ol>
          </div>

          <div className="border-t border-dotted border-[#999999] pt-2">
            <h3 className="text-[#003366] font-bold text-[12px] mb-2">Notes:</h3>
            <p className="mb-3">
              Other people can assist you with your visa application. Note that under U.S. law (22 C.F.R. 41.103) you must electronically sign and submit your own application unless you qualify for an exemption. Even if someone else helped you complete the application, you (the applicant) must click the "Sign Application" button, or your application may not be accepted.
            </p>
            <p className="italic">
              **Please be patient as you use this form. Download times may vary depending on your internet connection speed.**
            </p>
          </div>
        </div>

        {/* Right Column - Get Started Box */}
        <div className="bg-white">
          <h3 className="text-[#990000] font-bold text-[12px] mb-2 border-b border-[#CCCCCC] pb-1">Get Started</h3>

          <div className="mb-3">
            <label className="block text-[11px] mb-1 text-black">Select a location where you will be applying for this visa</label>
            {locationError && <div className="text-[#CC0000] text-[10px] font-bold mb-1">{locationError}</div>}
            <div className="flex items-center">
                <div className="text-blue-300 mr-1">🌐</div>
                <select
                className={`w-full border text-[11px] h-[20px] bg-white ${locationError ? 'border-[#CC0000] bg-[#FFF0F0]' : 'border-[#7F9DB9]'}`}
                value={location}
                onChange={(e) => { setLocation(e.target.value); setLocationError(''); }}
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
          </div>

          <div className="mb-4">
            <label className="block text-[11px] mb-1 text-black">Enter the code as shown:</label>
            {captchaError && <div className="text-[#CC0000] text-[10px] font-bold mb-1">{captchaError}</div>}
            <input
              type="text"
              className={`border w-[120px] h-[20px] mb-1 px-1 text-[11px] ${captchaError ? 'border-[#CC0000] bg-[#FFF0F0]' : 'border-[#7F9DB9]'}`}
              value={captcha}
              onChange={(e) => { setCaptcha(e.target.value); setCaptchaError(''); }}
              maxLength={6}
            />
            <div className="flex items-center gap-1">
                <div className="bg-white border border-black w-[180px] h-[45px] flex items-center justify-center overflow-hidden relative select-none">
                    <span className="font-serif text-3xl font-bold italic tracking-tighter transform -skew-x-12 blur-[0.5px]">{captchaCode}</span>
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>
                <div className="flex flex-col gap-1">
                    <button
                      onClick={handleRefreshCaptcha}
                      className="w-6 h-6 bg-[#F0F0F0] border border-[#999999] flex items-center justify-center text-[14px] hover:bg-[#E0E0E0] text-black font-bold"
                      title="Refresh CAPTCHA"
                      type="button"
                    >
                      ↻
                    </button>
                    <button
                      onClick={() => {
                        const msg = `The CAPTCHA code is: ${captchaCode}`;
                        if ('speechSynthesis' in window) {
                          const utterance = new SpeechSynthesisUtterance(captchaCode.split('').join(' '));
                          utterance.rate = 0.7;
                          window.speechSynthesis.speak(utterance);
                        } else {
                          alert(msg);
                        }
                      }}
                      className="w-6 h-6 bg-[#F0F0F0] border border-[#999999] flex items-center justify-center text-[14px] hover:bg-[#E0E0E0] text-black font-bold"
                      title="Audio CAPTCHA"
                      type="button"
                    >
                      🔊
                    </button>
                </div>
            </div>
          </div>

          {/* Start Application Block */}
          <div className="bg-gradient-to-b from-[#99CCFF] to-[#E8F0F8] p-[4px] border border-[#6688AA] mb-2 rounded-sm">
            <p className="text-[11px] mb-2 px-1 text-black leading-tight">
              Select a location and make sure you have the documents and information you will need.
            </p>
            <div className="flex justify-end">
                <button
                onClick={handleStart}
                className="bg-[#CC0000] hover:bg-[#aa0000] text-white font-bold text-[11px] py-[4px] px-4 border border-[#880000] shadow-btn flex items-center gap-1"
                style={{background: 'linear-gradient(to bottom, #CC0000 0%, #990000 100%)'}}
                type="button"
                >
                START AN APPLICATION
                <span className="text-[8px]">▶</span>
                </button>
            </div>
          </div>

          {/* Retrieve Application Block */}
          <div className="bg-gradient-to-b from-[#E8F0F8] to-[#D0E0F0] p-[4px] border border-[#6688AA] mb-4 rounded-sm">
            <p className="text-[11px] mb-2 px-1 text-black leading-tight">
              You will be asked for your application ID and answer a security question.
            </p>
            <div className="flex justify-end">
                <button
                  onClick={() => navigate('/retrieve')}
                  className="text-white font-bold text-[11px] py-[4px] px-4 border border-[#500000] shadow-btn flex items-center gap-1"
                  style={{background: 'linear-gradient(to bottom, #800000 0%, #500000 100%)'}}
                  type="button"
                >
                RETRIEVE AN APPLICATION
                <span className="text-[8px]">▶</span>
                </button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
             <div
               onClick={() => navigate('/application/photo')}
               className="bg-[#E8F0F8] border border-[#6688AA] p-2 text-center cursor-pointer hover:bg-[#D0E0F0] flex flex-col items-center justify-center shadow-sm"
             >
                <div className="font-bold text-[#003366] text-[11px]">UPLOAD PHOTO</div>
             </div>
             <div
               onClick={() => navigate('/application/confirmation')}
               className="bg-[#E8F0F8] border border-[#6688AA] p-2 text-center cursor-pointer hover:bg-[#D0E0F0] flex flex-col items-center justify-center shadow-sm"
             >
                <div className="font-bold text-[#003366] text-[11px]">VIEW CONFIRMATION</div>
             </div>
          </div>

          <div className="mt-4 text-[11px] text-black">
            <h4 className="text-[#003366] font-bold mb-1">Additional Information</h4>
            <ul className="list-none space-y-1">
              <li className="pl-3 relative before:content-['»'] before:absolute before:left-0 before:font-bold">
                <span className="font-bold">Write down the Application ID</span> displayed on the top right hand corner of the page. If you close your browser window, you will need your ID to access your application again.
              </li>
              <li className="pl-3 relative before:content-['»'] before:absolute before:left-0 before:font-bold">
                <span className="font-bold">Save your application frequently.</span> The system will time out after 20 minutes of inactivity, and you will lose all unsaved information.
              </li>
              <li className="pl-3 relative before:content-['»'] before:absolute before:left-0 before:font-bold">
                Read more about U.S. visas at <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">travel.state.gov</a>.
              </li>
              <li className="pl-3 relative before:content-['»'] before:absolute before:left-0 before:font-bold">
                Visit the website of the <a href="https://www.usembassy.gov" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">U.S. Embassy or Consulate</a>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
