export function validateSSN(ssn) {
  if (!ssn) return 'SSN is required';
  const cleaned = ssn.replace(/[^0-9]/g, '');
  if (cleaned.length !== 9) return 'SSN must be 9 digits';
  if (/^0{3}/.test(cleaned) || /^9{3}/.test(cleaned)) return 'Invalid SSN';
  return null;
}

export function validateEIN(ein) {
  if (!ein) return 'EIN is required';
  const cleaned = ein.replace(/[^0-9]/g, '');
  if (cleaned.length !== 9) return 'EIN must be 9 digits';
  return null;
}

export function validateZip(zip) {
  if (!zip) return 'ZIP code is required';
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return 'Invalid ZIP code format';
  return null;
}

export function validateRequired(value, fieldName) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${fieldName || 'This field'} is required`;
  }
  return null;
}

export function validateNumeric(value, fieldName) {
  if (value === '' || value === null || value === undefined) return null;
  if (isNaN(Number(value))) return `${fieldName || 'This field'} must be a number`;
  if (Number(value) < 0) return `${fieldName || 'This field'} cannot be negative`;
  return null;
}

export function validateEmail(email) {
  if (!email) return null; // Email is optional
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
}

export function validatePhone(phone) {
  if (!phone) return null; // Phone is optional
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length < 10) return 'Phone number must be at least 10 digits';
  return null;
}

export function validateStep(stepName, state) {
  const errors = [];

  switch (stepName) {
    case 'personal-info': {
      const pi = state.personalInfo;
      if (!pi.filingStatus) errors.push('Filing status is required');
      if (validateRequired(pi.firstName, 'First name')) errors.push('First name is required');
      if (validateRequired(pi.lastName, 'Last name')) errors.push('Last name is required');
      const ssnErr = validateSSN(pi.ssn);
      if (ssnErr) errors.push(ssnErr);
      if (!pi.dateOfBirth) errors.push('Date of birth is required');
      if (!pi.address.street) errors.push('Street address is required');
      if (!pi.address.city) errors.push('City is required');
      const zipErr = validateZip(pi.address.zip);
      if (zipErr) errors.push(zipErr);

      // Spouse validation for married filers
      if (pi.filingStatus === 'married_joint' || pi.filingStatus === 'married_separate') {
        if (!pi.spouseFirstName) errors.push('Spouse first name is required');
        if (!pi.spouseLastName) errors.push('Spouse last name is required');
        const spouseSsnErr = validateSSN(pi.spouseSsn);
        if (spouseSsnErr) errors.push('Spouse ' + spouseSsnErr.toLowerCase());
      }
      break;
    }

    case 'dependents': {
      state.dependents.forEach((dep, i) => {
        if (!dep.firstName) errors.push(`Dependent ${i + 1}: First name is required`);
        if (!dep.lastName) errors.push(`Dependent ${i + 1}: Last name is required`);
        const ssnErr = validateSSN(dep.ssn);
        if (ssnErr) errors.push(`Dependent ${i + 1}: ${ssnErr}`);
        if (!dep.relationship) errors.push(`Dependent ${i + 1}: Relationship is required`);
      });
      break;
    }

    case 'income': {
      state.income.w2s.forEach((w2, i) => {
        if (!w2.employerName) errors.push(`W-2 #${i + 1}: Employer name is required`);
        const numErr = validateNumeric(w2.wages, `W-2 #${i + 1} wages`);
        if (numErr) errors.push(numErr);
      });
      state.income.interest1099.forEach((item, i) => {
        if (!item.payerName) errors.push(`1099-INT #${i + 1}: Payer name is required`);
        const numErr = validateNumeric(item.amount, `1099-INT #${i + 1} amount`);
        if (numErr) errors.push(numErr);
      });
      state.income.dividend1099.forEach((item, i) => {
        if (!item.payerName) errors.push(`1099-DIV #${i + 1}: Payer name is required`);
      });
      break;
    }

    case 'deductions': {
      if (state.deductions.type === 'itemized') {
        const itemized = state.deductions.itemized;
        for (const [key, val] of Object.entries(itemized)) {
          const numErr = validateNumeric(val, key);
          if (numErr) errors.push(numErr);
        }
      }
      break;
    }

    case 'credits': {
      // Credits are generally optional, but validate amounts if entered
      if (state.credits.childDependentCare.eligible) {
        const numErr = validateNumeric(state.credits.childDependentCare.expenses, 'Child care expenses');
        if (numErr) errors.push(numErr);
      }
      break;
    }

    case 'tax-summary': {
      // If the user has a refund and chose direct deposit, require bank info
      if (state.calculations && state.calculations.refundAmount > 0) {
        if (state.payment.refundMethod === 'direct_deposit') {
          if (!state.payment.bankRoutingNumber || state.payment.bankRoutingNumber.replace(/\D/g, '').length !== 9) {
            errors.push('A valid 9-digit routing number is required for direct deposit');
          }
          if (!state.payment.bankAccountNumber || state.payment.bankAccountNumber.replace(/\D/g, '').length < 4) {
            errors.push('A valid bank account number is required for direct deposit');
          }
          if (!state.payment.accountType) {
            errors.push('Account type (checking or savings) is required for direct deposit');
          }
        }
      }
      // If the user owes money, a payment method is required
      if (state.calculations && state.calculations.amountOwed > 0) {
        if (!state.payment.paymentMethod) {
          errors.push('Please select a payment method for the amount owed');
        }
      }
      break;
    }

    case 'review': {
      // Review requires all prior steps to be complete
      const requiredSteps = ['personal-info', 'dependents', 'income', 'deductions', 'credits', 'tax-summary'];
      requiredSteps.forEach(step => {
        if (!state.formProgress.completedSteps.includes(step)) {
          errors.push(`Please complete the ${step.replace(/-/g, ' ')} step first`);
        }
      });
      break;
    }

    default:
      break;
  }

  return errors;
}
