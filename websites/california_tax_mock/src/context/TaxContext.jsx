import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { initialData, getSessionId, loadData, saveData, saveInitialState, loadInitialState, initializeData, fetchCustomState, storageKey, deepMerge } from '../utils/initialState';
import { calculateFinalTax } from '../utils/taxCalculator';

const TaxContext = createContext();

function runCalculations(state) {
  try {
    const calculations = calculateFinalTax(state);
    return { ...state, calculations };
  } catch (e) {
    console.error('Tax calculation error:', e);
    return state;
  }
}

// Normalize action: accept both { type, payload: { section, data } } and { type, section, data }
function getPayload(action) {
  if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
    return action.payload;
  }
  // Extract known keys from action directly (flat dispatch pattern)
  const { type, payload, ...rest } = action;
  if (Object.keys(rest).length > 0) return rest;
  return payload;
}

// Resolve index for array removal/update: supports both `index` and `id`
function resolveIndex(arr, p) {
  if (typeof p.index === 'number') return p.index;
  if (p.id !== undefined) return arr.findIndex(item => item.id === p.id);
  return -1;
}

const taxReducer = (state, action) => {
  let newState;
  const p = (['SET_STATE', 'SET_STEP', 'COMPLETE_STEP', 'UPDATE_UI', 'SUBMIT_RETURN', 'RESET_RETURN'].includes(action.type))
    ? action.payload
    : getPayload(action);

  switch (action.type) {
    case 'SET_STATE':
      return runCalculations(action.payload);

    case 'UPDATE_SECTION':
      newState = {
        ...state,
        [p.section]: {
          ...state[p.section],
          ...p.data
        },
        taxReturn: {
          ...state.taxReturn,
          updatedAt: new Date().toISOString(),
          status: state.taxReturn.status === 'draft' ? 'in_progress' : state.taxReturn.status
        }
      };
      return runCalculations(newState);

    case 'ADD_ARRAY_ITEM':
      if (p.field) {
        newState = {
          ...state,
          [p.section]: {
            ...state[p.section],
            [p.field]: [
              ...state[p.section][p.field],
              p.item
            ]
          },
          taxReturn: { ...state.taxReturn, updatedAt: new Date().toISOString() }
        };
      } else {
        newState = {
          ...state,
          [p.section]: [
            ...state[p.section],
            p.item
          ],
          taxReturn: { ...state.taxReturn, updatedAt: new Date().toISOString() }
        };
      }
      return runCalculations(newState);

    case 'REMOVE_ARRAY_ITEM': {
      if (p.field) {
        const arr = [...state[p.section][p.field]];
        const idx = resolveIndex(arr, p);
        if (idx >= 0) arr.splice(idx, 1);
        newState = {
          ...state,
          [p.section]: {
            ...state[p.section],
            [p.field]: arr
          },
          taxReturn: { ...state.taxReturn, updatedAt: new Date().toISOString() }
        };
      } else {
        const arr = [...state[p.section]];
        const idx = resolveIndex(arr, p);
        if (idx >= 0) arr.splice(idx, 1);
        newState = {
          ...state,
          [p.section]: arr,
          taxReturn: { ...state.taxReturn, updatedAt: new Date().toISOString() }
        };
      }
      return runCalculations(newState);
    }

    case 'UPDATE_ARRAY_ITEM': {
      if (p.field) {
        const updated = [...state[p.section][p.field]];
        const idx = resolveIndex(updated, p);
        if (idx >= 0) updated[idx] = { ...updated[idx], ...p.data };
        newState = {
          ...state,
          [p.section]: {
            ...state[p.section],
            [p.field]: updated
          },
          taxReturn: { ...state.taxReturn, updatedAt: new Date().toISOString() }
        };
      } else {
        const updated = [...state[p.section]];
        const idx = resolveIndex(updated, p);
        if (idx >= 0) updated[idx] = { ...updated[idx], ...p.data };
        newState = {
          ...state,
          [p.section]: updated,
          taxReturn: { ...state.taxReturn, updatedAt: new Date().toISOString() }
        };
      }
      return runCalculations(newState);
    }

    case 'SUBMIT_RETURN':
      newState = {
        ...state,
        taxReturn: {
          ...state.taxReturn,
          status: 'submitted',
          updatedAt: new Date().toISOString(),
          confirmationNumber: 'CA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()
        }
      };
      return newState;

    case 'RESET_STATE':
    case 'RESET_RETURN': {
      const fresh = {
        ...initialData,
        taxReturn: {
          ...initialData.taxReturn,
          id: 'CA540-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      return runCalculations(fresh);
    }

    case 'SET_STEP':
      return {
        ...state,
        formProgress: {
          ...state.formProgress,
          currentStep: action.payload
        }
      };

    case 'COMPLETE_STEP':
      return {
        ...state,
        formProgress: {
          ...state.formProgress,
          completedSteps: state.formProgress.completedSteps.includes(action.payload)
            ? state.formProgress.completedSteps
            : [...state.formProgress.completedSteps, action.payload]
        }
      };

    case 'SET_STEP_ERRORS':
      // payload: { step: 'personal-info', errors: [...] }
      return {
        ...state,
        formProgress: {
          ...state.formProgress,
          stepErrors: {
            ...state.formProgress.stepErrors,
            [action.payload.step]: action.payload.errors
          }
        }
      };

    case 'UPDATE_UI':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

export const TaxProvider = ({ children }) => {
  const sidRef = useRef(getSessionId());
  const [initialStateSnapshot, setInitialStateSnapshot] = useState(null);
  const [state, dispatch] = useReducer(taxReducer, null);
  const [loading, setLoading] = useState(true);
  const [savingIndicator, setSavingIndicator] = useState(false);
  const savingTimerRef = useRef(null);
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const sid = sidRef.current;

    if (sid) {
      // Check if session localStorage already exists (page refresh scenario)
      const isRefresh = localStorage.getItem(storageKey(sid)) !== null;

      if (isRefresh) {
        // Refresh: use existing localStorage (preserves agent's changes)
        const data = initializeData(sid);
        dispatch({ type: 'SET_STATE', payload: data });
        const savedInitial = loadInitialState(sid);
        if (savedInitial) {
          setInitialStateSnapshot(savedInitial);
        } else {
          saveInitialState(data, sid);
          setInitialStateSnapshot(data);
        }
        setLoading(false);
      } else {
        // First load: fetch custom state from server, then initialize
        fetchCustomState(sid).then(customState => {
          const data = initializeData(sid, customState);
          dispatch({ type: 'SET_STATE', payload: data });
          const savedInitial = loadInitialState(sid);
          if (savedInitial) {
            setInitialStateSnapshot(savedInitial);
          } else {
            saveInitialState(data, sid);
            setInitialStateSnapshot(data);
          }
          setLoading(false);
        });
      }
    } else {
      // No sid: default behavior (no server fetch)
      const data = initializeData();
      dispatch({ type: 'SET_STATE', payload: data });
      const savedInitial = loadInitialState(null);
      if (savedInitial) {
        setInitialStateSnapshot(savedInitial);
      } else {
        saveInitialState(data, null);
        setInitialStateSnapshot(data);
      }
      setLoading(false);
    }
  }, []);

  // Auto-save to localStorage on state changes
  useEffect(() => {
    if (!loading && state) {
      setSavingIndicator(true);
      saveData(state, sidRef.current);
      if (savingTimerRef.current) clearTimeout(savingTimerRef.current);
      savingTimerRef.current = setTimeout(() => setSavingIndicator(false), 1500);
    }
  }, [state, loading]);

  // Sync state to server so GET /go?sid=XXX returns current state for RL training
  useEffect(() => {
    if (!loading && state) {
      const sid = sidRef.current;
      const url = sid ? `/post?sid=${encodeURIComponent(sid)}` : '/post';
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_current', state, merge: false })
      }).catch((err) => {
        console.warn('State sync to server failed (non-critical):', err);
      });
    }
  }, [state, loading]);

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ftb-light">
        <div className="text-lg text-gray-600">Loading CalFile...</div>
      </div>
    );
  }

  return (
    <TaxContext.Provider value={{ state, dispatch, initialState: initialStateSnapshot, savingIndicator }}>
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};

export { TaxContext };
export default TaxContext;
