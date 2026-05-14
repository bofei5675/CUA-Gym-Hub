import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';
import SpouseInfo from './SpouseInfo';
import { Tooltip } from './Tooltip';

const FILING_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married/RDP Filing Jointly' },
  { value: 'married_separate', label: 'Married/RDP Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
  { value: 'qualifying_widow', label: 'Qualifying Surviving Spouse/RDP' },
];

const SUFFIX_OPTIONS = ['', 'SR', 'JR', 'II', 'III', 'IV'];

function PersonalInfoForm() {
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

  const handleAddressChange = (field, value) => {
    update({
      address: { ...personalInfo.address, [field]: value },
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'ssn') setSsnVisible(false);
  };

  // --- Validation helpers ---
  const validateRequired = (field, label) => {
    if (!touched[field]) return null;
    if (!personalInfo[field] || !personalInfo[field].trim()) return `${label} is required`;
    return null;
  };

  const validateSSN = () => {
    if (!touched.ssn) return null;
    if (!personalInfo.ssn) return 'SSN is required';
    const digits = personalInfo.ssn.replace(/\D/g, '');
    if (digits.length !== 9) return 'SSN must be 9 digits';
    return null;
  };

  const validateZip = () => {
    if (!touched['address.zip']) return null;
    if (!personalInfo.address.zip) return 'ZIP code is required';
    if (!/^\d{5}(-\d{4})?$/.test(personalInfo.address.zip)) return 'Invalid ZIP format (e.g. 90210)';
    return null;
  };

  const validateEmail = () => {
    if (!touched.email) return null;
    if (!personalInfo.email) return null; // email is optional
    if (!/^\S+@\S+\.\S+$/.test(personalInfo.email)) return 'Invalid email format';
    return null;
  };

  const validatePhone = () => {
    if (!touched.phone) return null;
    if (!personalInfo.phone) return null; // phone is optional
    const digits = personalInfo.phone.replace(/\D/g, '');
    if (digits.length < 10) return 'Phone number must be at least 10 digits';
    return null;
  };

  // --- SSN formatting ---
  const handleSSNChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 9) raw = raw.slice(0, 9);
    handleChange('ssn', raw);
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
    const masked = 'X'.repeat(Math.min(digits.length - 4, 5));
    const last4 = digits.slice(-4);
    if (digits.length <= 3) return masked;
    if (digits.length <= 5) return `XXX-${masked.slice(3)}${last4}`;
    return `XXX-XX-${last4}`;
  };

  // --- Phone formatting ---
  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 10) raw = raw.slice(0, 10);
    // Format as (XXX) XXX-XXXX
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
    } else if (raw.length > 3) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    } else if (raw.length > 0) {
      formatted = `(${raw}`;
    }
    handleChange('phone', formatted);
  };

  const showSpouse =
    personalInfo.filingStatus === 'married_joint' ||
    personalInfo.filingStatus === 'married_separate';

  const fieldError = (msg) =>
    msg ? <p className="mt-1 text-sm text-ftb-error">{msg}</p> : null;

  return (
    <div className="space-y-8">
      {/* Filing Status */}
      <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-ftb-blue border-b border-gray-200 pb-3 mb-5">
          Filing Status <Tooltip id="filing-status" />
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the filing status that applies to you for tax year 2024.
        </p>
        <div className="space-y-3">
          {FILING_STATUSES.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-3 p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="filingStatus"
                value={status.value}
                checked={personalInfo.filingStatus === status.value}
                onChange={(e) => handleChange('filingStatus', e.target.value)}
                className="w-4 h-4 text-ftb-blue focus:ring-ftb-blue"
              />
              <span className="text-sm font-medium text-gray-700">{status.label}</span>
            </label>
          ))}
        </div>
        {touched.filingStatus && !personalInfo.filingStatus && (
          <p className="mt-2 text-sm text-ftb-error">Please select a filing status</p>
        )}
      </section>

      {/* Taxpayer Information */}
      <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-ftb-blue border-b border-gray-200 pb-3 mb-5">
          Taxpayer Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* First Name */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-ftb-error">*</span>
            </label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="First name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
            {fieldError(validateRequired('firstName', 'First name'))}
          </div>

          {/* Middle Initial */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle Initial
            </label>
            <input
              type="text"
              maxLength={1}
              value={personalInfo.middleInitial}
              onChange={(e) => handleChange('middleInitial', e.target.value.toUpperCase())}
              placeholder="M"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
          </div>

          {/* Last Name */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-ftb-error">*</span>
            </label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Last name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
            {fieldError(validateRequired('lastName', 'Last name'))}
          </div>

          {/* Suffix */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
            <select
              value={personalInfo.suffix}
              onChange={(e) => handleChange('suffix', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue bg-white"
            >
              {SUFFIX_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s || 'None'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* SSN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Security Number <span className="text-ftb-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatSSNDisplay(personalInfo.ssn)}
                onChange={handleSSNChange}
                onBlur={() => handleBlur('ssn')}
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

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-ftb-error">*</span>
            </label>
            <input
              type="date"
              value={personalInfo.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
            {fieldError(
              touched.dateOfBirth && !personalInfo.dateOfBirth
                ? 'Date of birth is required'
                : null
            )}
          </div>
        </div>
      </section>

      {/* Spouse Information (conditional) */}
      {showSpouse && <SpouseInfo />}

      {/* Address */}
      <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-ftb-blue border-b border-gray-200 pb-3 mb-5">
          Home Address
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Street */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-ftb-error">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                onBlur={() => handleBlur('address.street')}
                placeholder="123 Main Street"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
              />
              {fieldError(
                touched['address.street'] && !personalInfo.address.street
                  ? 'Street address is required'
                  : null
              )}
            </div>

            {/* Apt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apt/Suite/Unit
              </label>
              <input
                type="text"
                value={personalInfo.address.apt}
                onChange={(e) => handleAddressChange('apt', e.target.value)}
                placeholder="Apt 4B"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-ftb-error">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                onBlur={() => handleBlur('address.city')}
                placeholder="Sacramento"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
              />
              {fieldError(
                touched['address.city'] && !personalInfo.address.city
                  ? 'City is required'
                  : null
              )}
            </div>

            {/* State (fixed CA) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value="CA"
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* ZIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code <span className="text-ftb-error">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.address.zip}
                onChange={(e) => handleAddressChange('zip', e.target.value)}
                onBlur={() => handleBlur('address.zip')}
                placeholder="90210"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
              />
              {fieldError(validateZip())}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-ftb-blue border-b border-gray-200 pb-3 mb-5">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daytime Phone Number
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
            {fieldError(validatePhone())}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
            />
            {fieldError(validateEmail())}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PersonalInfoForm;
