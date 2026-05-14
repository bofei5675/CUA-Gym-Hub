import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

const RELATIONSHIP_OPTIONS = [
  '',
  'Son',
  'Daughter',
  'Stepson',
  'Stepdaughter',
  'Foster child',
  'Brother',
  'Sister',
  'Half brother',
  'Half sister',
  'Stepbrother',
  'Stepsister',
  'Grandchild',
  'Niece',
  'Nephew',
  'Parent',
  'Other',
];

const MONTHS_OPTIONS = Array.from({ length: 13 }, (_, i) => i); // 0-12

function DependentsList() {
  const { state, dispatch } = useContext(TaxContext);
  const dependents = state.dependents || [];
  const [errors, setErrors] = useState({}); // keyed by `${depId}-${field}`
  const [ssnVisible, setSsnVisible] = useState({}); // keyed by depId, true = visible

  const addDependent = () => {
    dispatch({
      type: 'ADD_ARRAY_ITEM',
      section: 'dependents',
      item: {
        id: Date.now().toString(),
        firstName: '',
        lastName: '',
        ssn: '',
        relationship: '',
        dateOfBirth: '',
        monthsLived: 12,
      },
    });
  };

  const removeDependent = (id) => {
    dispatch({ type: 'REMOVE_ARRAY_ITEM', section: 'dependents', id });
    // Clear errors for removed dependent
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${id}-`)) delete next[key];
      });
      return next;
    });
  };

  const updateDependent = (id, field, value) => {
    dispatch({
      type: 'UPDATE_ARRAY_ITEM',
      section: 'dependents',
      id,
      data: { [field]: value },
    });
  };

  const handleBlur = (depId, field) => {
    const dep = dependents.find((d) => d.id === depId);
    if (!dep) return;

    const key = `${depId}-${field}`;
    let error = null;

    if (field === 'firstName' && !dep.firstName.trim()) {
      error = 'First name is required';
    } else if (field === 'lastName' && !dep.lastName.trim()) {
      error = 'Last name is required';
    } else if (field === 'ssn') {
      const digits = dep.ssn.replace(/\D/g, '');
      if (!digits) error = 'SSN is required';
      else if (digits.length !== 9) error = 'SSN must be 9 digits';
    } else if (field === 'relationship' && !dep.relationship) {
      error = 'Relationship is required';
    } else if (field === 'dateOfBirth' && !dep.dateOfBirth) {
      error = 'Date of birth is required';
    }

    setErrors((prev) => {
      if (error) return { ...prev, [key]: error };
      const next = { ...prev };
      delete next[key];
      return next;
    });
    if (field === 'ssn') {
      setSsnVisible((prev) => ({ ...prev, [depId]: false }));
    }
  };

  // SSN formatting for dependents
  const handleSSNChange = (depId, e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 9) raw = raw.slice(0, 9);
    updateDependent(depId, 'ssn', raw);
  };

  const formatSSNDisplay = (depId, ssn) => {
    if (!ssn) return '';
    const digits = ssn.replace(/\D/g, '');
    if (ssnVisible[depId]) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    }
    if (digits.length <= 4) return digits;
    return `XXX-XX-${digits.slice(-4)}`;
  };

  const fieldError = (depId, field) => {
    const msg = errors[`${depId}-${field}`];
    return msg ? <p className="mt-1 text-xs text-ftb-error">{msg}</p> : null;
  };

  return (
    <section className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
        <h2 className="text-xl font-semibold text-ftb-blue">Dependents</h2>
        <button
          type="button"
          onClick={addDependent}
          className="inline-flex items-center gap-1 px-4 py-2 bg-ftb-blue text-white text-sm font-medium rounded-md hover:bg-ftb-blue-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Dependent
        </button>
      </div>

      {dependents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No dependents added</p>
          <p className="text-gray-400 text-xs mt-1">
            Click "Add Dependent" to add a dependent to your return
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {dependents.map((dep, index) => (
            <div
              key={dep.id}
              className="border border-gray-200 rounded-sm p-4 bg-gray-50 relative"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-ftb-blue">
                  Dependent {index + 1}
                  {dep.firstName && dep.lastName
                    ? ` - ${dep.firstName} ${dep.lastName}`
                    : ''}
                </h3>
                <button
                  type="button"
                  onClick={() => removeDependent(dep.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-ftb-error hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ftb-error"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name <span className="text-ftb-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={dep.firstName}
                    onChange={(e) => updateDependent(dep.id, 'firstName', e.target.value)}
                    onBlur={() => handleBlur(dep.id, 'firstName')}
                    placeholder="First name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
                  />
                  {fieldError(dep.id, 'firstName')}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name <span className="text-ftb-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={dep.lastName}
                    onChange={(e) => updateDependent(dep.id, 'lastName', e.target.value)}
                    onBlur={() => handleBlur(dep.id, 'lastName')}
                    placeholder="Last name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
                  />
                  {fieldError(dep.id, 'lastName')}
                </div>

                {/* SSN */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    SSN <span className="text-ftb-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatSSNDisplay(dep.id, dep.ssn)}
                      onChange={(e) => handleSSNChange(dep.id, e)}
                      onFocus={() => setSsnVisible((prev) => ({ ...prev, [dep.id]: true }))}
                      onBlur={() => handleBlur(dep.id, 'ssn')}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
                    />
                    <button
                      type="button"
                      onClick={() => setSsnVisible((prev) => ({ ...prev, [dep.id]: !prev[dep.id] }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                      tabIndex={-1}
                    >
                      {ssnVisible[dep.id] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {fieldError(dep.id, 'ssn')}
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Relationship <span className="text-ftb-error">*</span>
                  </label>
                  <select
                    value={dep.relationship}
                    onChange={(e) => updateDependent(dep.id, 'relationship', e.target.value)}
                    onBlur={() => handleBlur(dep.id, 'relationship')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue bg-white"
                  >
                    {RELATIONSHIP_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r || 'Select relationship'}
                      </option>
                    ))}
                  </select>
                  {fieldError(dep.id, 'relationship')}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-ftb-error">*</span>
                  </label>
                  <input
                    type="date"
                    value={dep.dateOfBirth}
                    onChange={(e) => updateDependent(dep.id, 'dateOfBirth', e.target.value)}
                    onBlur={() => handleBlur(dep.id, 'dateOfBirth')}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue"
                  />
                  {fieldError(dep.id, 'dateOfBirth')}
                </div>

                {/* Months Lived in Home */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Months Lived in Home
                  </label>
                  <select
                    value={dep.monthsLived}
                    onChange={(e) =>
                      updateDependent(dep.id, 'monthsLived', parseInt(e.target.value, 10))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-ftb-blue bg-white"
                  >
                    {MONTHS_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} month{m !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Add another button at bottom */}
          <div className="pt-2">
            <button
              type="button"
              onClick={addDependent}
              className="inline-flex items-center gap-1 text-sm text-ftb-blue hover:text-ftb-blue-hover font-medium hover:underline focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Another Dependent
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DependentsList;
