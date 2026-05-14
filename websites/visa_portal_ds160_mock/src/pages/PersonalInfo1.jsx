import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const COUNTRIES = [
  'AFGHANISTAN','ALBANIA','ALGERIA','ANDORRA','ANGOLA','ANTIGUA AND BARBUDA','ARGENTINA','ARMENIA','AUSTRALIA',
  'AUSTRIA','AZERBAIJAN','BAHAMAS','BAHRAIN','BANGLADESH','BARBADOS','BELARUS','BELGIUM','BELIZE','BENIN',
  'BHUTAN','BOLIVIA','BOSNIA AND HERZEGOVINA','BOTSWANA','BRAZIL','BRUNEI','BULGARIA','BURKINA FASO','BURUNDI',
  'CABO VERDE','CAMBODIA','CAMEROON','CANADA','CENTRAL AFRICAN REPUBLIC','CHAD','CHILE','CHINA','COLOMBIA',
  'COMOROS','CONGO','COSTA RICA','CROATIA','CUBA','CYPRUS','CZECH REPUBLIC','DENMARK','DJIBOUTI','DOMINICA',
  'DOMINICAN REPUBLIC','ECUADOR','EGYPT','EL SALVADOR','EQUATORIAL GUINEA','ERITREA','ESTONIA','ESWATINI',
  'ETHIOPIA','FIJI','FINLAND','FRANCE','GABON','GAMBIA','GEORGIA','GERMANY','GHANA','GREECE','GRENADA',
  'GUATEMALA','GUINEA','GUINEA-BISSAU','GUYANA','HAITI','HONDURAS','HUNGARY','ICELAND','INDIA','INDONESIA',
  'IRAN','IRAQ','IRELAND','ISRAEL','ITALY','JAMAICA','JAPAN','JORDAN','KAZAKHSTAN','KENYA','KIRIBATI',
  'KOREA, NORTH','KOREA, SOUTH','KOSOVO','KUWAIT','KYRGYZSTAN','LAOS','LATVIA','LEBANON','LESOTHO','LIBERIA',
  'LIBYA','LIECHTENSTEIN','LITHUANIA','LUXEMBOURG','MADAGASCAR','MALAWI','MALAYSIA','MALDIVES','MALI','MALTA',
  'MARSHALL ISLANDS','MAURITANIA','MAURITIUS','MEXICO','MICRONESIA','MOLDOVA','MONACO','MONGOLIA','MONTENEGRO',
  'MOROCCO','MOZAMBIQUE','MYANMAR','NAMIBIA','NAURU','NEPAL','NETHERLANDS','NEW ZEALAND','NICARAGUA','NIGER',
  'NIGERIA','NORTH MACEDONIA','NORWAY','OMAN','PAKISTAN','PALAU','PALESTINE','PANAMA','PAPUA NEW GUINEA',
  'PARAGUAY','PERU','PHILIPPINES','POLAND','PORTUGAL','QATAR','ROMANIA','RUSSIA','RWANDA',
  'SAINT KITTS AND NEVIS','SAINT LUCIA','SAINT VINCENT AND THE GRENADINES','SAMOA','SAN MARINO',
  'SAO TOME AND PRINCIPE','SAUDI ARABIA','SENEGAL','SERBIA','SEYCHELLES','SIERRA LEONE','SINGAPORE',
  'SLOVAKIA','SLOVENIA','SOLOMON ISLANDS','SOMALIA','SOUTH AFRICA','SOUTH SUDAN','SPAIN','SRI LANKA',
  'SUDAN','SURINAME','SWEDEN','SWITZERLAND','SYRIA','TAIWAN','TAJIKISTAN','TANZANIA','THAILAND',
  'TIMOR-LESTE','TOGO','TONGA','TRINIDAD AND TOBAGO','TUNISIA','TURKEY','TURKMENISTAN','TUVALU',
  'UGANDA','UKRAINE','UNITED ARAB EMIRATES','UNITED KINGDOM','UNITED STATES','URUGUAY','UZBEKISTAN',
  'VANUATU','VATICAN CITY','VENEZUELA','VIETNAM','YEMEN','ZAMBIA','ZIMBABWE'
];

