import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

const INITIAL_STATE = {
  ds160Application: {
    applicationId: '',
    location: '',
    status: 'Not Started',
    createdAt: null,
    updatedAt: null,
    currentSection: 'start',
  },
  personalInfo: {
    personal1: {
      surname: '',
      givenName: '',
      nativeFullName: '',
      nativeFullNameDoesNotApply: false,
      otherNamesUsed: 'No',
      otherNames: [],
      telecodeName: 'No',
      telecodeNames: [],
      sex: '',
      maritalStatus: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      pobCity: '',
      pobState: '',
      pobStateDoesNotApply: false,
      pobCountry: '',
    },
    personal2: {
      nationality: '',
      otherNationalities: 'No',
      nationalId: '',
      nationalIdDoesNotApply: false,
      ssn: '',
      ssnDoesNotApply: false,
      itin: '',
      itinDoesNotApply: false,
    }
  },
  addressAndPhone: {
    homeAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    mailingSameAsHome: 'Yes',
    mailingAddress: {},
    primaryPhone: '',
    secondaryPhone: '',
    workPhone: '',
    primaryEmail: '',
    secondaryEmail: ''
  },
  passport: {
    passportType: '',
    passportNumber: '',
    passportBookNumber: '',
    passportBookNumberDoesNotApply: false,
    issuingCountry: '',
    issuingCity: '',
    issuingState: '',
    issuingCountryRegion: '',
    issuanceDate: '',
    expirationDate: '',
    expirationDateDoesNotApply: false,
    lostOrStolen: 'No',
    lostPassportNumber: '',
    lostPassportCountry: '',
  },
  travel: {
    purposeOfTrip: '',
    specificTravelPlans: 'No',
    arrivalDate: '',
    arrivalCity: '',
    departureDate: '',
    lengthOfStay: '',
    lengthOfStayUnit: 'Days',
    addressWhereStaying: '',
    payingForTrip: '',
  },
  travelCompanions: {
    travelingWithOthers: 'No',
    companions: [],
    groupName: '',
  },
  previousUSTravel: {
    previouslyInUS: 'No',
    arrivalDate: '',
    lengthOfStay: '',
    previousVisaIssued: 'No',
    previousVisaDate: '',
    previousVisaNumber: '',
    sameTypeVisa: 'Yes',
    sameCountryVisa: 'Yes',
    visaEverRefused: 'No',
    visaRefusedDetails: '',
    immigrationPetitionFiled: 'No',
  },
  usContact: {
    contactName: '',
    organizationName: '',
    relationship: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  },
  family: {
    fatherSurname: '',
    fatherGivenName: '',
    fatherDOB: '',
    fatherInUS: 'No',
    fatherUSStatus: '',
    motherSurname: '',
    motherGivenName: '',
    motherDOB: '',
    motherInUS: 'No',
    motherUSStatus: '',
    spouseSurname: '',
    spouseGivenName: '',
    spouseDOB: '',
    spouseNationality: '',
    spouseCityOfBirth: '',
    spouseCountryOfBirth: '',
    spouseAddressType: '',
  },
  workEducation: {
    primaryOccupation: '',
    presentEmployer: '',
    employerAddress: '',
    employerCity: '',
    employerState: '',
    employerZip: '',
    employerCountry: '',
    employerPhone: '',
    monthlyIncome: '',
    jobTitle: '',
    startDate: '',
    briefDescription: '',
    previouslyEmployed: 'No',
    previousEmployers: [],
    educationLevel: '',
    institutionName: '',
    institutionAddress: '',
    institutionCity: '',
    institutionState: '',
    institutionCountry: '',
    courseOfStudy: '',
    attendedFrom: '',
    attendedTo: '',
  },
  security: {
    part1: {
      communicableDiseaseDisorder: 'No',
      physicalOrMentalDisorder: 'No',
      drugAbuser: 'No',
    },
    part2: {
      arrestedOrConvicted: 'No',
      controlledSubstancesViolator: 'No',
      prostitutionInvolved: 'No',
      moneyLaunderingInvolved: 'No',
      humanTraffickingInvolved: 'No',
    },
    part3: {
      espionageInvolved: 'No',
      terroristActivity: 'No',
      financialAssistanceTerrorism: 'No',
      memberTerroristOrg: 'No',
    },
    part4: {
      immigrationFraud: 'No',
      removedFromUS: 'No',
      deportedFromUS: 'No',
      childCustodyViolation: 'No',
      votingViolation: 'No',
      taxEvader: 'No',
    },
    part5: {
      seekIllegalEntry: 'No',
      otherActivities: 'No',
    },
  },
  photo: {
    photoUploaded: false,
    photoUrl: '',
  },
  signature: {
    signedBy: '',
    signedDate: '',
    passportNumber: '',
    eSigned: false,
  },
  completedSections: [],
  securityQuestion: '',
  securityAnswer: '',
  meta: {
    lastSavedAt: null,
    sessionExpiresAt: null,
  }
};

