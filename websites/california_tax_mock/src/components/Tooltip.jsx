import React, { useContext, useRef, useEffect } from 'react';
import { TaxContext } from '../context/TaxContext';

const TOOLTIP_CONTENT = {
  'filing-status': {
    title: 'Filing Status',
    body: 'Your filing status determines your tax rate and standard deduction. Single: unmarried or legally separated. Married/RDP Filing Jointly: married couples filing a combined return. Head of Household: unmarried and pay more than half the cost of keeping up a home for a qualifying person.'
  },
  'agi': {
    title: 'Adjusted Gross Income (AGI)',
    body: 'Your federal AGI from Form 1040, Line 11. This is your total income minus certain deductions like IRA contributions, student loan interest, and alimony paid. California starts with your federal AGI and makes state-specific adjustments.'
  },
  'standard-deduction': {
    title: 'Standard Deduction',
    body: 'A fixed dollar amount that reduces your taxable income. For 2024: Single or Married Filing Separately: $5,540. Married Filing Jointly, Head of Household, or Qualifying Widow(er): $11,080. You should use the standard deduction if it\'s larger than your itemized deductions.'
  },
  'itemized-deductions': {
    title: 'Itemized Deductions',
    body: 'The total of individual deductible expenses including: medical expenses exceeding 7.5% of your AGI, state and local taxes (SALT), home mortgage interest, and charitable contributions. Use itemized deductions only if they exceed your standard deduction.'
  },
  'caleitc': {
    title: 'CalEITC (California Earned Income Tax Credit)',
    body: 'A refundable tax credit for low-to-moderate income California workers and families. Unlike federal EITC, CalEITC can exceed your tax liability and result in a refund. Eligibility is based on earned income, filing status, and number of qualifying children.'
  },
  'exemption-credit': {
    title: 'Exemption Credit',
    body: 'A nonrefundable credit that directly reduces your California tax. For 2024: $149 per taxpayer and spouse. $461 per dependent. These credits cannot reduce your tax below zero.'
  },
  'taxable-income': {
    title: 'Taxable Income',
    body: 'The amount of income subject to California income tax. Calculated as: California AGI minus your deductions (standard or itemized). California applies a progressive tax rate from 1% to 12.3% on this amount.'
  },
  'schedule-ca': {
    title: 'Schedule CA (California Adjustments)',
    body: 'Schedule CA (540) reconciles differences between federal and California tax law. Column B lists California subtractions (income taxed federally but exempt in CA, e.g., Social Security benefits). Column C lists California additions (income exempt federally but taxable in CA, e.g., out-of-state municipal bond interest).'
  }
};

export function Tooltip({ id }) {
  const { state, dispatch } = useContext(TaxContext);
  const activeTooltip = state?.ui?.activeTooltip;
  const isOpen = activeTooltip === id;
  const containerRef = useRef(null);

  const toggle = () => {
    dispatch({
      type: 'UPDATE_UI',
      payload: { activeTooltip: isOpen ? null : id }
    });
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        dispatch({ type: 'UPDATE_UI', payload: { activeTooltip: null } });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, dispatch]);

  const content = TOOLTIP_CONTENT[id];
  if (!content) return null;

  return (
    <span ref={containerRef} className="relative inline-block ml-1 align-middle" style={{ verticalAlign: 'middle' }}>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Help: ${content.title}`}
        className="w-4 h-4 rounded-full bg-gray-400 hover:bg-ftb-blue text-white text-xs font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:ring-offset-1 transition-colors"
        style={{ fontSize: '10px', lineHeight: 1 }}
      >
        ?
      </button>
      {isOpen && (
        <div
          className="absolute z-50 bottom-full left-1/2 mb-2 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-left"
          style={{ width: '260px', transform: 'translateX(-50%)' }}
        >
          <div className="text-xs font-semibold text-ftb-blue mb-1">{content.title}</div>
          <div className="text-xs text-gray-600 leading-relaxed">{content.body}</div>
          {/* Arrow */}
          <div
            className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2"
            style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white' }}
          />
          <div
            className="absolute left-1/2 translate-y-full -translate-x-1/2"
            style={{ width: 0, height: 0, bottom: '-1px', borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid #e5e7eb' }}
          />
        </div>
      )}
    </span>
  );
}

export default Tooltip;