const PersonalInfo1 = () => {
  const navigate = useNavigate();
  const { state, updateState } = useApp();
  const data = state.personalInfo.personal1;
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    updateState(`personalInfo.personal1.${field}`, value);
    if (errors[field]) {
      setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
    }
  };

  const handleSave = () => {
    updateState('meta.lastSavedAt', new Date().toISOString());
    alert('Application saved successfully.');
  };

  const handleBack = () => {
    navigate('/application/id-generation');
  };

  const handleNext = () => {
    const newErrors = {};
    if (!data.surname) newErrors.surname = true;
    if (!data.givenName) newErrors.givenName = true;
    if (!data.nativeFullName && !data.nativeFullNameDoesNotApply) newErrors.nativeFullName = true;
    if (!data.sex) newErrors.sex = true;
    if (!data.maritalStatus) newErrors.maritalStatus = true;
    if (!data.dobDay) newErrors.dobDay = true;
    if (!data.dobMonth) newErrors.dobMonth = true;
    if (!data.dobYear) newErrors.dobYear = true;
    if (!data.pobCity) newErrors.pobCity = true;
    if (!data.pobCountry) newErrors.pobCountry = true;
    if (!data.pobState && !data.pobStateDoesNotApply) newErrors.pobState = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill in all required fields marked with *");
      return;
    }

    // Mark section complete
    if (!state.completedSections?.includes('personal1')) {
      const updated = [...(state.completedSections || []), 'personal1'];
      updateState('completedSections', updated);
    }
    updateState('ds160Application.currentSection', 'personal2');
    navigate('/application/personal2');
  };

  const handlePrint = () => { window.print(); };

  const addOtherName = () => {
    const updated = [...(data.otherNames || []), { surname: '', givenName: '' }];
    handleChange('otherNames', updated);
  };

  const updateOtherName = (index, field, value) => {
    const updated = [...(data.otherNames || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('otherNames', updated);
  };

  const errorBorder = (field) => errors[field] ? 'border-[#CC0000] bg-[#FFF0F0]' : '';

  return (
    <div className="w-full font-sans text-[13px]">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-black pb-1 mb-3">
        <h2 className="text-[#003366] text-[18px] font-serif font-bold">
          Personal Information 1
        </h2>
        <div className="flex gap-2 text-[10px] font-bold">
          <button onClick={handlePrint} className="text-[#003366] underline bg-transparent border-none cursor-pointer p-0 text-[10px] font-bold">Print</button>
          <span className="text-[#003366] underline cursor-help" title="For help, hover over the blue 'i' icons next to each field.">Help</span>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-[#FFEEEE] border border-[#CC0000] text-[#990000] p-2 mb-3 text-[11px] font-bold">
          Please correct the highlighted fields below before proceeding.
        </div>
      )}

      <p className="text-[11px] mb-4 text-black">
        <span className="font-bold">NOTE:</span> Data on this page must match the information as it is written in your passport.
      </p>

      {/* Form Fields */}
      <div className="space-y-2">

        {/* Surnames */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Surnames <span className="required-star text-[#CC0000]">*</span>
            </label>
            <div className="text-[10px] text-gray-500 italic leading-tight">(e.g., FERNANDEZ GARCIA)</div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className={`w-[250px] h-[20px] uppercase border-[#7F9DB9] px-1 text-[11px] ${errorBorder('surname')}`}
              value={data.surname}
              onChange={(e) => handleChange('surname', e.target.value)}
            />
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Enter your surname(s) as they appear on your passport.">i</div>
          </div>
        </div>

        {/* Given Names */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Given Names <span className="required-star text-[#CC0000]">*</span>
            </label>
            <div className="text-[10px] text-gray-500 italic leading-tight">(e.g., JUAN MIGUEL)</div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className={`w-[250px] h-[20px] uppercase border-[#7F9DB9] px-1 text-[11px] ${errorBorder('givenName')}`}
              value={data.givenName}
              onChange={(e) => handleChange('givenName', e.target.value)}
            />
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Enter your given name(s) as they appear on your passport.">i</div>
          </div>
        </div>

        {/* Full Name in Native Alphabet */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Full Name in Native Alphabet <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input
                type="text"
                className={`w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px] ${errorBorder('nativeFullName')}`}
                disabled={data.nativeFullNameDoesNotApply}
                value={data.nativeFullName}
                onChange={(e) => handleChange('nativeFullName', e.target.value)}
              />
              <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Provide your full name in your native alphabet (e.g., non-Roman characters).">i</div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="native_dna"
                className="m-0 mr-1"
                checked={data.nativeFullNameDoesNotApply}
                onChange={(e) => handleChange('nativeFullNameDoesNotApply', e.target.checked)}
              />
              <label htmlFor="native_dna" className="text-[10px] text-black">Does Not Apply/Technology Not Available</label>
            </div>
          </div>
        </div>

        {/* Other Names Used */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Have you ever used other names (i.e., maiden, religious, professional, alias, etc.)? <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div>
            <div className="flex items-center pt-1">
              <input
                type="radio" name="otherNames" id="otherNamesY"
                className="m-0 mr-1"
                checked={data.otherNamesUsed === 'Yes'}
                onChange={() => handleChange('otherNamesUsed', 'Yes')}
              />
              <label htmlFor="otherNamesY" className="text-[11px] mr-3">Yes</label>

              <input
                type="radio" name="otherNames" id="otherNamesN"
                className="m-0 mr-1"
                checked={data.otherNamesUsed === 'No'}
                onChange={() => handleChange('otherNamesUsed', 'No')}
              />
              <label htmlFor="otherNamesN" className="text-[11px]">No</label>
              <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Indicate if you have ever used any other names.">i</div>
            </div>
            {data.otherNamesUsed === 'Yes' && (
              <div className="mt-2 ml-0 bg-[#F9F9F9] border border-[#CCCCCC] p-2">
                {(data.otherNames || []).map((name, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <div>
                      <label className="text-[10px] font-bold block">Surname</label>
                      <input type="text" className="w-[120px] h-[20px] uppercase border-[#7F9DB9] px-1 text-[11px]"
                        value={name.surname} onChange={(e) => updateOtherName(idx, 'surname', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold block">Given Name</label>
                      <input type="text" className="w-[120px] h-[20px] uppercase border-[#7F9DB9] px-1 text-[11px]"
                        value={name.givenName} onChange={(e) => updateOtherName(idx, 'givenName', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addOtherName}
                  className="text-[10px] font-bold text-[#003366] underline bg-transparent border-none cursor-pointer p-0">
                  + Add Another Name
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Telecode Name */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Do you have a telecode that represents your name? <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div>
            <div className="flex items-center pt-1">
              <input type="radio" name="telecode" id="telecodeY" className="m-0 mr-1"
                checked={data.telecodeName === 'Yes'}
                onChange={() => handleChange('telecodeName', 'Yes')}
              />
              <label htmlFor="telecodeY" className="text-[11px] mr-3">Yes</label>
              <input type="radio" name="telecode" id="telecodeN" className="m-0 mr-1"
                checked={data.telecodeName === 'No'}
                onChange={() => handleChange('telecodeName', 'No')}
              />
              <label htmlFor="telecodeN" className="text-[11px]">No</label>
              <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="A telecode is a 4-digit numeric code used to represent Chinese characters.">i</div>
            </div>
            {data.telecodeName === 'Yes' && (
              <div className="mt-2 ml-0 bg-[#F9F9F9] border border-[#CCCCCC] p-2">
                <div className="flex gap-2 mb-1">
                  <div>
                    <label className="text-[10px] font-bold block">Surname Telecode</label>
                    <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                      value={(data.telecodeNames && data.telecodeNames[0]) || ''}
                      onChange={(e) => {
                        const arr = [...(data.telecodeNames || ['', ''])];
                        arr[0] = e.target.value;
                        handleChange('telecodeNames', arr);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold block">Given Name Telecode</label>
                    <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
                      value={(data.telecodeNames && data.telecodeNames[1]) || ''}
                      onChange={(e) => {
                        const arr = [...(data.telecodeNames || ['', ''])];
                        arr[1] = e.target.value;
                        handleChange('telecodeNames', arr);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sex */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Sex <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input type="radio" name="sex" id="sexM" className="m-0 mr-1"
              checked={data.sex === 'Male'}
              onChange={() => handleChange('sex', 'Male')}
            />
            <label htmlFor="sexM" className="text-[11px] mr-3">Male</label>
            <input type="radio" name="sex" id="sexF" className="m-0 mr-1"
              checked={data.sex === 'Female'}
              onChange={() => handleChange('sex', 'Female')}
            />
            <label htmlFor="sexF" className="text-[11px]">Female</label>
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Select your sex as it appears on your passport.">i</div>
            {errors.sex && <span className="ml-2 text-[#CC0000] text-[10px] font-bold">Required</span>}
          </div>
        </div>

        {/* Marital Status */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Marital Status <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center">
            <select className={`w-[180px] h-[20px] text-[11px] border-[#7F9DB9] bg-white ${errorBorder('maritalStatus')}`}
              value={data.maritalStatus}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
            >
              <option value="">- SELECT ONE -</option>
              <option value="MARRIED">MARRIED</option>
              <option value="SINGLE">SINGLE</option>
              <option value="WIDOWED">WIDOWED</option>
              <option value="DIVORCED">DIVORCED</option>
              <option value="LEGALLY SEPARATED">LEGALLY SEPARATED</option>
              <option value="OTHER">OTHER</option>
            </select>
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Select your current marital status.">i</div>
          </div>
        </div>

        {/* DOB */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Date of Birth <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center gap-1">
            <input type="text" placeholder="DD"
              className={`w-[30px] h-[20px] text-center border-[#7F9DB9] text-[11px] ${errorBorder('dobDay')}`}
              value={data.dobDay}
              onChange={(e) => handleChange('dobDay', e.target.value.replace(/\D/g, '').slice(0, 2))}
            />
            <span className="text-[11px]">-</span>
            <select className={`w-[80px] h-[20px] text-[11px] border-[#7F9DB9] bg-white ${errorBorder('dobMonth')}`}
              value={data.dobMonth}
              onChange={(e) => handleChange('dobMonth', e.target.value)}
            >
              <option value="">MONTH</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <span className="text-[11px]">-</span>
            <input type="text" placeholder="YYYY"
              className={`w-[50px] h-[20px] text-center border-[#7F9DB9] text-[11px] ${errorBorder('dobYear')}`}
              value={data.dobYear}
              onChange={(e) => handleChange('dobYear', e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Enter your date of birth.">i</div>
          </div>
        </div>

        {/* City of Birth */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              City of Birth <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center">
            <input type="text"
              className={`w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] ${errorBorder('pobCity')}`}
              value={data.pobCity}
              onChange={(e) => handleChange('pobCity', e.target.value)}
            />
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Enter your city of birth.">i</div>
          </div>
        </div>

        {/* State/Province of Birth */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              State/Province of Birth <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <input type="text"
                className={`w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px] ${errorBorder('pobState')}`}
                disabled={data.pobStateDoesNotApply}
                value={data.pobState}
                onChange={(e) => handleChange('pobState', e.target.value)}
              />
              <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Enter your state or province of birth.">i</div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="state_dna" className="m-0 mr-1"
                checked={data.pobStateDoesNotApply}
                onChange={(e) => {
                  handleChange('pobStateDoesNotApply', e.target.checked);
                  if (e.target.checked) handleChange('pobState', '');
                }}
              />
              <label htmlFor="state_dna" className="text-[10px] text-black">Does Not Apply</label>
            </div>
          </div>
        </div>

        {/* Country of Birth */}
        <div className="grid grid-cols-[35%_65%] gap-2 items-start mt-3">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">
              Country/Region of Birth <span className="required-star text-[#CC0000]">*</span>
            </label>
          </div>
          <div className="flex items-center">
            <select className={`w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white ${errorBorder('pobCountry')}`}
              value={data.pobCountry}
              onChange={(e) => handleChange('pobCountry', e.target.value)}
            >
              <option value="">- SELECT ONE -</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="ml-2 w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px] cursor-help" title="Select your country/region of birth.">i</div>
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end gap-2 border-t border-gray-300 pt-4">
        <button
          onClick={handleBack}
          className="text-black font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-gray-200 border border-[#888888]"
          style={{background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)'}}
        >
          Back: Getting Started
        </button>
        <button
          onClick={handleSave}
          className="text-black font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-gray-200 border border-[#888888]"
          style={{background: 'linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 100%)'}}
        >
          Save
        </button>
        <button
          onClick={handleNext}
          className="text-white font-bold text-[11px] px-3 py-[2px] shadow-btn hover:bg-[#002244] border border-[#002244]"
          style={{background: 'linear-gradient(to bottom, #004488 0%, #003366 100%)'}}
        >
          Next: Personal 2
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo1;
