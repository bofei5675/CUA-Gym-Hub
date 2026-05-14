import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

const emptyW2 = () => ({
  id: Date.now(),
  employerName: '',
  employerEin: '',
  wages: '',
  federalWithheld: '',
  stateWages: '',
  stateWithheld: '',
});

function formatCurrency(value) {
  if (value === '' || value === undefined || value === null) return '';
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseCurrency(str) {
  if (str === '' || str === undefined || str === null) return '';
  const cleaned = String(str).replace(/[^0-9.]/g, '');
  if (cleaned === '') return '';
  return cleaned;
}

function formatEin(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + '-' + digits.slice(2);
}

function validateEin(ein) {
  return /^\d{2}-\d{7}$/.test(ein);
}

export default function W2Form() {
  const { state, dispatch } = useContext(TaxContext);
  const w2s = state.income?.w2s || [];
  const [errors, setErrors] = useState({});

  const addW2 = () => {
    dispatch({
      type: 'ADD_ARRAY_ITEM',
      section: 'income',
      field: 'w2s',
      item: emptyW2(),
    });
  };

  const removeW2 = (id) => {
    dispatch({
      type: 'REMOVE_ARRAY_ITEM',
      section: 'income',
      field: 'w2s',
      id,
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateW2Field = (id, field, rawValue) => {
    const w2 = w2s.find((w) => w.id === id);
    if (!w2) return;

    let value = rawValue;

    if (field === 'employerEin') {
      value = formatEin(rawValue);
    }

    if (['wages', 'federalWithheld', 'stateWages', 'stateWithheld'].includes(field)) {
      value = parseCurrency(rawValue);
      const num = parseFloat(value);
      if (value !== '' && !isNaN(num) && num < 0) {
        setErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], [field]: 'Amount cannot be negative' },
        }));
        return;
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          if (next[id]) {
            delete next[id][field];
            if (Object.keys(next[id]).length === 0) delete next[id];
          }
          return next;
        });
      }
    }

    if (field === 'employerEin' && value.length > 0) {
      const digits = value.replace(/\D/g, '');
      if (digits.length === 9 && !validateEin(value)) {
        setErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], employerEin: 'EIN must be XX-XXXXXXX format' },
        }));
      } else if (digits.length === 9 && validateEin(value)) {
        setErrors((prev) => {
          const next = { ...prev };
          if (next[id]) {
            delete next[id].employerEin;
            if (Object.keys(next[id]).length === 0) delete next[id];
          }
          return next;
        });
      }
    }

    const updatedW2s = w2s.map((w) => (w.id === id ? { ...w, [field]: value } : w));
    dispatch({
      type: 'UPDATE_SECTION',
      section: 'income',
      data: { w2s: updatedW2s },
    });
  };

  const handleCurrencyBlur = (id, field) => {
    const w2 = w2s.find((w) => w.id === id);
    if (!w2) return;
    const val = w2[field];
    if (val === '' || val === undefined) return;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const formatted = num.toFixed(2);
      const updatedW2s = w2s.map((w) => (w.id === id ? { ...w, [field]: formatted } : w));
      dispatch({
        type: 'UPDATE_SECTION',
        section: 'income',
        data: { w2s: updatedW2s },
      });
    }
  };

  const totalWages = w2s.reduce((sum, w) => sum + (parseFloat(w.wages) || 0), 0);
  const totalFederalWithheld = w2s.reduce((sum, w) => sum + (parseFloat(w.federalWithheld) || 0), 0);
  const totalStateWithheld = w2s.reduce((sum, w) => sum + (parseFloat(w.stateWithheld) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-ftb-blue mb-1">W-2 Wage and Tax Statements</h3>
        <p className="text-sm text-gray-600">
          Enter information from each W-2 form you received. Add a separate entry for each employer.
        </p>
      </div>

      {w2s.length === 0 && (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-sm">
          <p className="text-gray-500 mb-2">No W-2 forms added yet.</p>
          <p className="text-sm text-gray-400">Click the button below to add your first W-2.</p>
        </div>
      )}

      {w2s.map((w2, index) => (
        <div key={w2.id} className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
              W-2 #{index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeW2(w2.id)}
              className="text-gray-400 hover:text-ftb-error transition-colors text-sm font-medium"
            >
              Remove
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer Name
              </label>
              <input
                type="text"
                value={w2.employerName}
                onChange={(e) => updateW2Field(w2.id, 'employerName', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
                placeholder="e.g., ABC Corporation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer EIN
              </label>
              <input
                type="text"
                value={w2.employerEin}
                onChange={(e) => updateW2Field(w2.id, 'employerEin', e.target.value)}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${
                  errors[w2.id]?.employerEin ? 'border-ftb-error' : 'border-gray-300'
                }`}
                placeholder="XX-XXXXXXX"
                maxLength={10}
              />
              {errors[w2.id]?.employerEin && (
                <p className="text-ftb-error text-xs mt-1">{errors[w2.id].employerEin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wages, Tips, Other Compensation (Box 1)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={w2.wages}
                  onChange={(e) => updateW2Field(w2.id, 'wages', e.target.value)}
                  onBlur={() => handleCurrencyBlur(w2.id, 'wages')}
                  className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${
                    errors[w2.id]?.wages ? 'border-ftb-error' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors[w2.id]?.wages && (
                <p className="text-ftb-error text-xs mt-1">{errors[w2.id].wages}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Federal Income Tax Withheld (Box 2)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={w2.federalWithheld}
                  onChange={(e) => updateW2Field(w2.id, 'federalWithheld', e.target.value)}
                  onBlur={() => handleCurrencyBlur(w2.id, 'federalWithheld')}
                  className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${
                    errors[w2.id]?.federalWithheld ? 'border-ftb-error' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors[w2.id]?.federalWithheld && (
                <p className="text-ftb-error text-xs mt-1">{errors[w2.id].federalWithheld}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State Wages (Box 16)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={w2.stateWages}
                  onChange={(e) => updateW2Field(w2.id, 'stateWages', e.target.value)}
                  onBlur={() => handleCurrencyBlur(w2.id, 'stateWages')}
                  className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${
                    errors[w2.id]?.stateWages ? 'border-ftb-error' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors[w2.id]?.stateWages && (
                <p className="text-ftb-error text-xs mt-1">{errors[w2.id].stateWages}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State Income Tax Withheld (Box 17)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={w2.stateWithheld}
                  onChange={(e) => updateW2Field(w2.id, 'stateWithheld', e.target.value)}
                  onBlur={() => handleCurrencyBlur(w2.id, 'stateWithheld')}
                  className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${
                    errors[w2.id]?.stateWithheld ? 'border-ftb-error' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors[w2.id]?.stateWithheld && (
                <p className="text-ftb-error text-xs mt-1">{errors[w2.id].stateWithheld}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addW2}
        className="w-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors rounded-sm py-4 text-sm font-medium"
      >
        + Add W-2
      </button>

      {w2s.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">W-2 Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Wages</span>
              <p className="font-medium">${formatCurrency(totalWages)}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Federal Withheld</span>
              <p className="font-medium">${formatCurrency(totalFederalWithheld)}</p>
            </div>
            <div>
              <span className="text-gray-500">Total State Withheld</span>
              <p className="font-medium">${formatCurrency(totalStateWithheld)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
