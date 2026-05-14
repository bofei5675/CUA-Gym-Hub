import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

function PaymentPage() {
  const { state, dispatch } = useContext(TaxContext);
  const calc = state.calculations;
  const amountOwed = calc?.amountOwed || 0;

  const [paymentType, setPaymentType] = useState('tax_due');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [amount, setAmount] = useState(amountOwed > 0 ? amountOwed.toFixed(2) : '');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/^\d{9}$/.test(routingNumber)) errs.routingNumber = 'Routing number must be 9 digits';
    if (!accountNumber || accountNumber.length < 4) errs.accountNumber = 'Account number is required';
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) errs.amount = 'Enter a valid payment amount';
    if (!paymentDate) errs.paymentDate = 'Payment date is required';
    return errs;
  };

  const handleReview = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setShowReview(true);
  };

  const handleSubmit = () => {
    const submission = {
      id: 'PAY-' + Date.now().toString(36).toUpperCase(),
      type: paymentType,
      amount: parseFloat(amount),
      date: paymentDate,
      status: 'pending',
      accountType,
      lastFour: accountNumber.slice(-4),
      submittedAt: new Date().toISOString()
    };
    const current = state.payment?.webPaySubmissions || [];
    dispatch({
      type: 'UPDATE_SECTION',
      section: 'payment',
      data: { webPaySubmissions: [...current, submission] }
    });
    setShowReview(false);
    setSubmitted(true);
  };

  const PAYMENT_TYPES = [
    { value: 'tax_due', label: 'Tax Due (Balance on Return)' },
    { value: 'estimated', label: 'Estimated Payment (Form 540-ES)' },
    { value: 'extension', label: 'Extension Payment (FTB 3519)' },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white border border-green-200 rounded-sm p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted</h2>
          <p className="text-gray-600 mb-1">Your payment has been submitted successfully.</p>
          <p className="text-sm text-gray-500 mb-6">
            Confirmation number: <span className="font-mono font-semibold">{(state.payment?.webPaySubmissions || []).slice(-1)[0]?.id}</span>
          </p>
          <div className="bg-gray-50 rounded-sm p-4 text-sm text-left space-y-1 mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Payment Type:</span><span className="font-medium">{PAYMENT_TYPES.find(t => t.value === paymentType)?.label}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount:</span><span className="font-medium">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment Date:</span><span className="font-medium">{paymentDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Account:</span><span className="font-medium">{accountType.charAt(0).toUpperCase() + accountType.slice(1)} ...{accountNumber.slice(-4)}</span></div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setAmount(''); setRoutingNumber(''); setAccountNumber(''); }}
            className="px-6 py-2 bg-ftb-blue text-white rounded-md text-sm font-medium hover:bg-ftb-blue-hover transition-colors"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-ftb-blue mb-2">Web Pay — Make a Payment</h1>
      <p className="text-sm text-gray-600 mb-6">
        Use Web Pay to make your California income tax payment online. Payments are processed securely through the Franchise Tax Board.
      </p>

      {amountOwed > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ftb-error flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-red-800">
            Current balance owed: <strong>${amountOwed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Payment Type */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Type</h3>
          <div className="space-y-2">
            {PAYMENT_TYPES.map((pt) => (
              <label key={pt.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value={pt.value}
                  checked={paymentType === pt.value}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
                />
                <span className="text-sm text-gray-800">{pt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Bank Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number <span className="text-ftb-error">*</span>
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="9-digit routing number"
                maxLength={9}
                className={`w-full px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.routingNumber ? 'border-ftb-error' : 'border-gray-300'}`}
              />
              {errors.routingNumber && <p className="text-ftb-error text-xs mt-1">{errors.routingNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number <span className="text-ftb-error">*</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 17))}
                placeholder="Account number"
                maxLength={17}
                className={`w-full px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.accountNumber ? 'border-ftb-error' : 'border-gray-300'}`}
              />
              {errors.accountNumber && <p className="text-ftb-error text-xs mt-1">{errors.accountNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <div className="flex gap-4">
                {['checking', 'savings'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      value={t}
                      checked={accountType === t}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-4 h-4 text-ftb-blue border-gray-300 focus:ring-ftb-blue"
                    />
                    <span className="text-sm text-gray-700">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount <span className="text-ftb-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  onBlur={() => {
                    const num = parseFloat(amount);
                    if (!isNaN(num)) setAmount(num.toFixed(2));
                  }}
                  placeholder="0.00"
                  className={`w-full pl-7 pr-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.amount ? 'border-ftb-error' : 'border-gray-300'}`}
                />
              </div>
              {errors.amount && <p className="text-ftb-error text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date <span className="text-ftb-error">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.paymentDate ? 'border-ftb-error' : 'border-gray-300'}`}
              />
              {errors.paymentDate && <p className="text-ftb-error text-xs mt-1">{errors.paymentDate}</p>}
            </div>
          </div>
        </div>

        <button
          onClick={handleReview}
          className="w-full py-3 bg-ftb-blue text-white font-semibold rounded-md hover:bg-ftb-blue-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:ring-offset-2"
        >
          Review Payment
        </button>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-ftb-blue mb-4">Review Your Payment</h2>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Type</span>
                <span className="font-medium">{PAYMENT_TYPES.find(t => t.value === paymentType)?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold text-lg">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Date</span>
                <span className="font-medium">{paymentDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium">{accountType.charAt(0).toUpperCase() + accountType.slice(1)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Routing / Account</span>
                <span className="font-mono font-medium">{routingNumber.slice(0, 4)}... / ...{accountNumber.slice(-4)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              By clicking "Submit Payment" you authorize the Franchise Tax Board to debit your bank account for the amount shown above on the specified date.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReview(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-ftb-blue text-white rounded-md text-sm font-semibold hover:bg-ftb-blue-hover transition-colors"
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
