const STORAGE_KEY = 'california_tax_mock_state';
const INITIAL_STATE_KEY = 'california_tax_mock_initialState';

export const seedData = {
  taxReturn: {
    id: 'CA540-2024-DEMO001',
    taxYear: 2024,
    status: 'in_progress',
    createdAt: '2025-02-15T10:30:00.000Z',
    updatedAt: '2025-02-15T10:30:00.000Z',
    confirmationNumber: null
  },

  personalInfo: {
    filingStatus: 'single',
    firstName: 'Maria',
    middleInitial: 'L',
    lastName: 'Santos',
    suffix: '',
    ssn: '592847163',
    dateOfBirth: '1988-06-14',
    spouseFirstName: '',
    spouseMiddleInitial: '',
    spouseLastName: '',
    spouseSsn: '',
    spouseDateOfBirth: '',
    address: {
      street: '2847 Oak Valley Drive',
      apt: 'Unit 12',
      city: 'San Jose',
      state: 'CA',
      zip: '95128'
    },
    phone: '(408) 555-3291',
    email: 'maria.santos@email.com'
  },

  dependents: [],

  income: {
    w2s: [
      {
        id: 1001,
        employerName: 'Bay Area Tech Solutions Inc',
        employerEin: '94-3281756',
        wages: '82500.00',
        federalWithheld: '14200.00',
        stateWages: '82500.00',
        stateWithheld: '4950.00'
      }
    ],
    interest1099: [
      {
        id: 2001,
        payerName: 'Wells Fargo Bank',
        amount: '342.50'
      }
    ],
    dividend1099: [],
    otherIncome: [],
    federalAgi: '82500.00'
  },

  deductions: {
    type: 'standard',
    standardAmount: 5540,
    itemized: {
      medicalExpenses: 0,
      stateLocalTaxes: 0,
      mortgageInterest: 0,
      charitableContributions: 0,
      otherDeductions: 0
    },
    caAdjustmentsSubtraction: 0,
    caAdjustmentsAddition: 0,
    voluntaryContributions: []
  },

  credits: {
    calEitc: { eligible: false, amount: 0 },
    childDependentCare: { eligible: false, expenses: 0, amount: 0 },
    rentersCredit: { eligible: true, amount: 60 },
    seniorHeadOfHousehold: { eligible: false, amount: 0 },
    jointCustodyHeadOfHousehold: { eligible: false, amount: 0 },
    dependentParent: { eligible: false, amount: 0 },
    otherCredits: []
  },

  calculations: {},

  payment: {
    refundMethod: 'direct_deposit',
    bankRoutingNumber: '',
    bankAccountNumber: '',
    accountType: '',
    paymentMethod: '',
    paymentDate: '',
    estimatedPayments: '',
    webPaySubmissions: []
  },

  formProgress: {
    currentStep: 1,
    completedSteps: ['personal-info'],
    stepErrors: {}
  },

  ui: {
    currentView: 'filing',
    showValidationErrors: false,
    isSaving: false,
    showConfirmDialog: false,
    activeTooltip: null
  },

  meta: {
    lastSavedAt: null,
    sessionExpiresAt: null
  }
};

export const initialData = seedData;

export function getSessionId() {
  if (typeof window === 'undefined') return null;
  // Check sessionStorage first (persists across React Router navigation)
  const stored = sessionStorage.getItem('california_tax_sid');
  if (stored) return stored;
  // Read from URL
  const params = new URLSearchParams(window.location.search);
  const sid = params.get('sid') || null;
  if (sid) {
    sessionStorage.setItem('california_tax_sid', sid);
  }
  return sid;
}

export function storageKey(sid) {
  return sid ? `${STORAGE_KEY}_${sid}` : STORAGE_KEY;
}

export function initialKey(sid) {
  return sid ? `${INITIAL_STATE_KEY}_${sid}` : INITIAL_STATE_KEY;
}

function getStorageKey(sid) {
  return storageKey(sid);
}

function getInitialStorageKey(sid) {
  return initialKey(sid);
}

export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const result = { ...target };
  for (const key in source) {
    if (
      source[key] !== null &&
      source[key] !== undefined &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (source[key] !== null && source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

export function deepMergeWithDefaults(defaults, custom) {
  return deepMerge(defaults, custom);
}

export function loadData(sid) {
  try {
    const key = getStorageKey(sid);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return null;
}

export function saveData(state, sid) {
  try {
    const key = getStorageKey(sid);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

export function saveInitialState(state, sid) {
  try {
    const key = getInitialStorageKey(sid);
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Error saving initial state:', e);
  }
}

export function loadInitialState(sid) {
  try {
    const key = getInitialStorageKey(sid);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading initial state:', e);
  }
  return null;
}

export function clearData(sid) {
  try {
    localStorage.removeItem(getStorageKey(sid));
    localStorage.removeItem(getInitialStorageKey(sid));
  } catch (e) {
    console.error('Error clearing state:', e);
  }
}

export async function fetchCustomState(sid) {
  try {
    const url = sid ? `/state?sid=${encodeURIComponent(sid)}` : '/state';
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) return null;
    const json = await resp.json();
    if (json && json.has_custom_state && json.stored_state) {
      return json.stored_state;
    }
  } catch (e) {
    // Server not available (e.g., production build without dev server)
    console.warn('fetchCustomState: server not available or returned invalid response:', e);
  }
  return null;
}

export function normalizeState(state) {
  if (!state) return state;
  const result = { ...state };

  // Ensure array fields have proper structure
  if (result.dependents && !Array.isArray(result.dependents)) {
    result.dependents = [];
  }
  if (result.income) {
    const income = { ...result.income };
    if (!Array.isArray(income.w2s)) income.w2s = [];
    if (!Array.isArray(income.interest1099)) income.interest1099 = [];
    if (!Array.isArray(income.dividend1099)) income.dividend1099 = [];
    if (!Array.isArray(income.otherIncome)) income.otherIncome = [];
    result.income = income;
  }
  if (result.credits) {
    const credits = { ...result.credits };
    if (!Array.isArray(credits.otherCredits)) credits.otherCredits = [];
    result.credits = credits;
  }
  if (result.deductions) {
    const deductions = { ...result.deductions };
    if (!Array.isArray(deductions.voluntaryContributions)) deductions.voluntaryContributions = [];
    result.deductions = deductions;
  }

  return result;
}

export function initializeData(sid = null, customState = null) {
  // If custom state provided (from POST /post), merge with defaults
  if (customState) {
    const normalized = normalizeState(customState);
    const merged = { ...seedData, ...normalized };
    saveData(merged, sid);
    saveInitialState(merged, sid);
    return merged;
  }

  // Check for existing saved data (refresh scenario)
  const saved = loadData(sid);
  if (saved) {
    return deepMerge(seedData, saved);
  }

  // Fresh start: use seed data
  return { ...seedData };
}
