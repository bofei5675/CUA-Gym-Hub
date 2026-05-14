import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';

function CreditsForm() {
  const { state, dispatch } = useContext(TaxContext);
  const credits = state.credits;
  const filingStatus = state.personalInfo.filingStatus;

  const [newCredit, setNewCredit] = useState({ code: '', description: '', amount: '' });

  const updateCredit = (creditKey, field, value) => {
    const updated = { ...credits[creditKey], [field]: value };

    // Auto-calculate renter's credit amount
    if (creditKey === 'rentersCredit' && field === 'eligible') {
      if (value) {
        const isJoint = filingStatus === 'married_joint';
        updated.amount = isJoint ? 120 : 60;
      } else {
        updated.amount = 0;
      }
    }

    // Reset amount when not eligible
    if (field === 'eligible' && !value) {
      updated.amount = 0;
      if ('expenses' in updated) {
        updated.expenses = 0;
      }
    }

    dispatch({
      type: 'UPDATE_SECTION',
      section: 'credits',
      data: { [creditKey]: updated },
    });
  };

  const handleAddCredit = () => {
    if (!newCredit.code.trim() || !newCredit.description.trim()) return;
    dispatch({
      type: 'ADD_ARRAY_ITEM',
      section: 'credits',
      field: 'otherCredits',
      item: {
        id: Date.now().toString(),
        code: newCredit.code.trim(),
        description: newCredit.description.trim(),
        amount: parseFloat(newCredit.amount) || 0,
      },
    });
    setNewCredit({ code: '', description: '', amount: '' });
  };

  const handleRemoveCredit = (id) => {
    dispatch({
      type: 'REMOVE_ARRAY_ITEM',
      section: 'credits',
      field: 'otherCredits',
      id,
    });
  };

  const totalCredits =
    (credits.calEitc.amount || 0) +
    (credits.childDependentCare.amount || 0) +
    (credits.rentersCredit.amount || 0) +
    (credits.seniorHeadOfHousehold.amount || 0) +
    (credits.jointCustodyHeadOfHousehold.amount || 0) +
    (credits.dependentParent.amount || 0) +
    (credits.otherCredits || []).reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
        Tax Credits
      </h2>
      <p className="text-sm text-gray-600">
        Check each credit you are eligible for. Credits reduce your tax liability directly.
      </p>

      {/* CalEITC */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="calEitc"
            checked={credits.calEitc.eligible}
            onChange={(e) => updateCredit('calEitc', 'eligible', e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <div className="flex-1">
            <label htmlFor="calEitc" className="font-medium text-gray-800 cursor-pointer">
              California Earned Income Tax Credit (CalEITC)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              A refundable credit for low-to-moderate income workers. Up to $3,644 depending on income and dependents.
            </p>
          </div>
        </div>
        {credits.calEitc.eligible && (
          <div className="ml-7">
            <label className="block text-sm text-gray-600 mb-1">Credit Amount ($)</label>
            <input
              type="number"
              min="0"
              max="3644"
              value={credits.calEitc.amount || ''}
              onChange={(e) => updateCredit('calEitc', 'amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Child/Dependent Care Credit */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="childDependentCare"
            checked={credits.childDependentCare.eligible}
            onChange={(e) => updateCredit('childDependentCare', 'eligible', e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <div className="flex-1">
            <label htmlFor="childDependentCare" className="font-medium text-gray-800 cursor-pointer">
              Child and Dependent Care Expenses Credit
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Credit for expenses paid for the care of qualifying children or dependents to allow you to work.
            </p>
          </div>
        </div>
        {credits.childDependentCare.eligible && (
          <div className="ml-7 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Total Care Expenses ($)</label>
              <input
                type="number"
                min="0"
                value={credits.childDependentCare.expenses || ''}
                onChange={(e) => {
                  const expenses = parseFloat(e.target.value) || 0;
                  const amount = Math.round(expenses * 0.5);
                  dispatch({
                    type: 'UPDATE_SECTION',
                    section: 'credits',
                    data: {
                      childDependentCare: {
                        ...credits.childDependentCare,
                        expenses,
                        amount,
                      },
                    },
                  });
                }}
                placeholder="0.00"
                className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Calculated Credit Amount ($)</label>
              <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-md w-48">
                ${(credits.childDependentCare.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Renter's Credit */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="rentersCredit"
            checked={credits.rentersCredit.eligible}
            onChange={(e) => updateCredit('rentersCredit', 'eligible', e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <div className="flex-1">
            <label htmlFor="rentersCredit" className="font-medium text-gray-800 cursor-pointer">
              Renter's Credit
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {filingStatus === 'married_joint'
                ? 'Credit of $120 for qualifying joint filers (CA AGI <= $101,492).'
                : 'Credit of $60 for qualifying single filers (CA AGI <= $50,746).'}
            </p>
          </div>
        </div>
        {credits.rentersCredit.eligible && (
          <div className="ml-7">
            <div className="text-sm font-medium text-ftb-success bg-green-50 px-3 py-2 rounded-md w-48">
              Credit: ${credits.rentersCredit.amount || 0}
            </div>
          </div>
        )}
      </div>

      {/* Senior Head of Household Credit */}
      <div className="bg-white border border-gray-200 rounded-sm p-5">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="seniorHeadOfHousehold"
            checked={credits.seniorHeadOfHousehold.eligible}
            onChange={(e) => updateCredit('seniorHeadOfHousehold', 'eligible', e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <div className="flex-1">
            <label htmlFor="seniorHeadOfHousehold" className="font-medium text-gray-800 cursor-pointer">
              Senior Head of Household Credit
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Available if you are 65 or older, qualified as head of household in a prior year, and meet income limits.
            </p>
          </div>
        </div>
        {credits.seniorHeadOfHousehold.eligible && (
          <div className="ml-7 mt-3">
            <label className="block text-sm text-gray-600 mb-1">Credit Amount ($)</label>
            <input
              type="number"
              min="0"
              value={credits.seniorHeadOfHousehold.amount || ''}
              onChange={(e) => updateCredit('seniorHeadOfHousehold', 'amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Joint Custody Head of Household Credit */}
      <div className="bg-white border border-gray-200 rounded-sm p-5">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="jointCustodyHeadOfHousehold"
            checked={credits.jointCustodyHeadOfHousehold.eligible}
            onChange={(e) => updateCredit('jointCustodyHeadOfHousehold', 'eligible', e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <div className="flex-1">
            <label htmlFor="jointCustodyHeadOfHousehold" className="font-medium text-gray-800 cursor-pointer">
              Joint Custody Head of Household Credit
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Available if you maintained a household for a dependent child as an unmarried individual.
            </p>
          </div>
        </div>
        {credits.jointCustodyHeadOfHousehold.eligible && (
          <div className="ml-7 mt-3">
            <label className="block text-sm text-gray-600 mb-1">Credit Amount ($)</label>
            <input
              type="number"
              min="0"
              value={credits.jointCustodyHeadOfHousehold.amount || ''}
              onChange={(e) => updateCredit('jointCustodyHeadOfHousehold', 'amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Dependent Parent Credit */}
      <div className="bg-white border border-gray-200 rounded-sm p-5">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="dependentParent"
            checked={credits.dependentParent.eligible}
            onChange={(e) => updateCredit('dependentParent', 'eligible', e.target.checked)}
            className="mt-1 w-4 h-4 text-ftb-blue border-gray-300 rounded focus:ring-ftb-blue"
          />
          <div className="flex-1">
            <label htmlFor="dependentParent" className="font-medium text-gray-800 cursor-pointer">
              Dependent Parent Credit
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Available if you paid more than half the household costs for your parent(s).
            </p>
          </div>
        </div>
        {credits.dependentParent.eligible && (
          <div className="ml-7 mt-3">
            <label className="block text-sm text-gray-600 mb-1">Credit Amount ($)</label>
            <input
              type="number"
              min="0"
              value={credits.dependentParent.amount || ''}
              onChange={(e) => updateCredit('dependentParent', 'amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Other Credits */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
        <h3 className="font-medium text-gray-800">Other Credits</h3>
        <p className="text-xs text-gray-500">
          Add any additional California tax credits not listed above.
        </p>

        {(credits.otherCredits || []).length > 0 && (
          <div className="space-y-2">
            {credits.otherCredits.map((credit) => (
              <div
                key={credit.id}
                className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-md"
              >
                <span className="text-sm font-mono text-gray-600 w-16">{credit.code}</span>
                <span className="text-sm text-gray-800 flex-1">{credit.description}</span>
                <span className="text-sm font-medium text-gray-800">
                  ${(credit.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => handleRemoveCredit(credit.id)}
                  className="text-ftb-error hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Credit Code</label>
            <input
              type="text"
              value={newCredit.code}
              onChange={(e) => setNewCredit({ ...newCredit, code: e.target.value })}
              placeholder="e.g., 188"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input
              type="text"
              value={newCredit.description}
              onChange={(e) => setNewCredit({ ...newCredit, description: e.target.value })}
              placeholder="Credit description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Amount ($)</label>
            <input
              type="number"
              min="0"
              value={newCredit.amount}
              onChange={(e) => setNewCredit({ ...newCredit, amount: e.target.value })}
              placeholder="0.00"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddCredit}
            className="px-4 py-2 bg-ftb-blue text-white text-sm rounded-md hover:bg-ftb-blue-hover transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Total Credits */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-5">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total Credits</span>
          <span className="text-lg font-bold text-ftb-blue">
            ${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CreditsForm;
