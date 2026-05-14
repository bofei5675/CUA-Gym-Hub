import React, { useContext, useState, useEffect } from 'react';
import { TaxContext } from '../context/TaxContext';
import { Tooltip } from './Tooltip';

const CA_VOLUNTARY_FUNDS = [
  { id: 'alzheimers', name: "Alzheimer's Disease and Related Dementia Voluntary Tax Contribution Fund", description: 'Funds research and educational programs for Alzheimer\'s disease.' },
  { id: 'ca_seniors', name: 'California Seniors Special Fund', description: 'Provides support services for senior citizens.' },
  { id: 'firefighters', name: 'California Firefighters Memorial Fund', description: 'Maintains the memorial honoring California firefighters.' },
  { id: 'wildlife', name: 'California Wildlife, Coastal and Park Land Conservation Fund', description: 'Protects and preserves California\'s natural resources.' },
  { id: 'local_homeless', name: 'Local Homeless Transportation Services Fund', description: 'Provides transportation services to homeless individuals.' },
  { id: 'domestic_violence', name: 'California Fund for Senior and Disabled Citizens', description: 'Supports programs for seniors and disabled Californians.' },
];

const STANDARD_DEDUCTION_AMOUNTS = {
  single: 5540,
  married_joint: 11080,
  married_separate: 5540,
  head_of_household: 11080,
  qualifying_widow: 11080,
};

const FILING_STATUS_LABELS = {
  single: 'Single',
  married_joint: 'Married Filing Jointly',
  married_separate: 'Married Filing Separately',
  head_of_household: 'Head of Household',
  qualifying_widow: 'Qualifying Widow(er)',
};

