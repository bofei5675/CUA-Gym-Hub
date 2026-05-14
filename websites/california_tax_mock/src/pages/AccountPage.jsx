import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

const DEFAULT_PRIOR_RETURNS = [
  { year: 2023, form: '540', status: 'Submitted', filedDate: '2024-04-10', refund: 412.00 },
  { year: 2022, form: '540', status: 'Submitted', filedDate: '2023-04-03', refund: 189.50 },
];

const DEFAULT_NOTICES = [
  { id: 'N001', date: '2025-01-15', title: 'Your 2024 return has been received', type: 'informational', read: true },
  { id: 'N002', date: '2024-09-10', title: 'Reminder: Q3 Estimated Tax Payment Due September 15', type: 'reminder', read: true },
  { id: 'N003', date: '2024-06-15', title: 'Reminder: Q2 Estimated Tax Payment Due June 15', type: 'reminder', read: true },
];

const DEFAULT_PAYMENTS = [
  { id: 'P001', date: '2024-09-12', type: 'Estimated Payment Q3', amount: 300.00, method: 'Web Pay', status: 'Processed' },
  { id: 'P002', date: '2024-04-14', type: 'Tax Year 2023 Balance Due', amount: 124.00, method: 'Web Pay', status: 'Processed' },
];

const DEFAULT_MESSAGES = [
  { id: 'M001', date: '2025-01-20', from: 'FTB Compliance Division', subject: 'Your 2024 Form 540 Has Been Received', body: 'Thank you for submitting your 2024 California income tax return. Your return is currently being processed. You will receive a confirmation once processing is complete. If you are expecting a refund, please allow 2–3 weeks for direct deposit or 4–6 weeks for a paper check.', preview: 'Thank you for submitting your 2024 California income tax return. Your return is currently being processed...', read: false },
  { id: 'M002', date: '2024-11-05', from: 'FTB Taxpayer Services', subject: 'Updated: 2024 Standard Deduction Amounts', body: 'The California standard deduction amounts for tax year 2024 have been updated. Single filers: $5,540. Married filing jointly / Qualifying widow(er): $11,080. Head of household: $11,080. These amounts are automatically applied in CalFile when you select the standard deduction option.', preview: 'The California standard deduction amounts for tax year 2024 have been updated. Single filers: $5,540...', read: true },
];

const NAV_ITEMS = [
  { id: 'summary', label: 'Account Summary', icon: 'home' },
  { id: 'returns', label: 'Tax Returns', icon: 'document' },
  { id: 'notices', label: 'Notices', icon: 'bell' },
  { id: 'payments', label: 'Payments', icon: 'credit-card' },
  { id: 'messages', label: 'Messages', icon: 'mail' },
  { id: 'settings', label: 'Settings', icon: 'cog' },
];

function IconForNav({ name }) {
  const props = { xmlns: 'http://www.w3.org/2000/svg', className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 };
  const paths = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    'credit-card': <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    cog: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  };
  return <svg {...props}>{paths[name]}</svg>;
}

