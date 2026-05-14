import React, { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { TaxContext } from '../context/TaxContext';
import { clearData, getSessionId } from '../utils/initialState';

function ConfirmationPage() {
  const { state, dispatch } = useContext(TaxContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { taxReturn, calculations, payment } = state;

  const isRefund = calculations.refundAmount > 0;
  const isOwed = calculations.amountOwed > 0;

  const formatCurrency = (val) =>
    '$' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const handlePrint = () => {
    window.print();
  };

  const handleStartNew = () => {
    const sid = getSessionId();
    clearData(sid);
    dispatch({ type: 'RESET_STATE' });
    navigate('/' + (location.search || ''));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Banner */}
      <div className="bg-white border-2 border-ftb-success rounded-sm p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-ftb-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ftb-success">
          Your California Tax Return Has Been Submitted!
        </h1>
        <p className="text-gray-600">
          Your Form 540 has been successfully filed with the California Franchise Tax Board.
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-lg">Confirmation Details</h2>

        <div className="bg-gray-50 rounded-sm p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Confirmation Number</span>
            <span className="text-lg font-bold font-mono text-ftb-blue">
              {taxReturn.confirmationNumber || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tax Year</span>
            <span className="text-sm font-medium text-gray-800">{taxReturn.taxYear}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Form</span>
            <span className="text-sm font-medium text-gray-800">California Form 540</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-ftb-success">
              Submitted
            </span>
          </div>
        </div>

        {/* Refund / Amount Owed */}
        <div className={`rounded-sm p-4 ${isRefund ? 'bg-green-50 border border-green-200' : isOwed ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <span className={`font-semibold ${isRefund ? 'text-ftb-success' : isOwed ? 'text-ftb-error' : 'text-gray-800'}`}>
              {isRefund ? 'Expected Refund' : isOwed ? 'Amount Owed' : 'Balance Due'}
            </span>
            <span className={`text-xl font-bold ${isRefund ? 'text-ftb-success' : isOwed ? 'text-ftb-error' : 'text-gray-800'}`}>
              {formatCurrency(isRefund ? calculations.refundAmount : calculations.amountOwed)}
            </span>
          </div>

          {isRefund && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Method</span>
                <span className="font-medium text-gray-800">
                  {payment.refundMethod === 'direct_deposit' ? 'Direct Deposit' : 'Paper Check'}
                </span>
              </div>
              <div className="mt-2 p-3 bg-white rounded border border-green-100">
                <p className="text-xs text-gray-600">
                  {payment.refundMethod === 'direct_deposit'
                    ? 'Your refund will be deposited into your bank account within 2-3 weeks of acceptance.'
                    : 'A check will be mailed to your address on file within 4-6 weeks of acceptance.'}
                </p>
              </div>
            </div>
          )}

          {isOwed && (
            <div className="mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-800">
                  {payment.paymentMethod === 'electronic' ? 'Electronic Withdrawal' : 'Mail Check'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estimated Timeline */}
      {isRefund && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Estimated Refund Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-ftb-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Return Submitted</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-gray-500 font-medium">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Return Accepted by FTB</p>
                <p className="text-xs text-gray-500">Within 1-2 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-gray-500 font-medium">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Refund Processed</p>
                <p className="text-xs text-gray-500">Within 1-2 weeks of acceptance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-gray-500 font-medium">4</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Refund Issued</p>
                <p className="text-xs text-gray-500">
                  {payment.refundMethod === 'direct_deposit'
                    ? 'Direct deposit within 2-3 weeks'
                    : 'Check mailed within 4-6 weeks'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-5">
        <h3 className="font-medium text-ftb-blue mb-2">Important Information</h3>
        <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
          <li>Save your confirmation number for your records.</li>
          <li>You can <Link to={'/refund' + (location.search || '')} className="text-ftb-blue hover:underline">check your refund status</Link> using the Where's My Refund tool.</li>
          <li>Keep copies of all tax documents for at least 4 years.</li>
          <li>If you need to make changes, you may file an amended return (Form 540X).</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-2 pb-8">
        <button
          onClick={handlePrint}
          className="px-6 py-3 border border-ftb-blue text-ftb-blue rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          Print Confirmation
        </button>
        <button
          onClick={handleStartNew}
          className="px-6 py-3 bg-ftb-blue text-white rounded-md text-sm font-semibold hover:bg-ftb-blue-hover transition-colors"
        >
          Start New Return
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage;
