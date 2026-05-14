import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaxContext } from '../context/TaxContext';

const FILING_STATUS_LABELS = {
  single: 'Single',
  married_joint: 'Married Filing Jointly',
  married_separate: 'Married Filing Separately',
  head_of_household: 'Head of Household',
  qualifying_widow: 'Qualifying Surviving Spouse',
};

function SectionCard({ title, editPath, children }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <button
          onClick={() => navigate(editPath)}
          className="text-sm text-ftb-blue hover:text-ftb-blue-hover font-medium hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || '--'}</span>
    </div>
  );
}

function ReviewPage() {
  const { state, dispatch } = useContext(TaxContext);
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(state.ui?.signatureAgreed || false);
  const [signDate, setSignDate] = useState(state.ui?.signatureDate || new Date().toISOString().split('T')[0]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCheckboxHint, setShowCheckboxHint] = useState(false);

  const handleAgreedChange = (checked) => {
    setAgreed(checked);
    dispatch({ type: 'UPDATE_UI', payload: { signatureAgreed: checked } });
  };

  const handleSignDateChange = (value) => {
    setSignDate(value);
    dispatch({ type: 'UPDATE_UI', payload: { signatureDate: value } });
  };

  const { personalInfo, dependents, income, deductions, credits, calculations, payment } = state;

  const isRefund = calculations.refundAmount > 0;
  const isOwed = calculations.amountOwed > 0;

  const handleSubmit = () => {
    if (!agreed) {
      setShowCheckboxHint(true);
      return;
    }
    setShowCheckboxHint(false);
    setShowConfirmDialog(true);
  };

  const confirmSubmit = () => {
    dispatch({ type: 'SUBMIT_RETURN' });
    setShowConfirmDialog(false);
    navigate('/filing/confirmation');
  };

  const formatCurrency = (val) =>
    '$' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const formatSSN = (ssn) => {
    if (!ssn) return '--';
    const digits = ssn.replace(/\D/g, '');
    if (digits.length >= 5) return `XXX-XX-${digits.slice(-4)}`;
    return 'XXX-XX-XXXX';
  };

  const totalOtherCredits = (credits.otherCredits || []).reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
        Review Your Return
      </h2>
      <p className="text-sm text-gray-600">
        Please review all information below before submitting your California tax return. Click "Edit" to make changes to any section.
      </p>

      {/* Personal Information */}
      <SectionCard title="Personal Information" editPath="/filing/personal-info">
        <div className="space-y-1">
          <DataRow label="Filing Status" value={FILING_STATUS_LABELS[personalInfo.filingStatus]} />
          <DataRow
            label="Name"
            value={[personalInfo.firstName, personalInfo.middleInitial, personalInfo.lastName, personalInfo.suffix].filter(Boolean).join(' ')}
          />
          <DataRow label="SSN" value={formatSSN(personalInfo.ssn)} />
          <DataRow label="Date of Birth" value={personalInfo.dateOfBirth} />
          <DataRow
            label="Address"
            value={[personalInfo.address.street, personalInfo.address.apt, personalInfo.address.city, personalInfo.address.state, personalInfo.address.zip].filter(Boolean).join(', ')}
          />
          <DataRow label="Phone" value={personalInfo.phone} />
          <DataRow label="Email" value={personalInfo.email} />
          {(personalInfo.filingStatus === 'married_joint' || personalInfo.filingStatus === 'married_separate') && personalInfo.spouseFirstName && (
            <>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <DataRow
                  label="Spouse Name"
                  value={[personalInfo.spouseFirstName, personalInfo.spouseMiddleInitial, personalInfo.spouseLastName].filter(Boolean).join(' ')}
                />
                <DataRow label="Spouse SSN" value={formatSSN(personalInfo.spouseSsn)} />
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* Dependents */}
      <SectionCard title="Dependents" editPath="/filing/dependents">
        {dependents.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No dependents entered.</p>
        ) : (
          <div className="space-y-2">
            {dependents.map((dep, idx) => (
              <div key={dep.id || idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    {dep.firstName} {dep.lastName}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">({dep.relationship})</span>
                </div>
                <span className="text-xs text-gray-500">SSN: {formatSSN(dep.ssn)}</span>
              </div>
            ))}
            <div className="text-sm text-gray-600 pt-1">
              Total dependents: <span className="font-medium">{dependents.length}</span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Income */}
      <SectionCard title="Income" editPath="/filing/income">
        <div className="space-y-1">
          {(income.w2s || []).length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">W-2 Wages</span>
              {income.w2s.map((w2, idx) => (
                <DataRow
                  key={w2.id || idx}
                  label={w2.employerName || `Employer ${idx + 1}`}
                  value={formatCurrency(w2.wages)}
                />
              ))}
            </div>
          )}
          {(income.interest1099 || []).length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">1099-INT Interest</span>
              {income.interest1099.map((item, idx) => (
                <DataRow
                  key={item.id || idx}
                  label={item.payerName || `Payer ${idx + 1}`}
                  value={formatCurrency(item.amount)}
                />
              ))}
            </div>
          )}
          {(income.dividend1099 || []).length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">1099-DIV Dividends</span>
              {income.dividend1099.map((item, idx) => (
                <DataRow
                  key={item.id || idx}
                  label={item.payerName || `Payer ${idx + 1}`}
                  value={formatCurrency(item.ordinaryDividends)}
                />
              ))}
            </div>
          )}
          {(income.otherIncome || []).length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Other Income</span>
              {income.otherIncome.map((item, idx) => (
                <DataRow
                  key={item.id || idx}
                  label={item.description || `Item ${idx + 1}`}
                  value={formatCurrency(item.amount)}
                />
              ))}
            </div>
          )}
          <DataRow label="Federal AGI" value={formatCurrency(income.federalAgi)} />
          <div className="border-t border-gray-200 pt-2 mt-2">
            <DataRow label="Total Income" value={formatCurrency(calculations.totalIncome)} />
          </div>
        </div>
      </SectionCard>

      {/* Deductions */}
      <SectionCard title="Deductions" editPath="/filing/deductions">
        <div className="space-y-1">
          <DataRow label="Deduction Type" value={deductions.type === 'standard' ? 'Standard Deduction' : 'Itemized Deductions'} />
          {deductions.type === 'standard' ? (
            <DataRow label="Standard Deduction Amount" value={formatCurrency(deductions.standardAmount)} />
          ) : (
            <>
              <DataRow label="Medical Expenses" value={formatCurrency(deductions.itemized.medicalExpenses)} />
              <DataRow label="State & Local Taxes" value={formatCurrency(deductions.itemized.stateLocalTaxes)} />
              <DataRow label="Mortgage Interest" value={formatCurrency(deductions.itemized.mortgageInterest)} />
              <DataRow label="Charitable Contributions" value={formatCurrency(deductions.itemized.charitableContributions)} />
              <DataRow label="Other Deductions" value={formatCurrency(deductions.itemized.otherDeductions)} />
            </>
          )}
          <DataRow label="CA Adjustments (Subtraction)" value={formatCurrency(deductions.caAdjustmentsSubtraction)} />
          <DataRow label="CA Adjustments (Addition)" value={formatCurrency(deductions.caAdjustmentsAddition)} />
          <div className="border-t border-gray-200 pt-2 mt-2">
            <DataRow label="Total Deductions" value={formatCurrency(calculations.totalDeductions)} />
          </div>
        </div>
      </SectionCard>

      {/* Credits */}
      <SectionCard title="Credits" editPath="/filing/credits">
        <div className="space-y-1">
          {credits.calEitc.eligible && <DataRow label="CalEITC" value={formatCurrency(credits.calEitc.amount)} />}
          {credits.childDependentCare.eligible && <DataRow label="Child/Dependent Care" value={formatCurrency(credits.childDependentCare.amount)} />}
          {credits.rentersCredit.eligible && <DataRow label="Renter's Credit" value={formatCurrency(credits.rentersCredit.amount)} />}
          {credits.seniorHeadOfHousehold.eligible && <DataRow label="Senior Head of Household" value={formatCurrency(credits.seniorHeadOfHousehold.amount)} />}
          {credits.jointCustodyHeadOfHousehold.eligible && <DataRow label="Joint Custody Head of Household" value={formatCurrency(credits.jointCustodyHeadOfHousehold.amount)} />}
          {credits.dependentParent.eligible && <DataRow label="Dependent Parent" value={formatCurrency(credits.dependentParent.amount)} />}
          {totalOtherCredits > 0 && <DataRow label="Other Credits" value={formatCurrency(totalOtherCredits)} />}
          {!credits.calEitc.eligible && !credits.childDependentCare.eligible && !credits.rentersCredit.eligible &&
           !credits.seniorHeadOfHousehold.eligible && !credits.jointCustodyHeadOfHousehold.eligible &&
           !credits.dependentParent.eligible && totalOtherCredits === 0 && (
            <p className="text-sm text-gray-500 italic">No credits claimed.</p>
          )}
        </div>
      </SectionCard>

      {/* Tax Summary */}
      <SectionCard title="Tax Summary" editPath="/filing/tax-summary">
        <div className="space-y-1">
          <DataRow label="Taxable Income" value={formatCurrency(calculations.taxableIncome)} />
          <DataRow label="Tax Before Credits" value={formatCurrency(calculations.taxBeforeCredits)} />
          <DataRow label="Net Tax" value={formatCurrency(calculations.netTax)} />
          <DataRow label="Total Payments" value={formatCurrency(calculations.totalPayments)} />
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between py-1.5">
              <span className={`text-sm font-bold ${isRefund ? 'text-ftb-success' : isOwed ? 'text-ftb-error' : 'text-gray-800'}`}>
                {isRefund ? 'Refund Amount' : isOwed ? 'Amount Owed' : 'Balance'}
              </span>
              <span className={`text-sm font-bold ${isRefund ? 'text-ftb-success' : isOwed ? 'text-ftb-error' : 'text-gray-800'}`}>
                {formatCurrency(isRefund ? calculations.refundAmount : calculations.amountOwed)}
              </span>
            </div>
          </div>
          {isRefund && (
            <DataRow label="Refund Method" value={payment.refundMethod === 'direct_deposit' ? 'Direct Deposit' : 'Paper Check'} />
          )}
          {isOwed && (
            <DataRow label="Payment Method" value={payment.paymentMethod === 'electronic' ? 'Electronic Withdrawal' : payment.paymentMethod === 'check' ? 'Mail Check' : '--'} />
          )}
        </div>
      </SectionCard>

      {/* E-Signature Declaration */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
        <h3 className="font-medium text-gray-800">Electronic Signature Declaration</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Under penalties of perjury, I declare that I have examined this return, including accompanying
            schedules and statements, and to the best of my knowledge and belief, it is true, correct, and
            complete. Declaration of preparer (other than taxpayer) is based on all information of which
            preparer has any knowledge.
          </p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-md transition-colors">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => handleAgreedChange(e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <span className="text-sm text-gray-700">
            I agree to the above declaration and authorize the electronic filing of this California income tax return.
          </span>
        </label>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Signature Date</label>
          <input
            type="date"
            value={signDate}
            onChange={(e) => handleSignDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={handleSubmit}
          className={`px-8 py-3 rounded-md text-sm font-semibold transition-colors ${
            agreed
              ? 'bg-ftb-blue text-white hover:bg-ftb-blue-hover cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-pointer'
          }`}
        >
          Submit Return
        </button>
        {showCheckboxHint && !agreed && (
          <p className="text-sm text-ftb-error font-medium">
            Please check the declaration checkbox above to continue.
          </p>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Submission</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to submit your California Form 540 tax return?
              This action cannot be undone.
            </p>
            {isRefund && (
              <p className="text-sm text-ftb-success font-medium">
                Your expected refund: {formatCurrency(calculations.refundAmount)}
              </p>
            )}
            {isOwed && (
              <p className="text-sm text-ftb-error font-medium">
                Amount you owe: {formatCurrency(calculations.amountOwed)}
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-ftb-blue text-white rounded-md text-sm font-semibold hover:bg-ftb-blue-hover transition-colors"
              >
                Yes, Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
