import React from 'react';
import { useLocation } from 'react-router-dom';

const PHASES = [
  {
    id: 'complete',
    label: 'COMPLETE',
    paths: [
      'personal1', 'personal2', 'address', 'passport', 'travel',
      'travelCompanions', 'previousTravel', 'usContact', 'family', 'work',
      'security1', 'security2', 'security3', 'security4', 'security5',
    ],
  },
  {
    id: 'photo',
    label: 'PHOTO',
    paths: ['photo'],
  },
  {
    id: 'review',
    label: 'REVIEW',
    paths: ['review'],
  },
  {
    id: 'sign',
    label: 'SIGN',
    paths: ['sign', 'confirmation'],
  },
];

const ProgressBar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  const getActivePhaseIndex = () => {
    for (let i = 0; i < PHASES.length; i++) {
      if (PHASES[i].paths.includes(currentPath)) return i;
    }
    return -1;
  };

  const activeIndex = getActivePhaseIndex();

  return (
    <div className="w-full border-b border-[#CCCCCC] mb-4">
      <div className="flex text-[11px] font-sans font-bold">
        {PHASES.map((phase, index) => {
          const isActive = index === activeIndex;
          const isCompleted = activeIndex > index;

          return (
            <div
              key={phase.id}
              className={`
                flex-1 text-center py-[5px] px-2 border-r border-[#CCCCCC] last:border-r-0
                ${isActive
                  ? 'bg-[#003366] text-white'
                  : isCompleted
                    ? 'bg-[#99BB99] text-white'
                    : 'bg-[#F0F0F0] text-[#666666]'
                }
              `}
            >
              {isCompleted && <span className="mr-1">&#10003;</span>}
              {phase.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
