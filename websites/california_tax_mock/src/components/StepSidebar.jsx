import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTax } from '../context/TaxContext';
import { Check, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 'personal-info', label: 'Personal Information', path: '/filing/personal-info', number: 1 },
  { id: 'dependents', label: 'Dependents', path: '/filing/dependents', number: 2 },
  { id: 'income', label: 'Income', path: '/filing/income', number: 3 },
  { id: 'deductions', label: 'Deductions', path: '/filing/deductions', number: 4 },
  { id: 'credits', label: 'Credits', path: '/filing/credits', number: 5 },
  { id: 'tax-summary', label: 'Tax Summary', path: '/filing/tax-summary', number: 6 },
  { id: 'review', label: 'Review & Sign', path: '/filing/review', number: 7 },
  { id: 'confirmation', label: 'Confirmation', path: '/filing/confirmation', number: 8 },
];

export { STEPS };

function StepSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useTax();
  const { completedSteps, stepErrors } = state.formProgress;

  const currentPath = location.pathname;
  const completedCount = completedSteps.length;
  const totalSteps = STEPS.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleStepClick = (step) => {
    navigate(step.path + location.search);
  };

  return (
    <div className="bg-white h-full border-r border-gray-200 py-4">
      {/* Heading */}
      <div className="px-4 mb-3">
        <h3 className="text-sm font-bold text-ftb-blue uppercase tracking-wider">Filing Steps</h3>
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="text-xs text-gray-500 mb-1">Progress: {progressPercent}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-ftb-success rounded-full h-2 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step List */}
      <nav className="space-y-1">
        {STEPS.map((step) => {
          const isCurrent = currentPath === step.path;
          const isCompleted = completedSteps.includes(step.id);
          const hasErrors = stepErrors[step.id] && stepErrors[step.id].length > 0;

          let statusIcon;
          let statusClass;

          if (isCompleted && !hasErrors) {
            statusIcon = <Check className="w-4 h-4 text-ftb-success" />;
            statusClass = 'text-ftb-success';
          } else if (hasErrors) {
            statusIcon = <AlertCircle className="w-4 h-4 text-ftb-error" />;
            statusClass = 'text-ftb-error';
          } else if (isCurrent) {
            statusIcon = <span className="w-4 h-4 rounded-full bg-ftb-blue block" />;
            statusClass = 'text-ftb-blue font-semibold';
          } else {
            statusIcon = <span className="w-4 h-4 rounded-full bg-gray-300 block" />;
            statusClass = 'text-gray-400';
          }

          // A step is clickable if it is already completed, has errors (to fix them),
          // is the current step, or is the immediately next step after the last completed one.
          const lastCompletedIndex = STEPS.reduce((max, s, i) =>
            completedSteps.includes(s.id) ? i : max, -1);
          const stepIndex = STEPS.findIndex(s => s.id === step.id);
          const canClick =
            isCompleted ||
            hasErrors ||
            isCurrent ||
            stepIndex <= lastCompletedIndex + 1;

          return (
            <button
              key={step.id}
              onClick={() => canClick && handleStepClick(step)}
              disabled={!canClick}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
                ${isCurrent ? 'bg-blue-50 border-l-4 border-ftb-blue' : 'border-l-4 border-transparent'}
                ${canClick ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default opacity-50'}
                ${statusClass}
              `}
            >
              <span className="flex-shrink-0">{statusIcon}</span>
              <span className={isCurrent ? 'text-ftb-blue font-semibold' : isCompleted ? 'text-gray-700' : 'text-gray-400'}>
                {step.number}. {step.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default StepSidebar;
