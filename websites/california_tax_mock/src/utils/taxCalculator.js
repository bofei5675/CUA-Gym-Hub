// California 2024 Tax Rate Schedule (Single filers)
// Married filing jointly brackets are 2x these amounts
const SINGLE_BRACKETS = [
  { min: 0, max: 10412, rate: 0.01 },
  { min: 10413, max: 24684, rate: 0.02 },
  { min: 24685, max: 38959, rate: 0.04 },
  { min: 38960, max: 54081, rate: 0.06 },
  { min: 54082, max: 68350, rate: 0.08 },
  { min: 68351, max: 349137, rate: 0.093 },
  { min: 349138, max: 418961, rate: 0.103 },
  { min: 418962, max: 698271, rate: 0.113 },
  { min: 698272, max: Infinity, rate: 0.123 }
];

const JOINT_BRACKETS = [
  { min: 0, max: 20824, rate: 0.01 },
  { min: 20825, max: 49368, rate: 0.02 },
  { min: 49369, max: 77918, rate: 0.04 },
  { min: 77919, max: 108162, rate: 0.06 },
  { min: 108163, max: 136700, rate: 0.08 },
  { min: 136701, max: 698274, rate: 0.093 },
  { min: 698275, max: 837922, rate: 0.103 },
  { min: 837923, max: 1396542, rate: 0.113 },
  { min: 1396543, max: Infinity, rate: 0.123 }
];

// Standard deduction amounts (2024)
const STANDARD_DEDUCTIONS = {
  single: 5540,
  married_joint: 11080,
  married_separate: 5540,
  head_of_household: 11080,
  qualifying_widow: 11080
};

// Exemption credit amounts (2024)
const PERSONAL_EXEMPTION_CREDIT = 149;
const DEPENDENT_EXEMPTION_CREDIT = 461;

function getBrackets(filingStatus) {
  if (filingStatus === 'married_joint' || filingStatus === 'qualifying_widow') {
    return JOINT_BRACKETS;
  }
  return SINGLE_BRACKETS;
}

export function getStandardDeduction(filingStatus) {
  return STANDARD_DEDUCTIONS[filingStatus] || 0;
}

export function calculateTotalIncome(state) {
  const { w2s, interest1099, dividend1099, otherIncome } = state.income;

  const w2Total = w2s.reduce((sum, w2) => sum + (Number(w2.wages) || 0), 0);
  const interestTotal = interest1099.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const dividendTotal = dividend1099.reduce((sum, item) => sum + (Number(item.ordinaryDividends) || 0), 0);
  const otherTotal = otherIncome.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return w2Total + interestTotal + dividendTotal + otherTotal;
}

export function calculateCAagi(state) {
  const federalAgi = Number(state.income.federalAgi) || 0;
  const caSubtractions = Number(state.deductions.caAdjustmentsSubtraction) || 0;
  const caAdditions = Number(state.deductions.caAdjustmentsAddition) || 0;

  return federalAgi - caSubtractions + caAdditions;
}

export function calculateTaxableIncome(agi, deductions) {
  const taxable = agi - deductions;
  return Math.max(0, taxable);
}

export function calculateTax(taxableIncome, filingStatus) {
  if (taxableIncome <= 0) return 0;

  const brackets = getBrackets(filingStatus);
  let tax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
  }

  return Math.round(tax * 100) / 100;
}

export function calculateExemptionCredits(state) {
  let credits = PERSONAL_EXEMPTION_CREDIT; // Taxpayer

  const filingStatus = state.personalInfo.filingStatus;
  if (filingStatus === 'married_joint') {
    credits += PERSONAL_EXEMPTION_CREDIT; // Spouse
  }

  const dependentCount = state.dependents.length;
  credits += dependentCount * DEPENDENT_EXEMPTION_CREDIT;

  return credits;
}

