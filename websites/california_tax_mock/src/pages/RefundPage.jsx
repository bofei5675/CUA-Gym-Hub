import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

function RefundPage() {
  const { state } = useContext(TaxContext);
  const [ssnLast4, setSsnLast4] = useState('');
  const [zip, setZip] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const calc = state.calculations;
  const taxReturn = state.taxReturn;
  const personalInfo = state.personalInfo;

  const handleCheck = () => {
    const errs = {};
    if (!ssnLast4 || !/^\d{4}$/.test(ssnLast4)) errs.ssnLast4 = 'Enter last 4 digits of SSN';
    if (!zip || !/^\d{5}$/.test(zip)) errs.zip = 'Enter a valid 5-digit ZIP code';
    if (!refundAmount || isNaN(parseFloat(refundAmount)) || parseFloat(refundAmount) <= 0) errs.refundAmount = 'Enter your expected refund amount';
    setErrors(errs);
    if (Object.keys(errs).length === 0) setChecked(true);
  };

  const actualSsnLast4 = personalInfo?.ssn ? personalInfo.ssn.slice(-4) : '';
  const actualZip = personalInfo?.address?.zip ? personalInfo.address.zip.slice(0, 5) : '';
  const expectedRefund = calc?.refundAmount || 0;

  const isMatch =
    ssnLast4 === actualSsnLast4 &&
    zip === actualZip &&
    Math.abs(parseFloat(refundAmount) - expectedRefund) < 1;

  const isSubmitted = taxReturn?.status === 'submitted';

  // Derive a simulated refund processing status based on how long ago submission happened.
  // For the mock, we advance the timeline based on submission time offset in minutes (to make
  // it observable during testing) — if no real time has passed, just base it on submission.
  const submittedAt = taxReturn?.updatedAt ? new Date(taxReturn.updatedAt) : null;
  const minutesSinceSubmission = submittedAt ? Math.floor((Date.now() - submittedAt.getTime()) / 60000) : 0;
  // After 5+ minutes simulate "approved"; after 10+ simulate "sent"
  const refundApproved = isSubmitted && minutesSinceSubmission >= 5;
  const refundSent = isSubmitted && minutesSinceSubmission >= 10;

  const TIMELINE_STEPS = [
    { label: 'Return Received', desc: 'Your California tax return has been received by FTB.', done: isSubmitted || isMatch },
    { label: 'Return Processing', desc: 'FTB is reviewing your return for accuracy and completeness.', done: isSubmitted, inProgress: isSubmitted && !refundApproved },
    { label: 'Refund Approved', desc: 'Your refund has been approved and is being prepared.', done: refundApproved, inProgress: refundApproved && !refundSent },
    { label: 'Refund Sent', desc: 'Your refund has been issued via direct deposit or mail.', done: refundSent },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-ftb-blue mb-2">Where's My Refund?</h1>
      <p className="text-sm text-gray-600 mb-6">
        Check the status of your California income tax refund. Enter the information below to locate your return.
      </p>

      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Enter Your Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last 4 Digits of SSN <span className="text-ftb-error">*</span>
            </label>
            <input
              type="text"
              value={ssnLast4}
              onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="XXXX"
              maxLength={4}
              className={`w-32 px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.ssnLast4 ? 'border-ftb-error' : 'border-gray-300'}`}
            />
            {errors.ssnLast4 && <p className="text-ftb-error text-xs mt-1">{errors.ssnLast4}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-ftb-error">*</span>
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="12345"
              maxLength={5}
              className={`w-32 px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.zip ? 'border-ftb-error' : 'border-gray-300'}`}
            />
            {errors.zip && <p className="text-ftb-error text-xs mt-1">{errors.zip}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Refund Amount <span className="text-ftb-error">*</span>
            </label>
            <div className="relative w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="text"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                className={`w-full pl-7 pr-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.refundAmount ? 'border-ftb-error' : 'border-gray-300'}`}
              />
            </div>
            {errors.refundAmount && <p className="text-ftb-error text-xs mt-1">{errors.refundAmount}</p>}
          </div>
          <button
            onClick={handleCheck}
            className="px-6 py-2 bg-ftb-blue text-white text-sm font-semibold rounded-md hover:bg-ftb-blue-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:ring-offset-2"
          >
            Check Status
          </button>
        </div>
      </div>

      {checked && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          {!isMatch && !isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">No Return Found</h3>
              <p className="text-sm text-gray-600">
                We could not find a return matching your information. Please check your entries or verify that your return has been submitted.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Refund Status</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tax Year 2024 | Form 540 | Expected Refund: <span className="font-semibold text-ftb-success">${expectedRefund.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </p>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-ftb-success text-white' : step.inProgress ? 'bg-ftb-blue text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {step.done ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 ${step.done ? 'bg-ftb-success' : 'bg-gray-200'}`} style={{ minHeight: '24px' }} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-medium text-sm ${step.done ? 'text-ftb-success' : step.inProgress ? 'text-ftb-blue' : 'text-gray-400'}`}>
                        {step.label}
                        {step.inProgress && <span className="ml-2 text-xs bg-blue-100 text-ftb-blue px-2 py-0.5 rounded-full">In Progress</span>}
                      </p>
                      <p className={`text-xs mt-0.5 ${step.done || step.inProgress ? 'text-gray-600' : 'text-gray-400'}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RefundPage;
