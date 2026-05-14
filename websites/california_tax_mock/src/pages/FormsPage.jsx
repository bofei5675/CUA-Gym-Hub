import React, { useState, useContext } from 'react';
import { TaxContext } from '../context/TaxContext';

const CA_FORMS = [
  { number: '540', name: 'California Resident Income Tax Return', year: '2024', description: 'Main California income tax return for full-year residents.' },
  { number: '540-2EZ', name: 'California Resident Income Tax Return (Simple)', year: '2024', description: 'Simplified return for taxpayers with simple tax situations.' },
  { number: '540-ES', name: 'Estimated Tax for Individuals', year: '2024', description: 'Used to pay estimated taxes quarterly.' },
  { number: '540-NR', name: 'California Nonresident or Part-Year Resident Income Tax Return', year: '2024', description: 'For nonresidents or part-year residents of California.' },
  { number: '540X', name: 'Amended Individual Income Tax Return', year: '2024', description: 'Used to correct a previously filed Form 540 or 540A.' },
  { number: 'Schedule CA (540)', name: 'California Adjustments — Residents', year: '2024', description: 'Adjustments to federal income and deductions for California purposes.' },
  { number: 'FTB 3514', name: 'California Earned Income Tax Credit', year: '2024', description: 'Claim the California Earned Income Tax Credit (CalEITC).' },
  { number: 'FTB 3532', name: 'Head of Household Filing Status Schedule', year: '2024', description: 'Determine eligibility for head of household filing status.' },
  { number: 'FTB 3506', name: 'Child and Dependent Care Expenses Credit', year: '2024', description: 'Claim credit for child and dependent care expenses.' },
  { number: 'FTB 3805E', name: 'Installment Sale Income', year: '2024', description: 'Report income from installment sales.' },
  { number: 'FTB 5805', name: 'Underpayment of Estimated Tax by Individuals and Fiduciaries', year: '2024', description: 'Calculate penalty for underpayment of estimated tax.' },
  { number: 'DE-4', name: 'Employee\'s Withholding Allowance Certificate', year: '2024', description: 'Determine California income tax withholding from wages.' },
  { number: '593', name: 'Real Estate Withholding Statement', year: '2024', description: 'Report real estate withholding from property sales.' },
  { number: '588', name: 'Nonresident Withholding Waiver Request', year: '2024', description: 'Request waiver or reduction of California withholding.' },
  { number: 'FTB 3840', name: 'California Like-Kind Exchanges', year: '2024', description: 'Report like-kind exchanges of California property.' },
];

function FormsPage() {
  const { dispatch } = useContext(TaxContext);
  const [search, setSearch] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [downloadedForms, setDownloadedForms] = useState([]);

  const handleDownload = (form) => {
    // Simulate a download action and track it in state
    setDownloadedForms(prev => {
      if (prev.find(f => f.number === form.number)) return prev;
      return [...prev, { number: form.number, name: form.name, downloadedAt: new Date().toISOString() }];
    });
    dispatch({
      type: 'UPDATE_UI',
      payload: {
        lastDownloadedForm: { number: form.number, name: form.name, year: form.year, downloadedAt: new Date().toISOString() }
      }
    });
    setSelectedForm(null);
  };

  const filtered = CA_FORMS.filter(
    (f) =>
      f.number.toLowerCase().includes(search.toLowerCase()) ||
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-ftb-blue mb-2">California Tax Forms</h1>
      <p className="text-sm text-gray-600 mb-6">
        Search for California Franchise Tax Board forms. Click "View" for form details.
      </p>

      <div className="mb-6">
        <div className="relative max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by form number or name..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Showing {filtered.length} of {CA_FORMS.length} forms</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ftb-blue text-white">
              <th className="text-left px-4 py-3 font-semibold w-36">Form Number</th>
              <th className="text-left px-4 py-3 font-semibold">Form Name</th>
              <th className="text-left px-4 py-3 font-semibold w-24">Tax Year</th>
              <th className="text-left px-4 py-3 font-semibold w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No forms found matching "{search}"
                </td>
              </tr>
            ) : (
              filtered.map((form) => (
                <tr key={form.number} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-ftb-blue">{form.number}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {form.name}
                    {downloadedForms.find(f => f.number === form.number) && (
                      <span className="ml-2 text-xs text-ftb-success font-medium">Downloaded</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{form.year}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedForm(form)}
                      className="px-3 py-1 text-xs bg-ftb-blue text-white rounded hover:bg-ftb-blue-hover transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Detail Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block bg-ftb-blue text-white text-xs font-mono font-bold px-2 py-1 rounded mb-2">{selectedForm.number}</span>
                <h2 className="text-lg font-bold text-gray-900">{selectedForm.name}</h2>
                <p className="text-sm text-gray-500">Tax Year {selectedForm.year}</p>
              </div>
              <button
                onClick={() => setSelectedForm(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 rounded-sm p-4 mb-4">
              <p className="text-sm text-gray-700">{selectedForm.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedForm(null)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedForm)}
                className="flex-1 py-2 bg-ftb-blue text-white rounded-md text-sm font-semibold hover:bg-ftb-blue-hover transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormsPage;
