import React, { useContext, useState } from 'react';
import { TaxContext } from '../context/TaxContext';
import W2Form from './W2Form';

function formatCurrency(value) {
  if (value === '' || value === undefined || value === null) return '';
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseCurrency(str) {
  if (str === '' || str === undefined || str === null) return '';
  return String(str).replace(/[^0-9.]/g, '');
}

export default function IncomeForm() {
  const { state, dispatch } = useContext(TaxContext);
  const income = state.income || {};
  const interest1099 = income.interest1099 || [];
  const dividend1099 = income.dividend1099 || [];
  const otherIncome = income.otherIncome || [];
  const federalAgi = income.federalAgi ?? '';
  const [errors, setErrors] = useState({});

  // ---- Interest 1099 ----
  const addInterest = () => {
    dispatch({
      type: 'ADD_ARRAY_ITEM',
      section: 'income',
      field: 'interest1099',
      item: { id: Date.now(), payerName: '', amount: '' },
    });
  };

  const removeInterest = (id) => {
    dispatch({ type: 'REMOVE_ARRAY_ITEM', section: 'income', field: 'interest1099', id });
    setErrors((prev) => { const n = { ...prev }; delete n[`int-${id}`]; return n; });
  };

  const updateInterest = (id, field, rawValue) => {
    let value = rawValue;
    if (field === 'amount') {
      value = parseCurrency(rawValue);
      const num = parseFloat(value);
      if (value !== '' && !isNaN(num) && num < 0) {
        setErrors((prev) => ({ ...prev, [`int-${id}`]: { ...prev[`int-${id}`], amount: 'Amount cannot be negative' } }));
        return;
      } else {
        setErrors((prev) => { const n = { ...prev }; if (n[`int-${id}`]) { delete n[`int-${id}`].amount; if (!Object.keys(n[`int-${id}`]).length) delete n[`int-${id}`]; } return n; });
      }
    }
    const updated = interest1099.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { interest1099: updated } });
  };

  const blurInterestAmount = (id) => {
    const item = interest1099.find((i) => i.id === id);
    if (!item || item.amount === '') return;
    const num = parseFloat(item.amount);
    if (!isNaN(num)) {
      const updated = interest1099.map((i) => (i.id === id ? { ...i, amount: num.toFixed(2) } : i));
      dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { interest1099: updated } });
    }
  };

  // ---- Dividend 1099 ----
  const addDividend = () => {
    dispatch({
      type: 'ADD_ARRAY_ITEM',
      section: 'income',
      field: 'dividend1099',
      item: { id: Date.now() + 1, payerName: '', ordinaryDividends: '', qualifiedDividends: '' },
    });
  };

  const removeDividend = (id) => {
    dispatch({ type: 'REMOVE_ARRAY_ITEM', section: 'income', field: 'dividend1099', id });
    setErrors((prev) => { const n = { ...prev }; delete n[`div-${id}`]; return n; });
  };

  const updateDividend = (id, field, rawValue) => {
    let value = rawValue;
    if (['ordinaryDividends', 'qualifiedDividends'].includes(field)) {
      value = parseCurrency(rawValue);
      const num = parseFloat(value);
      if (value !== '' && !isNaN(num) && num < 0) {
        setErrors((prev) => ({ ...prev, [`div-${id}`]: { ...prev[`div-${id}`], [field]: 'Amount cannot be negative' } }));
        return;
      } else {
        setErrors((prev) => { const n = { ...prev }; if (n[`div-${id}`]) { delete n[`div-${id}`][field]; if (!Object.keys(n[`div-${id}`]).length) delete n[`div-${id}`]; } return n; });
      }
    }
    const updated = dividend1099.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { dividend1099: updated } });
  };

  const blurDividendAmount = (id, field) => {
    const item = dividend1099.find((i) => i.id === id);
    if (!item || item[field] === '') return;
    const num = parseFloat(item[field]);
    if (!isNaN(num)) {
      const updated = dividend1099.map((i) => (i.id === id ? { ...i, [field]: num.toFixed(2) } : i));
      dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { dividend1099: updated } });
    }
  };

  // ---- Other Income ----
  const addOtherIncome = () => {
    dispatch({
      type: 'ADD_ARRAY_ITEM',
      section: 'income',
      field: 'otherIncome',
      item: { id: Date.now() + 2, description: '', amount: '' },
    });
  };

  const removeOtherIncome = (id) => {
    dispatch({ type: 'REMOVE_ARRAY_ITEM', section: 'income', field: 'otherIncome', id });
    setErrors((prev) => { const n = { ...prev }; delete n[`other-${id}`]; return n; });
  };

  const updateOtherIncome = (id, field, rawValue) => {
    let value = rawValue;
    if (field === 'amount') {
      value = parseCurrency(rawValue);
      const num = parseFloat(value);
      if (value !== '' && !isNaN(num) && num < 0) {
        setErrors((prev) => ({ ...prev, [`other-${id}`]: { ...prev[`other-${id}`], amount: 'Amount cannot be negative' } }));
        return;
      } else {
        setErrors((prev) => { const n = { ...prev }; if (n[`other-${id}`]) { delete n[`other-${id}`].amount; if (!Object.keys(n[`other-${id}`]).length) delete n[`other-${id}`]; } return n; });
      }
    }
    const updated = otherIncome.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { otherIncome: updated } });
  };

  const blurOtherAmount = (id) => {
    const item = otherIncome.find((i) => i.id === id);
    if (!item || item.amount === '') return;
    const num = parseFloat(item.amount);
    if (!isNaN(num)) {
      const updated = otherIncome.map((i) => (i.id === id ? { ...i, amount: num.toFixed(2) } : i));
      dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { otherIncome: updated } });
    }
  };

  // ---- Federal AGI ----
  const updateFederalAgi = (rawValue) => {
    const value = parseCurrency(rawValue);
    const num = parseFloat(value);
    if (value !== '' && !isNaN(num) && num < 0) {
      setErrors((prev) => ({ ...prev, federalAgi: 'Amount cannot be negative' }));
      return;
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n.federalAgi; return n; });
    }
    dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { federalAgi: value } });
  };

  const blurFederalAgi = () => {
    if (federalAgi === '') return;
    const num = parseFloat(federalAgi);
    if (!isNaN(num)) {
      dispatch({ type: 'UPDATE_SECTION', section: 'income', data: { federalAgi: num.toFixed(2) } });
    }
  };

  // ---- Subtotals ----
  const w2s = income.w2s || [];
  const totalW2Wages = w2s.reduce((s, w) => s + (parseFloat(w.wages) || 0), 0);
  const totalInterest = interest1099.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const totalOrdinaryDividends = dividend1099.reduce((s, d) => s + (parseFloat(d.ordinaryDividends) || 0), 0);
  const totalOtherIncome = otherIncome.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0);
  const totalAllIncome = totalW2Wages + totalInterest + totalOrdinaryDividends + totalOtherIncome;

  return (
    <div className="space-y-8">
      {/* W-2 Section */}
      <W2Form />

      {/* 1099-INT Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ftb-blue mb-1">1099-INT Interest Income</h3>
          <p className="text-sm text-gray-600">Enter interest income from banks, savings accounts, or other sources.</p>
        </div>

        {interest1099.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm relative">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">1099-INT #{index + 1}</h4>
              <button type="button" onClick={() => removeInterest(item.id)} className="text-gray-400 hover:text-ftb-error transition-colors text-sm font-medium">
                Remove
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payer Name</label>
                <input
                  type="text"
                  value={item.payerName}
                  onChange={(e) => updateInterest(item.id, 'payerName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
                  placeholder="e.g., Bank of America"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    value={item.amount}
                    onChange={(e) => updateInterest(item.id, 'amount', e.target.value)}
                    onBlur={() => blurInterestAmount(item.id)}
                    className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors[`int-${item.id}`]?.amount ? 'border-ftb-error' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                </div>
                {errors[`int-${item.id}`]?.amount && (
                  <p className="text-ftb-error text-xs mt-1">{errors[`int-${item.id}`].amount}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addInterest} className="w-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors rounded-sm py-3 text-sm font-medium">
          + Add 1099-INT
        </button>
      </div>

      {/* 1099-DIV Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ftb-blue mb-1">1099-DIV Dividend Income</h3>
          <p className="text-sm text-gray-600">Enter dividend income from investments, mutual funds, or other sources.</p>
        </div>

        {dividend1099.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm relative">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">1099-DIV #{index + 1}</h4>
              <button type="button" onClick={() => removeDividend(item.id)} className="text-gray-400 hover:text-ftb-error transition-colors text-sm font-medium">
                Remove
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payer Name</label>
                <input
                  type="text"
                  value={item.payerName}
                  onChange={(e) => updateDividend(item.id, 'payerName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
                  placeholder="e.g., Vanguard"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordinary Dividends (Box 1a)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    value={item.ordinaryDividends}
                    onChange={(e) => updateDividend(item.id, 'ordinaryDividends', e.target.value)}
                    onBlur={() => blurDividendAmount(item.id, 'ordinaryDividends')}
                    className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors[`div-${item.id}`]?.ordinaryDividends ? 'border-ftb-error' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                </div>
                {errors[`div-${item.id}`]?.ordinaryDividends && (
                  <p className="text-ftb-error text-xs mt-1">{errors[`div-${item.id}`].ordinaryDividends}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualified Dividends (Box 1b)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    value={item.qualifiedDividends}
                    onChange={(e) => updateDividend(item.id, 'qualifiedDividends', e.target.value)}
                    onBlur={() => blurDividendAmount(item.id, 'qualifiedDividends')}
                    className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors[`div-${item.id}`]?.qualifiedDividends ? 'border-ftb-error' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                </div>
                {errors[`div-${item.id}`]?.qualifiedDividends && (
                  <p className="text-ftb-error text-xs mt-1">{errors[`div-${item.id}`].qualifiedDividends}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addDividend} className="w-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors rounded-sm py-3 text-sm font-medium">
          + Add 1099-DIV
        </button>
      </div>

      {/* Other Income Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ftb-blue mb-1">Other Income</h3>
          <p className="text-sm text-gray-600">Enter any other taxable income not reported on W-2 or 1099 forms.</p>
        </div>

        {otherIncome.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm relative">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Other Income #{index + 1}</h4>
              <button type="button" onClick={() => removeOtherIncome(item.id)} className="text-gray-400 hover:text-ftb-error transition-colors text-sm font-medium">
                Remove
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateOtherIncome(item.id, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent"
                  placeholder="e.g., Freelance consulting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    value={item.amount}
                    onChange={(e) => updateOtherIncome(item.id, 'amount', e.target.value)}
                    onBlur={() => blurOtherAmount(item.id)}
                    className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors[`other-${item.id}`]?.amount ? 'border-ftb-error' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                </div>
                {errors[`other-${item.id}`]?.amount && (
                  <p className="text-ftb-error text-xs mt-1">{errors[`other-${item.id}`].amount}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addOtherIncome} className="w-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors rounded-sm py-3 text-sm font-medium">
          + Add Other Income
        </button>
      </div>

      {/* Federal AGI */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ftb-blue mb-1">Federal Adjusted Gross Income</h3>
          <p className="text-sm text-gray-600">
            Enter your Federal Adjusted Gross Income from your federal Form 1040, line 11. This is used as the starting point for your California return.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Federal AGI (Form 1040, Line 11)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="text"
              value={federalAgi}
              onChange={(e) => updateFederalAgi(e.target.value)}
              onBlur={blurFederalAgi}
              className={`w-full border rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ftb-blue focus:border-transparent ${errors.federalAgi ? 'border-ftb-error' : 'border-gray-300'}`}
              placeholder="0.00"
            />
          </div>
          {errors.federalAgi && (
            <p className="text-ftb-error text-xs mt-1">{errors.federalAgi}</p>
          )}
        </div>
      </div>

      {/* Income Summary */}
      <div className="bg-ftb-blue text-white rounded-sm p-5">
        <h4 className="text-lg font-semibold mb-3">Income Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-200">W-2 Wages</span>
            <span>${formatCurrency(totalW2Wages)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Interest Income (1099-INT)</span>
            <span>${formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Dividend Income (1099-DIV)</span>
            <span>${formatCurrency(totalOrdinaryDividends)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Other Income</span>
            <span>${formatCurrency(totalOtherIncome)}</span>
          </div>
          <div className="border-t border-blue-400 pt-2 mt-2 flex justify-between font-semibold text-base">
            <span>Total Income</span>
            <span>${formatCurrency(totalAllIncome)}</span>
          </div>
          {federalAgi !== '' && (
            <div className="flex justify-between pt-1">
              <span className="text-blue-200">Federal AGI</span>
              <span>${formatCurrency(parseFloat(federalAgi) || 0)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
