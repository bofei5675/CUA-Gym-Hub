import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTax } from '../context/TaxContext';
import { ArrowRight, RotateCcw, FileText, Shield, Clock, CheckCircle } from 'lucide-react';
import { clearData, getSessionId } from '../utils/initialState';

function WelcomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useTax();
  const sid = getSessionId();
  const hasSavedReturn = state.taxReturn.status !== 'draft' || state.formProgress.completedSteps.length > 0;

  const handleStartNew = () => {
    dispatch({ type: 'RESET_RETURN' });
    clearData(sid);
    dispatch({ type: 'UPDATE_UI', payload: { currentView: 'filing' } });
    dispatch({ type: 'SET_STEP', payload: 1 });
    navigate('/filing/personal-info' + location.search);
  };

  const handleContinue = () => {
    dispatch({ type: 'UPDATE_UI', payload: { currentView: 'filing' } });
    const stepRoutes = [
      '/filing/personal-info',
      '/filing/dependents',
      '/filing/income',
      '/filing/deductions',
      '/filing/credits',
      '/filing/tax-summary',
      '/filing/review',
      '/filing/confirmation'
    ];
    const stepIndex = Math.min(state.formProgress.currentStep, stepRoutes.length - 1);
    navigate(stepRoutes[Math.max(0, stepIndex - 1)] + location.search);
  };

  const fullName = [state.personalInfo.firstName, state.personalInfo.middleInitial, state.personalInfo.lastName].filter(Boolean).join(' ');

  return (
    <div className="bg-ftb-light">
      {/* Hero Section - 2 column */}
      <div className="bg-ftb-blue text-white">
        <div className="max-w-ca mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              {hasSavedReturn && fullName && (
                <p className="text-blue-200 text-sm font-medium mb-2">Welcome back, {fullName}</p>
              )}
              <h1 className="text-3xl font-bold mb-3">CalFile</h1>
              <p className="text-xl text-blue-200 mb-2">California Free e-File</p>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                File your 2024 California Form 540 (Resident Income Tax Return) online for free.
                CalFile guides you step-by-step with automatic tax calculations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartNew}
                  className="inline-flex items-center justify-center gap-2 bg-ftb-gold text-ca-gray-800 py-3 px-6 rounded-sm hover:bg-yellow-400 transition-colors font-bold text-base"
                >
                  Start New Return
                  <ArrowRight className="w-5 h-5" />
                </button>
                {hasSavedReturn && (
                  <button
                    onClick={handleContinue}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white text-white py-3 px-6 rounded-sm hover:bg-white/10 transition-colors font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Continue Saved Return
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <div className="flex items-center gap-3 text-blue-100">
                <Shield className="w-6 h-6 text-ftb-gold flex-shrink-0" />
                <span className="text-sm">Secure and encrypted connection</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <Clock className="w-6 h-6 text-ftb-gold flex-shrink-0" />
                <span className="text-sm">Save and return at any time</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <CheckCircle className="w-6 h-6 text-ftb-gold flex-shrink-0" />
                <span className="text-sm">Automatic tax calculations</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <FileText className="w-6 h-6 text-ftb-gold flex-shrink-0" />
                <span className="text-sm">E-file directly with FTB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Need */}
      <div className="max-w-ca mx-auto px-6 py-8">
        <div className="gov-section">
          <div className="gov-section-header px-6 pt-4">What You'll Need</div>
          <div className="p-6">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-ftb-success mt-0.5 font-bold">&#10003;</span>
                Social Security Number (SSN) for you and your spouse (if married)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ftb-success mt-0.5 font-bold">&#10003;</span>
                W-2 forms from your employer(s)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ftb-success mt-0.5 font-bold">&#10003;</span>
                1099 forms for interest, dividends, and other income
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ftb-success mt-0.5 font-bold">&#10003;</span>
                Your federal Adjusted Gross Income (AGI) from Form 1040
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ftb-success mt-0.5 font-bold">&#10003;</span>
                Bank account information (for direct deposit of refund)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
