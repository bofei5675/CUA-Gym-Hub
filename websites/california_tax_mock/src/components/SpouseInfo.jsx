import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

function SpouseInfo() {
  const { state, dispatch } = useContext(TaxContext);
  const personalInfo = state.personalInfo;
  const [touched, setTouched] = useState({});
  const [ssnVisible, setSsnVisible] = useState(false);

  const update = (data) => {
    dispatch({ type: 'UPDATE_SECTION', section: 'personalInfo', data });
  };

  const handleChange = (field, value) => {
    update({ [field]: value });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'spouseSsn') setSsnVisible(false);
  };

  // --- SSN formatting ---
  const handleSSNChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 9) raw = raw.slice(0, 9);
    handleChange('spouseSsn', raw);
  };

  const formatSSNDisplay = (ssn) => {
    if (!ssn) return '';
    const digits = ssn.replace(/\D/g, '');
    if (ssnVisible) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    }
    // Masked: show only last 4
    if (digits.length <= 4) return digits;
    return `XXX-XX-${digits.slice(-4)}`;
  };

  // --- Validation ---
  const validateRequired = (field, label) => {
    if (!touched[field]) return null;
    const value = personalInfo[field];
    if (!value || !value.trim()) return `${label} is required`;
    return null;
  };

  const validateSSN = () => {
    if (!touched.spouseSsn) return null;
    if (!personalInfo.spouseSsn) return "Spouse's SSN is required";
    const digits = personalInfo.spouseSsn.replace(/\D/g, '');
    if (digits.length !== 9) return 'SSN must be 9 digits';
    return null;
  };

  const fieldError = (msg) =>
    msg ? <p className="mt-1 text-sm text-ftb-error">{msg}</p> : null;

  return (
    <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-ftb-blue border-b border-gray-200 pb-3 mb-5">
        Spouse/RDP Information
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter your spouse or registered domestic partner's information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Spouse First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spouse First Name <span className="text-ftb-error">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.spouseFirstName}
            onChange={(e) => handleChange('spouseFirstName', e.target.value)}
            onBlur={() => handleBlur('spouseFirstName')}
            placeholder="First name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
          />
          {fieldError(validateRequired('spouseFirstName', "Spouse's first name"))}
        </div>

        {/* Spouse Middle Initial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spouse Middle Initial
          </label>
          <input
            type="text"
            maxLength={1}
            value={personalInfo.spouseMiddleInitial}
            onChange={(e) => handleChange('spouseMiddleInitial', e.target.value.toUpperCase())}
            placeholder="M"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
          />
        </div>

        {/* Spouse Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spouse Last Name <span className="text-ftb-error">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.spouseLastName}
            onChange={(e) => handleChange('spouseLastName', e.target.value)}
            onBlur={() => handleBlur('spouseLastName')}
            placeholder="Last name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
          />
          {fieldError(validateRequired('spouseLastName', "Spouse's last name"))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spouse SSN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spouse SSN <span className="text-ftb-error">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatSSNDisplay(personalInfo.spouseSsn)}
              onChange={handleSSNChange}
              onBlur={() => handleBlur('spouseSsn')}
              onFocus={() => setSsnVisible(true)}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
            <button
              type="button"
              onClick={() => setSsnVisible(!ssnVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
              tabIndex={-1}
            >
              {ssnVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {fieldError(validateSSN())}
        </div>

        {/* Spouse Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spouse Date of Birth <span className="text-ftb-error">*</span>
          </label>
          <input
            type="date"
            value={personalInfo.spouseDateOfBirth}
            onChange={(e) => handleChange('spouseDateOfBirth', e.target.value)}
            onBlur={() => handleBlur('spouseDateOfBirth')}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
          />
          {fieldError(
            touched.spouseDateOfBirth && !personalInfo.spouseDateOfBirth
              ? "Spouse's date of birth is required"
              : null
          )}
        </div>
      </div>
    </section>
  );
}

export default SpouseInfo;
