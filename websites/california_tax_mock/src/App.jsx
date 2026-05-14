import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { TaxProvider, useTax } from './context/TaxContext';
import { validateStep } from './utils/validators';
import Layout from './components/Layout';
import WelcomePage from './components/WelcomePage';
import PersonalInfoForm from './components/PersonalInfoForm';
import DependentsList from './components/DependentsList';
import IncomeForm from './components/IncomeForm';
import DeductionsForm from './components/DeductionsForm';
import CreditsForm from './components/CreditsForm';
import TaxSummaryView from './components/TaxSummaryView';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';
import Go from './pages/Go';
import PaymentPage from './pages/PaymentPage';
import RefundPage from './pages/RefundPage';
import FormsPage from './pages/FormsPage';
import HelpPage from './pages/HelpPage';
import AccountPage from './pages/AccountPage';
import ComingSoonPage from './pages/ComingSoonPage';

const STEP_CONFIG = [
  { id: 'personal-info', path: '/filing/personal-info', label: 'Personal Information' },
  { id: 'dependents', path: '/filing/dependents', label: 'Dependents' },
  { id: 'income', path: '/filing/income', label: 'Income' },
  { id: 'deductions', path: '/filing/deductions', label: 'Deductions' },
  { id: 'credits', path: '/filing/credits', label: 'Credits' },
  { id: 'tax-summary', path: '/filing/tax-summary', label: 'Tax Summary' },
  { id: 'review', path: '/filing/review', label: 'Review & Sign' },
  { id: 'confirmation', path: '/filing/confirmation', label: 'Confirmation' },
];

function RedirectWithQuery({ to }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  return <Navigate to={query ? `${to}?${query}` : to} replace />;
}

function StepNavigation({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useTax();

  const currentStepIndex = STEP_CONFIG.findIndex(s => s.path === location.pathname);
  const isFilingRoute = currentStepIndex >= 0;

  if (!isFilingRoute) return <>{children}</>;

  const currentStep = STEP_CONFIG[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEP_CONFIG.length - 1;
  const isConfirmation = currentStep.id === 'confirmation';
  const isReview = currentStep.id === 'review';

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = STEP_CONFIG[currentStepIndex - 1];
      dispatch({ type: 'SET_STEP', payload: currentStepIndex });
      navigate(prevStep.path + location.search);
    }
  };

  const handleNext = () => {
    // Validate current step
    const errors = validateStep(currentStep.id, state);

    if (errors.length > 0) {
      dispatch({ type: 'SET_STEP_ERRORS', payload: { step: currentStep.id, errors } });
      dispatch({ type: 'UPDATE_UI', payload: { showValidationErrors: true } });
      return;
    }

    // Clear errors and mark step complete
    dispatch({ type: 'SET_STEP_ERRORS', payload: { step: currentStep.id, errors: [] } });
    dispatch({ type: 'COMPLETE_STEP', payload: currentStep.id });

    if (!isLastStep) {
      const nextStep = STEP_CONFIG[currentStepIndex + 1];
      dispatch({ type: 'SET_STEP', payload: currentStepIndex + 2 });
      navigate(nextStep.path + location.search);
    }
  };

  const handleSaveAndExit = () => {
    // State is already auto-saved
    navigate('/' + (location.search || ''));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Step content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Validation errors */}
      {state.ui.showValidationErrors && state.formProgress.stepErrors[currentStep.id]?.length > 0 && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border-l-4 border-ftb-error rounded-sm">
          <h4 className="font-semibold text-ftb-error mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-sm text-ftb-error space-y-1">
            {state.formProgress.stepErrors[currentStep.id].map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation buttons */}
      {!isConfirmation && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
          <div>
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveAndExit}
              className="btn-secondary"
            >
              Save & Exit
            </button>
            {!isReview && (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper pages that compose form components for each step
function PersonalInfoPage() {
  return (
    <div className="space-y-6">
      <PersonalInfoForm />
    </div>
  );
}

function DependentsPage() {
  return <DependentsList />;
}

function IncomePage() {
  return (
    <div className="space-y-6">
      <IncomeForm />
    </div>
  );
}

function DeductionsPage() {
  return <DeductionsForm />;
}

function CreditsPage() {
  return <CreditsForm />;
}

function TaxSummaryPage() {
  return <TaxSummaryView />;
}

function ReviewPageWrapper() {
  return <ReviewPage />;
}

function ConfirmationPageWrapper() {
  return <ConfirmationPage />;
}

function App() {
  return (
    <TaxProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route
              path="/filing/personal-info"
              element={
                <StepNavigation>
                  <PersonalInfoPage />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/dependents"
              element={
                <StepNavigation>
                  <DependentsPage />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/income"
              element={
                <StepNavigation>
                  <IncomePage />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/deductions"
              element={
                <StepNavigation>
                  <DeductionsPage />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/credits"
              element={
                <StepNavigation>
                  <CreditsPage />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/tax-summary"
              element={
                <StepNavigation>
                  <TaxSummaryPage />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/review"
              element={
                <StepNavigation>
                  <ReviewPageWrapper />
                </StepNavigation>
              }
            />
            <Route
              path="/filing/confirmation"
              element={
                <StepNavigation>
                  <ConfirmationPageWrapper />
                </StepNavigation>
              }
            />
            <Route path="/go" element={<Go />} />
            <Route path="/pay" element={<PaymentPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/coming-soon/:section" element={<ComingSoonPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TaxProvider>
  );
}

export default App;