export function calculateTotalCredits(state) {
  const { credits } = state;

  let nonrefundable = 0;
  let refundable = 0;

  // Renter's credit (nonrefundable)
  if (credits.rentersCredit.eligible) {
    nonrefundable += Number(credits.rentersCredit.amount) || 0;
  }

  // Child/dependent care credit (nonrefundable)
  if (credits.childDependentCare.eligible) {
    nonrefundable += Number(credits.childDependentCare.amount) || 0;
  }

  // Senior head of household (nonrefundable)
  if (credits.seniorHeadOfHousehold.eligible) {
    nonrefundable += Number(credits.seniorHeadOfHousehold.amount) || 0;
  }

  // Joint custody head of household (nonrefundable)
  if (credits.jointCustodyHeadOfHousehold.eligible) {
    nonrefundable += Number(credits.jointCustodyHeadOfHousehold.amount) || 0;
  }

  // Dependent parent (nonrefundable)
  if (credits.dependentParent.eligible) {
    nonrefundable += Number(credits.dependentParent.amount) || 0;
  }

  // Other credits (nonrefundable)
  nonrefundable += credits.otherCredits.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  // CalEITC (refundable)
  if (credits.calEitc.eligible) {
    refundable += Number(credits.calEitc.amount) || 0;
  }

  return { nonrefundable, refundable };
}

export function calculateTotalWithholdings(state) {
  return state.income.w2s.reduce((sum, w2) => sum + (Number(w2.stateWithheld) || 0), 0);
}

export function calculateFinalTax(state) {
  const totalIncome = calculateTotalIncome(state);

  // Use federal AGI if provided, otherwise use total income
  const federalAgi = Number(state.income.federalAgi) || totalIncome;
  const caSubtractions = Number(state.deductions.caAdjustmentsSubtraction) || 0;
  const caAdditions = Number(state.deductions.caAdjustmentsAddition) || 0;
  const adjustedGrossIncome = federalAgi - caSubtractions + caAdditions;

  // Determine deductions
  const filingStatus = state.personalInfo.filingStatus;
  let totalDeductions;
  if (state.deductions.type === 'itemized') {
    const itemized = state.deductions.itemized;
    totalDeductions =
      (Number(itemized.medicalExpenses) || 0) +
      (Number(itemized.stateLocalTaxes) || 0) +
      (Number(itemized.mortgageInterest) || 0) +
      (Number(itemized.charitableContributions) || 0) +
      (Number(itemized.otherDeductions) || 0);
  } else {
    totalDeductions = getStandardDeduction(filingStatus);
  }

  const taxableIncome = calculateTaxableIncome(adjustedGrossIncome, totalDeductions);
  const taxBeforeCredits = calculateTax(taxableIncome, filingStatus);
  const exemptionCredits = calculateExemptionCredits(state);
  const { nonrefundable, refundable } = calculateTotalCredits(state);

  // Apply exemption credits and nonrefundable credits (cannot reduce below 0)
  const taxAfterExemptions = Math.max(0, taxBeforeCredits - exemptionCredits);
  const taxAfterNonrefundable = Math.max(0, taxAfterExemptions - nonrefundable);

  // Apply refundable credits (can reduce below 0 = refund)
  const netTax = taxAfterNonrefundable - refundable;

  // Calculate payments
  const totalWithholdings = calculateTotalWithholdings(state);
  const estimatedPayments = parseFloat(state.payment?.estimatedPayments) || 0;
  const totalPayments = totalWithholdings + estimatedPayments;

  // Determine refund or amount owed
  const voluntaryContributions = (state.deductions?.voluntaryContributions || [])
    .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const difference = totalPayments - netTax;
  const overpaymentBeforeContribs = Math.max(0, difference);
  const amountOwedBeforeContribs = Math.max(0, -difference);
  // Voluntary contributions come from refund first, then increase amount owed
  const refundAfterContribs = Math.max(0, overpaymentBeforeContribs - voluntaryContributions);
  const amountOwed = amountOwedBeforeContribs + Math.max(0, voluntaryContributions - overpaymentBeforeContribs);
  const overpayment = refundAfterContribs;

  return {
    totalIncome,
    adjustedGrossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCredits,
    exemptionCredits,
    totalNonrefundableCredits: nonrefundable,
    totalRefundableCredits: refundable,
    netTax: Math.max(0, netTax),
    totalWithholdings,
    estimatedPayments,
    totalPayments,
    overpayment,
    amountOwed,
    refundAmount: overpayment
  };
}