function formatCurrency(value) {
  if (value === '' || value === undefined || value === null) return '';
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseCurrency(str) {
  if (str === '' || str === undefined || str === null) return '';
  return String(str).replace(/[^0-9.]/g, '');
}

export default function DeductionsForm() {
  const { state, dispatch } = useContext(TaxContext);
  const deductions = state.deductions || {};
  const filingStatus = state.personalInfo?.filingStatus || '';
  const deductionType = deductions.type || 'standard';
  const itemized = deductions.itemized || {};
  const [errors, setErrors] = useState({});

  const standardAmount = STANDARD_DEDUCTION_AMOUNTS[filingStatus] || 0;

  // Update standard amount in state whenever it changes
  useEffect(() => {
    if (deductionType === 'standard' && deductions.standardAmount !== standardAmount) {
      dispatch({
        type: 'UPDATE_SECTION',
        section: 'deductions',
        data: { standardAmount },
      });
    }
  }, [filingStatus, deductionType, standardAmount]);

  const handleTypeChange = (type) => {
    const data = { type };
    if (type === 'standard') {
      data.standardAmount = standardAmount;
    }
    dispatch({ type: 'UPDATE_SECTION', section: 'deductions', data });
  };

  const updateItemizedField = (field, rawValue) => {
    const value = parseCurrency(rawValue);
    const num = parseFloat(value);
    if (value !== '' && !isNaN(num) && num < 0) {
      setErrors((prev) => ({ ...prev, [field]: 'Amount cannot be negative' }));
      return;
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
    dispatch({
      type: 'UPDATE_SECTION',
      section: 'deductions',
      data: {
        itemized: { ...itemized, [field]: value },
      },
    });
  };

  const blurItemizedField = (field) => {
    const val = itemized[field];
    if (val === '' || val === undefined) return;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      dispatch({
        type: 'UPDATE_SECTION',
        section: 'deductions',
        data: {
          itemized: { ...itemized, [field]: num.toFixed(2) },
        },
      });
    }
  };

  const updateCaAdjustment = (field, rawValue) => {
    const value = parseCurrency(rawValue);
    const num = parseFloat(value);
    if (value !== '' && !isNaN(num) && num < 0) {
      setErrors((prev) => ({ ...prev, [field]: 'Amount cannot be negative' }));
      return;
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
    dispatch({
      type: 'UPDATE_SECTION',
      section: 'deductions',
      data: { [field]: value },
    });
  };

  const blurCaAdjustment = (field) => {
    const val = deductions[field];
    if (val === '' || val === undefined) return;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      dispatch({
        type: 'UPDATE_SECTION',
        section: 'deductions',
        data: { [field]: num.toFixed(2) },
      });
    }
  };

  // Itemized total
  const itemizedTotal =
    (parseFloat(itemized.medicalExpenses) || 0) +
    (parseFloat(itemized.stateLocalTaxes) || 0) +
    (parseFloat(itemized.mortgageInterest) || 0) +
    (parseFloat(itemized.charitableContributions) || 0) +
    (parseFloat(itemized.otherDeductions) || 0);

  const effectiveDeduction = deductionType === 'standard' ? standardAmount : itemizedTotal;

  const itemizedFields = [
    { key: 'medicalExpenses', label: 'Medical and Dental Expenses', hint: 'Amount exceeding 7.5% of your federal AGI' },
    { key: 'stateLocalTaxes', label: 'State and Local Taxes (SALT)', hint: 'State income taxes, property taxes, etc.' },
    { key: 'mortgageInterest', label: 'Home Mortgage Interest', hint: 'Interest paid on your home mortgage' },
    { key: 'charitableContributions', label: 'Charitable Contributions', hint: 'Donations to qualified organizations' },
    { key: 'otherDeductions', label: 'Other Itemized Deductions', hint: 'Casualty losses, miscellaneous deductions, etc.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-ftb-blue mb-1">Deductions</h3>
        <p className="text-sm text-gray-600">
          Choose between the standard deduction or itemizing your deductions. Select whichever gives you a larger deduction.
        </p>
      </div>

      {/* Deduction Type Selection */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-4">Deduction Method</h4>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="deductionType"
              value="standard"
              checked={deductionType === 'standard'}
              onChange={() => handleTypeChange('standard')}
              className="mt-1 w-4 h-4 text-ftb-blue"
            />
            <div className="flex-1">
          <span className="font-medium text-gray-800">Standard Deduction</span> <Tooltip id="standard-deduction" />
              {filingStatus ? (
                <p className="text-sm text-gray-500 mt-0.5">
                  {FILING_STATUS_LABELS[filingStatus] || filingStatus}: <span className="font-semibold text-ftb-success">${formatCurrency(standardAmount)}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-0.5">
                  Select a filing status on the Personal Info page to see your standard deduction amount.
                </p>
              )}
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="deductionType"
              value="itemized"
              checked={deductionType === 'itemized'}
              onChange={() => handleTypeChange('itemized')}
              className="mt-1 w-4 h-4 text-ftb-blue"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-800">Itemized Deductions</span> <Tooltip id="itemized-deductions" />
              <p className="text-sm text-gray-500 mt-0.5">
                Enter your individual deduction amounts below.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Standard Deduction Details */}
      {deductionType === 'standard' && (
        <div className="bg-ftb-success/10 border border-ftb-success/30 rounded-sm p-5">
          <h4 className="font-semibold text-ftb-success mb-2">Standard Deduction Applied</h4>
          {filingStatus ? (
            <div className="text-sm text-gray-700">
              <p>
                Based on your filing status ({FILING_STATUS_LABELS[filingStatus]}), your California standard deduction is:
              </p>
              <p className="text-2xl font-bold text-ftb-success mt-2">${formatCurrency(standardAmount)}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Please select a filing status on the Personal Information page. Your standard deduction amount will be calculated automatically.
            </p>
          )}
        </div>
      )}

      {/* Itemized Deductions Form */}
      {deductionType === 'itemized' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-4">Itemized Deduction Details</h4>
            <div className="space-y-4">
              {itemizedFields.map(({ key, label, hint }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <p className="text-xs text-gray-400 mb-1">{hint}</p>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="text"
                      value={itemized[key] ?? ''}
                      onChange={(e) => updateItemizedField(key, e.target.value)}
                      onBlur={() => blurItemizedField(key)}
                      className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors[key] ? 'border-ftb-error' : 'border-gray-300'}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors[key] && (
                    <p className="text-ftb-error text-xs mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Itemized Total */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Itemized Deductions</span>
                <span className="text-xl font-bold text-ftb-blue">${formatCurrency(itemizedTotal)}</span>
              </div>
              {filingStatus && standardAmount > 0 && (
                <p className={`text-sm mt-1 ${itemizedTotal > standardAmount ? 'text-ftb-success' : 'text-ftb-error'}`}>
                  {itemizedTotal > standardAmount
                    ? `Your itemized deductions are $${formatCurrency(itemizedTotal - standardAmount)} more than the standard deduction.`
                    : itemizedTotal === standardAmount
                    ? 'Your itemized deductions equal the standard deduction.'
                    : `Your itemized deductions are $${formatCurrency(standardAmount - itemizedTotal)} less than the standard deduction ($${formatCurrency(standardAmount)}).`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* California Adjustments */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ftb-blue mb-1">California Adjustments (Schedule CA) <Tooltip id="schedule-ca" /></h3>
          <p className="text-sm text-gray-600">
            California may require adjustments to your federal income. Enter subtractions (reduce income) and additions (increase income) from Schedule CA (540).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                California Subtractions (Schedule CA, Column B)
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Income items to subtract, such as Social Security benefits taxed federally but exempt in California.
              </p>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={deductions.caAdjustmentsSubtraction ?? ''}
                  onChange={(e) => updateCaAdjustment('caAdjustmentsSubtraction', e.target.value)}
                  onBlur={() => blurCaAdjustment('caAdjustmentsSubtraction')}
                  className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.caAdjustmentsSubtraction ? 'border-ftb-error' : 'border-gray-300'}`}
                  placeholder="0.00"
                />
              </div>
              {errors.caAdjustmentsSubtraction && (
                <p className="text-ftb-error text-xs mt-1">{errors.caAdjustmentsSubtraction}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                California Additions (Schedule CA, Column C)
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Income items to add, such as out-of-state municipal bond interest.
              </p>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={deductions.caAdjustmentsAddition ?? ''}
                  onChange={(e) => updateCaAdjustment('caAdjustmentsAddition', e.target.value)}
                  onBlur={() => blurCaAdjustment('caAdjustmentsAddition')}
                  className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.caAdjustmentsAddition ? 'border-ftb-error' : 'border-gray-300'}`}
                  placeholder="0.00"
                />
              </div>
              {errors.caAdjustmentsAddition && (
                <p className="text-ftb-error text-xs mt-1">{errors.caAdjustmentsAddition}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deductions Summary */}
      <div className="bg-ftb-blue text-white rounded-sm p-5">
        <h4 className="text-lg font-semibold mb-3">Deductions Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-200">
              {deductionType === 'standard' ? 'Standard Deduction' : 'Itemized Deductions'}
            </span>
            <span>${formatCurrency(effectiveDeduction)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">CA Subtractions</span>
            <span>-${formatCurrency(parseFloat(deductions.caAdjustmentsSubtraction) || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">CA Additions</span>
            <span>+${formatCurrency(parseFloat(deductions.caAdjustmentsAddition) || 0)}</span>
          </div>
          <div className="border-t border-blue-400 pt-2 mt-2 flex justify-between font-semibold text-base">
            <span>Total Deduction Amount</span>
            <span>${formatCurrency(effectiveDeduction)}</span>
          </div>
        </div>
      </div>

      {/* Voluntary Contributions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ftb-blue mb-1">Voluntary Contributions</h3>
          <p className="text-sm text-gray-600">
            You may donate a portion of your refund (or add to your payment) to the following California state funds. Check a fund to donate and enter the amount.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="space-y-4">
            {CA_VOLUNTARY_FUNDS.map((fund) => {
              const contrib = (deductions.voluntaryContributions || []).find((c) => c.id === fund.id);
              const checked = !!contrib;
              const amount = contrib ? contrib.amount : '';
              return (
                <div key={fund.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`fund-${fund.id}`}
                    checked={checked}
                    onChange={(e) => {
                      const current = deductions.voluntaryContributions || [];
                      if (e.target.checked) {
                        dispatch({
                          type: 'UPDATE_SECTION',
                          section: 'deductions',
                          data: { voluntaryContributions: [...current, { id: fund.id, fundName: fund.name, amount: '' }] }
                        });
                      } else {
                        dispatch({
                          type: 'UPDATE_SECTION',
                          section: 'deductions',
                          data: { voluntaryContributions: current.filter((c) => c.id !== fund.id) }
                        });
                      }
                    }}
                    className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
                  />
                  <div className="flex-1">
                    <label htmlFor={`fund-${fund.id}`} className="block text-sm font-medium text-gray-800 cursor-pointer">
                      {fund.name}
                    </label>
                    <p className="text-xs text-gray-500">{fund.description}</p>
                    {checked && (
                      <div className="mt-2 relative max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            const current = deductions.voluntaryContributions || [];
                            dispatch({
                              type: 'UPDATE_SECTION',
                              section: 'deductions',
                              data: { voluntaryContributions: current.map((c) => c.id === fund.id ? { ...c, amount: val } : c) }
                            });
                          }}
                          onBlur={() => {
                            const current = deductions.voluntaryContributions || [];
                            const c = current.find((x) => x.id === fund.id);
                            if (c) {
                              const num = parseFloat(c.amount);
                              if (!isNaN(num)) {
                                dispatch({
                                  type: 'UPDATE_SECTION',
                                  section: 'deductions',
                                  data: { voluntaryContributions: current.map((x) => x.id === fund.id ? { ...x, amount: num.toFixed(2) } : x) }
                                });
                              }
                            }
                          }}
                          placeholder="1.00"
                          className="w-full border border-gray-300 rounded pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {(deductions.voluntaryContributions || []).length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">Total Voluntary Contributions</span>
              <span className="font-semibold text-ftb-blue">
                ${formatCurrency((deductions.voluntaryContributions || []).reduce((s, c) => s + (parseFloat(c.amount) || 0), 0))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