function AccountPage() {
  const { state, dispatch } = useContext(TaxContext);
  const [activeSection, setActiveSection] = useState('summary');
  const [selectedReturn, setSelectedReturn] = useState(null);

  // Messages state — seed from ui.messages if available, else DEFAULT_MESSAGES
  const [messages, setMessages] = useState(() => {
    const stored = state.ui?.messages;
    return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_MESSAGES;
  });
  const [openMessage, setOpenMessage] = useState(null);

  // Settings modal state
  const [settingsModal, setSettingsModal] = useState(null); // 'email' | 'phone' | '2fa' | null
  const [settingsFormValue, setSettingsFormValue] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [paperlessEnabled, setPaperlessEnabled] = useState(
    state.ui?.paperlessNotices !== undefined ? state.ui.paperlessNotices : true
  );
  const [twoFAEnabled, setTwoFAEnabled] = useState(
    state.ui?.twoFAEnabled || false
  );

  const personalInfo = state.personalInfo;
  const calc = state.calculations;
  const taxReturn = state.taxReturn;
  const webPaySubmissions = state.payment?.webPaySubmissions || [];

  // Merge prior returns from state if available
  const priorReturnsFromState = state.ui?.priorReturns;
  const priorReturns = Array.isArray(priorReturnsFromState) && priorReturnsFromState.length > 0
    ? priorReturnsFromState
    : DEFAULT_PRIOR_RETURNS;

  const maskedSSN = personalInfo?.ssn
    ? `XXX-XX-${personalInfo.ssn.slice(-4)}`
    : 'XXX-XX-XXXX';

  const currentReturn = {
    year: 2024,
    form: '540',
    status: taxReturn?.status === 'submitted' ? 'Submitted' : taxReturn?.status === 'in_progress' ? 'In Progress' : 'Draft',
    filedDate: taxReturn?.status === 'submitted' ? new Date().toISOString().split('T')[0] : '—',
    refund: calc?.refundAmount > 0 ? calc.refundAmount : 0,
    owed: calc?.amountOwed > 0 ? calc.amountOwed : 0,
  };

  const allReturns = [currentReturn, ...priorReturns];

  const unreadCount = messages.filter(m => !m.read).length;

  const handleOpenMessage = (msg) => {
    const updated = messages.map(m => m.id === msg.id ? { ...m, read: true } : m);
    setMessages(updated);
    setOpenMessage({ ...msg, read: true });
    // Persist read status to context state
    dispatch({ type: 'UPDATE_UI', payload: { messages: updated } });
  };

  const handleSettingsSave = () => {
    setSettingsError('');
    if (settingsModal === 'email') {
      if (!settingsFormValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settingsFormValue)) {
        setSettingsError('Please enter a valid email address');
        return;
      }
      dispatch({ type: 'UPDATE_SECTION', payload: { section: 'personalInfo', data: { email: settingsFormValue } } });
    } else if (settingsModal === 'phone') {
      const cleaned = settingsFormValue.replace(/\D/g, '');
      if (cleaned.length < 10) {
        setSettingsError('Please enter a valid 10-digit phone number');
        return;
      }
      dispatch({ type: 'UPDATE_SECTION', payload: { section: 'personalInfo', data: { phone: settingsFormValue } } });
    } else if (settingsModal === '2fa') {
      setTwoFAEnabled(true);
      dispatch({ type: 'UPDATE_UI', payload: { twoFAEnabled: true } });
    }
    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsModal(null);
      setSettingsFormValue('');
      setSettingsSaved(false);
    }, 1500);
  };

  const handleTogglePaperless = () => {
    const next = !paperlessEnabled;
    setPaperlessEnabled(next);
    dispatch({ type: 'UPDATE_UI', payload: { paperlessNotices: next } });
  };

  const openSettingsModal = (type) => {
    setSettingsModal(type);
    setSettingsFormValue(
      type === 'email' ? (personalInfo?.email || '') :
      type === 'phone' ? (personalInfo?.phone || '') : ''
    );
    setSettingsError('');
    setSettingsSaved(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Account Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{personalInfo?.firstName} {personalInfo?.middleInitial} {personalInfo?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SSN:</span>
                      <span className="font-mono font-medium">{maskedSSN}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Filing Status:</span>
                      <span className="font-medium capitalize">{(personalInfo?.filingStatus || '').replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium text-right">{personalInfo?.address?.street}{personalInfo?.address?.apt ? ', ' + personalInfo.address.apt : ''}, {personalInfo?.address?.city}, CA {personalInfo?.address?.zip}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">2024 Return Status:</span>
                      <span className={`font-semibold ${currentReturn.status === 'Submitted' ? 'text-ftb-success' : 'text-ftb-blue'}`}>{currentReturn.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Balance:</span>
                      <span className={`font-semibold ${calc?.amountOwed > 0 ? 'text-ftb-error' : calc?.refundAmount > 0 ? 'text-ftb-success' : 'text-gray-800'}`}>
                        {calc?.amountOwed > 0 ? `-$${calc.amountOwed.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : calc?.refundAmount > 0 ? `+$${calc.refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Login:</span>
                      <span className="font-medium">Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {unreadCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Unread Messages:</span>
                        <button
                          onClick={() => setActiveSection('messages')}
                          className="font-semibold text-ftb-blue hover:underline"
                        >
                          {unreadCount} unread
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'returns':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tax Returns</h2>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Tax Year</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Form</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Filed Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Refund / Owed</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allReturns.map((ret, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold">{ret.year}</td>
                      <td className="px-4 py-3 font-mono">{ret.form}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ret.status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-ftb-blue'}`}>
                          {ret.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ret.filedDate}</td>
                      <td className="px-4 py-3">
                        {ret.refund > 0 ? (
                          <span className="text-ftb-success font-semibold">Refund: ${ret.refund.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        ) : ret.owed > 0 ? (
                          <span className="text-ftb-error font-semibold">Owed: ${ret.owed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedReturn(ret)}
                          className="text-ftb-blue text-xs hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedReturn && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-sm shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold text-ftb-blue">Return Details — {selectedReturn.year}</h3>
                    <button onClick={() => setSelectedReturn(null)} className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Tax Year', selectedReturn.year],
                      ['Form', selectedReturn.form],
                      ['Status', selectedReturn.status],
                      ['Filed Date', selectedReturn.filedDate || '—'],
                      ['Refund Amount', selectedReturn.refund > 0 ? `$${selectedReturn.refund.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedReturn(null)} className="mt-4 w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Close</button>
                </div>
              </div>
            )}
          </div>
        );

      case 'notices':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notices</h2>
            <div className="space-y-3">
              {DEFAULT_NOTICES.map((notice) => (
                <div key={notice.id} className={`bg-white border rounded-sm p-4 flex items-start gap-3 ${notice.type === 'reminder' ? 'border-yellow-200' : 'border-gray-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notice.type === 'reminder' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${notice.type === 'reminder' ? 'text-yellow-600' : 'text-ftb-blue'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{notice.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(notice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Method</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...webPaySubmissions.map(s => ({
                    id: s.id, date: s.date, type: s.type, amount: s.amount, method: 'Web Pay', status: s.status
                  })), ...DEFAULT_PAYMENTS].map((pay) => (
                    <tr key={pay.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{pay.date}</td>
                      <td className="px-4 py-3">{pay.type}</td>
                      <td className="px-4 py-3 font-semibold">${Number(pay.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-600">{pay.method}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">{pay.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Messages
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-ftb-blue text-white rounded-full">{unreadCount} unread</span>
              )}
            </h2>
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`bg-white border rounded-sm p-4 cursor-pointer hover:border-ftb-blue transition-colors ${!msg.read ? 'border-ftb-blue/40 bg-blue-50/30' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.read && <span className="w-2 h-2 bg-ftb-blue rounded-full flex-shrink-0" />}
                        <p className={`text-sm font-medium ${!msg.read ? 'text-ftb-blue' : 'text-gray-800'}`}>{msg.subject}</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">From: {msg.from}</p>
                      <p className="text-xs text-gray-600 truncate">{msg.preview}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-3 flex-shrink-0">{new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message detail modal */}
            {openMessage && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-sm shadow-xl max-w-lg w-full p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-ftb-blue">{openMessage.subject}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">From: {openMessage.from} &middot; {new Date(openMessage.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <button onClick={() => setOpenMessage(null)} className="text-gray-400 hover:text-gray-600 p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-sm p-4 text-sm text-gray-700 leading-relaxed mb-4">
                    {openMessage.body || openMessage.preview}
                  </div>
                  <button onClick={() => setOpenMessage(null)} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Close</button>
                </div>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>
            <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-sm text-gray-800">Email Address</p>
                  <p className="text-xs text-gray-500">{state.personalInfo?.email || 'Not set'}</p>
                </div>
                <button
                  onClick={() => openSettingsModal('email')}
                  className="text-xs text-ftb-blue hover:underline font-medium"
                >
                  Update
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-sm text-gray-800">Phone Number</p>
                  <p className="text-xs text-gray-500">{state.personalInfo?.phone || 'Not set'}</p>
                </div>
                <button
                  onClick={() => openSettingsModal('phone')}
                  className="text-xs text-ftb-blue hover:underline font-medium"
                >
                  Update
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-sm text-gray-800">Paperless Notices</p>
                  <p className="text-xs text-gray-500">Receive notices electronically</p>
                </div>
                <button
                  onClick={handleTogglePaperless}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    paperlessEnabled
                      ? 'bg-ftb-blue text-white hover:bg-ftb-blue-hover'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {paperlessEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm text-gray-800">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Additional security for your account</p>
                </div>
                {twoFAEnabled ? (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Enabled</span>
                ) : (
                  <button
                    onClick={() => openSettingsModal('2fa')}
                    className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Set Up
                  </button>
                )}
              </div>
            </div>

            {/* Settings update modal */}
            {settingsModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-sm shadow-xl max-w-sm w-full p-6">
                  {settingsSaved ? (
                    <div className="text-center py-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {settingsModal === '2fa' ? 'Two-factor authentication enabled!' : 'Changes saved successfully!'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-ftb-blue">
                          {settingsModal === 'email' ? 'Update Email Address' :
                           settingsModal === 'phone' ? 'Update Phone Number' :
                           'Enable Two-Factor Authentication'}
                        </h3>
                        <button onClick={() => setSettingsModal(null)} className="text-gray-400 hover:text-gray-600 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      {settingsModal === '2fa' ? (
                        <p className="text-sm text-gray-600 mb-4">
                          Two-factor authentication adds an extra layer of security to your account. When enabled, you will be asked to verify your identity with a code sent to your phone each time you log in.
                        </p>
                      ) : (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {settingsModal === 'email' ? 'New Email Address' : 'New Phone Number'}
                          </label>
                          <input
                            type={settingsModal === 'email' ? 'email' : 'tel'}
                            value={settingsFormValue}
                            onChange={(e) => setSettingsFormValue(e.target.value)}
                            placeholder={settingsModal === 'email' ? 'your@email.com' : '(555) 555-5555'}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${settingsError ? 'border-ftb-error' : 'border-gray-300'}`}
                          />
                          {settingsError && <p className="text-ftb-error text-xs mt-1">{settingsError}</p>}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button onClick={() => setSettingsModal(null)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleSettingsSave} className="flex-1 py-2 bg-ftb-blue text-white rounded-md text-sm font-semibold hover:bg-ftb-blue-hover transition-colors">
                          {settingsModal === '2fa' ? 'Enable' : 'Save'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ftb-blue">MyFTB Account</h1>
          <p className="text-sm text-gray-500">Welcome back, {personalInfo?.firstName} {personalInfo?.lastName}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0">
          <nav className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-colors border-l-2 ${activeSection === item.id ? 'bg-ftb-blue/5 border-ftb-blue text-ftb-blue font-semibold' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-ftb-blue'}`}
              >
                <IconForNav name={item.icon} />
                <span className="flex-1">{item.label}</span>
                {item.id === 'messages' && unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-ftb-blue text-white rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default AccountPage;
