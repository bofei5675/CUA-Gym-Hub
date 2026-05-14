import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TaxContext } from '../context/TaxContext';

const SUBJECT_OPTIONS = [
  'General Tax Question',
  'Refund Status Inquiry',
  'Payment Issue',
  'CalFile Technical Support',
  'Notice or Letter Question',
  'Identity Theft',
  'Other',
];

function HelpPage() {
  const { state, dispatch } = useContext(TaxContext);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSend = () => {
    const errs = {};
    if (!subject) errs.subject = 'Please select a subject';
    if (!message.trim() || message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Store in ui state
    dispatch({
      type: 'UPDATE_UI',
      payload: {
        contactMessages: [
          ...(state.ui.contactMessages || []),
          { id: Date.now().toString(), subject, message, sentAt: new Date().toISOString() }
        ]
      }
    });
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setSubject('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-ftb-blue mb-2">Contact Us</h1>
      <p className="text-sm text-gray-600 mb-8">
        We're here to help. Find contact information, office locations, or send us a message below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Phone Numbers */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-ftb-blue/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ftb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Phone Numbers</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">General Information</p>
              <p className="font-semibold text-gray-800">800-852-5711</p>
              <p className="text-gray-400 text-xs">Mon–Fri 8 AM–5 PM</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Hearing Impaired (TTY)</p>
              <p className="font-semibold text-gray-800">800-822-6268</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Outside the US</p>
              <p className="font-semibold text-gray-800">916-845-6500</p>
            </div>
          </div>
        </div>

        {/* Online Resources */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-ftb-blue/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ftb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Quick Links</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={'/coming-soon/calfile-help' + (location.search || '')} className="text-ftb-blue hover:underline flex items-center gap-1">
                <span>CalFile Help Center</span>
              </Link>
            </li>
            <li>
              <Link to={'/coming-soon/tax-glossary' + (location.search || '')} className="text-ftb-blue hover:underline">Tax Glossary</Link>
            </li>
            <li>
              <Link to={'/coming-soon/free-tax-help' + (location.search || '')} className="text-ftb-blue hover:underline">Free Tax Help (VITA)</Link>
            </li>
            <li>
              <Link to={'/forms' + (location.search || '')} className="text-ftb-blue hover:underline">Forms and Publications</Link>
            </li>
            <li>
              <Link to={'/coming-soon/taxpayer-rights' + (location.search || '')} className="text-ftb-blue hover:underline">Taxpayer Rights</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mailing Addresses */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-ftb-blue/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ftb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Mailing Addresses</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Returns (with payment)</p>
            <address className="not-italic text-gray-700 leading-relaxed">
              Franchise Tax Board<br />
              PO Box 942867<br />
              Sacramento CA 94267-0001
            </address>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Returns (without payment)</p>
            <address className="not-italic text-gray-700 leading-relaxed">
              Franchise Tax Board<br />
              PO Box 942840<br />
              Sacramento CA 94240-0001
            </address>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Payments only</p>
            <address className="not-italic text-gray-700 leading-relaxed">
              Franchise Tax Board<br />
              PO Box 942867<br />
              Sacramento CA 94267-0008
            </address>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Correspondence</p>
            <address className="not-italic text-gray-700 leading-relaxed">
              Franchise Tax Board<br />
              PO Box 942840<br />
              Sacramento CA 94240-0040
            </address>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-ftb-blue/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ftb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Office Locations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="border border-gray-100 rounded-sm p-4">
            <p className="font-semibold text-gray-800 mb-1">Sacramento (Headquarters)</p>
            <address className="not-italic text-gray-600 leading-relaxed mb-2">
              9646 Butterfield Way<br />
              Sacramento, CA 95827
            </address>
            <p className="text-gray-500 text-xs">Mon–Fri 8:00 AM – 5:00 PM</p>
          </div>
          <div className="border border-gray-100 rounded-sm p-4">
            <p className="font-semibold text-gray-800 mb-1">Los Angeles</p>
            <address className="not-italic text-gray-600 leading-relaxed mb-2">
              300 S. Spring Street, Suite 5704<br />
              Los Angeles, CA 90013
            </address>
            <p className="text-gray-500 text-xs">Mon–Fri 8:00 AM – 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* Send a Message */}
      <div className="bg-ftb-blue/5 border border-ftb-blue/20 rounded-sm p-5">
        <h3 className="font-semibold text-ftb-blue mb-2">Send a Message</h3>
        <p className="text-sm text-gray-600 mb-4">
          Send a secure message to the Franchise Tax Board. We typically respond within 5–7 business days.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-ftb-blue text-white text-sm font-semibold rounded-md hover:bg-ftb-blue-hover transition-colors"
        >
          Send a Message
        </button>
      </div>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full p-6">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Message Sent</h3>
                <p className="text-sm text-gray-500">Your message has been submitted. We will respond within 5–7 business days.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-ftb-blue">Send a Message</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-ftb-error">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent bg-white ${errors.subject ? 'border-ftb-error' : 'border-gray-300'}`}
                    >
                      <option value="">Select a subject...</option>
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.subject && <p className="text-ftb-error text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-ftb-error">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Describe your question or issue..."
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent resize-none ${errors.message ? 'border-ftb-error' : 'border-gray-300'}`}
                    />
                    {errors.message && <p className="text-ftb-error text-xs mt-1">{errors.message}</p>}
                    <p className="text-xs text-gray-400 mt-1">{message.length} characters</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSend}
                      className="flex-1 py-2 bg-ftb-blue text-white rounded-md text-sm font-semibold hover:bg-ftb-blue-hover transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpPage;