function getDefaultData() {
  return JSON.parse(JSON.stringify(INITIAL_STATE));
}

// --- Session-aware storage functions ---

const BASE_STORAGE_KEY = 'ds160_state';
const BASE_INITIAL_KEY = 'ds160_initialState';

function storageKey(sid) {
  return sid ? `${BASE_STORAGE_KEY}_${sid}` : BASE_STORAGE_KEY;
}
function initialKey(sid) {
  return sid ? `${BASE_INITIAL_KEY}_${sid}` : BASE_INITIAL_KEY;
}

const getSessionId = () => {
  const params = new URLSearchParams(window.location.search);
  const urlSid = params.get('sid');
  if (urlSid) {
    sessionStorage.setItem('mock_sid', urlSid);
    return urlSid;
  }
  return sessionStorage.getItem('mock_sid') || null;
};

const fetchCustomState = async (sid = null) => {
  try {
    const url = sid ? `/state?sid=${encodeURIComponent(sid)}` : '/state';
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.has_custom_state && data.stored_state) return data.stored_state;
    }
  } catch (e) { console.log('No custom state available'); }
  return null;
};

let _syncTimer = null;

const saveState = (state, sid = null) => {
  localStorage.setItem(storageKey(sid), JSON.stringify(state));
  if (sid) {
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(() => {
      fetch(`/post?sid=${encodeURIComponent(sid)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_current', state }),
      }).catch(() => {});
    }, 300);
  }
};

function deepMergeWithDefaults(defaults, custom) {
  if (!custom) return defaults;
  const result = { ...defaults };
  for (const key in custom) {
    if (custom[key] !== null && custom[key] !== undefined) {
      if (typeof custom[key] === 'object' && !Array.isArray(custom[key]) && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
        result[key] = deepMergeWithDefaults(defaults[key], custom[key]);
      } else {
        result[key] = custom[key];
      }
    }
  }
  return result;
}

const initializeData = (sid = null, customState = null) => {
  const sk = storageKey(sid);
  const ik = initialKey(sid);

  if (customState) {
    const initialData = { ...getDefaultData(), ...customState };
    localStorage.setItem(sk, JSON.stringify(initialData));
    localStorage.setItem(ik, JSON.stringify(initialData));
    return initialData;
  }

  const stored = localStorage.getItem(sk);
  if (stored) {
    if (!localStorage.getItem(ik)) localStorage.setItem(ik, stored);
    return JSON.parse(stored);
  }

  const initialData = getDefaultData();
  localStorage.setItem(sk, JSON.stringify(initialData));
  localStorage.setItem(ik, JSON.stringify(initialData));
  return initialData;
};

export const AppProvider = ({ children }) => {
  const [initialStateSnapshot, setInitialStateSnapshot] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  const sidRef = useRef(getSessionId());
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const sid = sidRef.current;

    if (sid) {
      // CRITICAL: Check localStorage BEFORE initializeData
      const sessionKey = `${BASE_INITIAL_KEY}_${sid}`;
      const isRefresh = localStorage.getItem(sessionKey) !== null;

      if (isRefresh) {
        const data = initializeData(sid);
        setState(data);
        setInitialStateSnapshot(JSON.parse(JSON.stringify(data)));
        setLoading(false);
      } else {
        fetchCustomState(sid).then(customState => {
          const data = initializeData(sid, customState);
          setState(data);
          setInitialStateSnapshot(JSON.parse(JSON.stringify(data)));
          setLoading(false);
        });
      }
    } else {
      fetchCustomState().then(customState => {
        if (customState) {
          const data = initializeData(null, customState);
          setState(data);
          setInitialStateSnapshot(JSON.parse(JSON.stringify(data)));
        } else {
          const data = initializeData();
          setState(data);
          setInitialStateSnapshot(JSON.parse(JSON.stringify(data)));
        }
        setLoading(false);
      });
    }
  }, []);

  // Save on change
  useEffect(() => {
    if (!loading && state) {
      saveState(state, sidRef.current);
    }
  }, [state, loading]);

  const updateState = (path, value) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      newState.ds160Application.updatedAt = new Date().toISOString();
      return newState;
    });
  };

  const generateAppId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'AA00';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateState('ds160Application.applicationId', result);
    updateState('ds160Application.createdAt', new Date().toISOString());
    return result;
  };

  if (loading || !state) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#fff' }}>Loading...</div>;
  }

  return (
    <AppContext.Provider value={{ state, updateState, initialStateSnapshot, generateAppId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
