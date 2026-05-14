import React, { useContext } from 'react';
import { TaxContext } from '../context/TaxContext';
import { Tooltip } from './Tooltip';

function TaxSummaryView() {
  const { state, dispatch } = useContext(TaxContext);
  const calc = state.calculations;
  const payment = state.payment;

  const isRefund = calc.refundAmount > 0;
  const isOwed = calc.amountOwed > 0;

  const updatePayment = (data) => {
    dispatch({ type: 'UPDATE_SECTION', section: 'payment', data });
  };

  const summaryLines = [
    { label: 'Total Income', value: calc.totalIncome },
    { label: 'Adjusted Gross Income (CA AGI)', value: calc.adjustedGrossIncome, tooltipId: 'agi' },
    { label: 'Total Deductions', value: calc.totalDeductions, negative: true },
    { label: 'Taxable Income', value: calc.taxableIncome, bold: true, tooltipId: 'taxable-income' },
    { divider: true },
    { label: 'Tax Before Credits', value: calc.taxBeforeCredits },
    { label: 'Exemption Credits', value: calc.exemptionCredits, negative: true, tooltipId: 'exemption-credit' },
    { label: 'Total Non-refundable Credits', value: calc.totalNonrefundableCredits, negative: true },
    { label: 'Total Refundable Credits (CalEITC)', value: calc.totalRefundableCredits, negative: true, tooltipId: 'caleitc' },
    { label: 'Net Tax', value: calc.netTax, bold: true },
    { divider: true },
    { label: 'Total Withholdings', value: calc.totalWithholdings },
    { label: 'Estimated Payments', value: calc.estimatedPayments },
    { label: 'Total Payments', value: calc.totalPayments, bold: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
        Tax Summary
      </h2>
      <p className="text-sm text-gray-600">
        Review your calculated tax breakdown below. These values are computed from the information you provided.
      </p>

      {/* Tax Calculation Breakdown */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="bg-ftb-blue text-white px-5 py-3">
          <h3 className="font-medium">California Form 540 - Tax Calculation</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {summaryLines.map((line, idx) => {
            if (line.divider) {
              return <div key={idx} className="border-t-2 border-gray-300" />;
            }
            return (
              <div
                key={idx}
                className={`flex justify-between items-center px-5 py-3 ${line.bold ? 'bg-gray-50' : ''}`}
              >
                <span className={`text-sm ${line.bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {line.label}{line.tooltipId && <Tooltip id={line.tooltipId} />}
                </span>
                <span className={`text-sm font-mono ${line.bold ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                  {line.negative && line.value > 0 ? '-' : ''}
                  ${Math.abs(line.value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Refund or Amount Owed */}
        <div className={`px-5 py-4 border-t-2 ${isRefund ? 'bg-green-50 border-ftb-success' : isOwed ? 'bg-red-50 border-ftb-error' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-base font-bold ${isRefund ? 'text-ftb-success' : isOwed ? 'text-ftb-error' : 'text-gray-800'}`}>
              {isRefund ? 'Refund Amount' : isOwed ? 'Amount You Owe' : 'Balance'}
            </span>
            <span className={`text-xl font-bold font-mono ${isRefund ? 'text-ftb-success' : isOwed ? 'text-ftb-error' : 'text-gray-800'}`}>
              ${(isRefund ? calc.refundAmount : isOwed ? calc.amountOwed : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Estimated Tax Payments */}
      <div className="bg-white border border-gray-200 rounded-sm p-5">
        <h3 className="font-medium text-gray-800 mb-3">Estimated Tax Payments</h3>
        <p className="text-sm text-gray-600 mb-3">
          Enter any estimated tax payments you made during the year (Form 540-ES payments).
        </p>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="text"
            value={payment.estimatedPayments || ''}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              updatePayment({ estimatedPayments: val });
            }}
            onBlur={() => {
              const num = parseFloat(payment.estimatedPayments);
              if (!isNaN(num)) updatePayment({ estimatedPayments: num.toFixed(2) });
            }}
            placeholder="0.00"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent font-mono"
          />
        </div>
      </div>

      {/* Refund Method */}
      {isRefund && (
        <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
          <h3 className="font-medium text-gray-800">Refund Delivery Method</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="refundMethod"
                value="direct_deposit"
                checked={payment.refundMethod === 'direct_deposit'}
                onChange={(e) => updatePayment({ refundMethod: e.target.value })}
                className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
              />
              <span className="text-sm text-gray-800">Direct Deposit (fastest - typically 2-3 weeks)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="refundMethod"
                value="check"
                checked={payment.refundMethod === 'check'}
                onChange={(e) => updatePayment({ refundMethod: e.target.value })}
                className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
              />
              <span className="text-sm text-gray-800">Paper Check (mailed to address on file - 4-6 weeks)</span>
            </label>
          </div>

          {/* Bank Info for Direct Deposit */}
          {payment.refundMethod === 'direct_deposit' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-sm space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Bank Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Routing Number</label>
                  <input
                    type="text"
                    maxLength={9}
                    value={payment.bankRoutingNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                      updatePayment({ bankRoutingNumber: val });
                    }}
                    placeholder="9 digits"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Account Number</label>
                  <input
                    type="text"
                    maxLength={17}
                    value={payment.bankAccountNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 17);
                      updatePayment({ bankAccountNumber: val });
                    }}
                    placeholder="Account number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Account Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      value="checking"
                      checked={payment.accountType === 'checking'}
                      onChange={(e) => updatePayment({ accountType: e.target.value })}
                      className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
                    />
                    <span className="text-sm text-gray-700">Checking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      value="savings"
                      checked={payment.accountType === 'savings'}
                      onChange={(e) => updatePayment({ accountType: e.target.value })}
                      className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
                    />
                    <span className="text-sm text-gray-700">Savings</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Method (if amount owed) */}
      {isOwed && (
        <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
          <h3 className="font-medium text-gray-800">Payment Method</h3>
          <p className="text-sm text-gray-600">
            You owe <span className="font-semibold text-ftb-error">${calc.amountOwed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>. Choose how you would like to pay.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="electronic"
                checked={payment.paymentMethod === 'electronic'}
                onChange={(e) => updatePayment({ paymentMethod: e.target.value })}
                className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
              />
              <span className="text-sm text-gray-800">Electronic Funds Withdrawal (from bank account)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="check"
                checked={payment.paymentMethod === 'check'}
                onChange={(e) => updatePayment({ paymentMethod: e.target.value })}
                className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
              />
              <span className="text-sm text-gray-800">Mail a Check to Franchise Tax Board</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaxSummaryView;
