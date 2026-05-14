import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SECTIONS = [
  { id: 'start', label: 'Getting Started', path: '/application/id-generation' },
  { id: 'personal1', label: 'Personal 1', path: '/application/personal1' },
  { id: 'personal2', label: 'Personal 2', path: '/application/personal2' },
  { id: 'address', label: 'Address & Phone', path: '/application/address' },
  { id: 'passport', label: 'Passport', path: '/application/passport' },
  { id: 'travel', label: 'Travel', path: '/application/travel' },
  { id: 'travelCompanions', label: 'Travel Companions', path: '/application/travelCompanions' },
  { id: 'previousTravel', label: 'Previous U.S. Travel', path: '/application/previousTravel' },
  { id: 'usContact', label: 'U.S. Contact', path: '/application/usContact' },
  { id: 'family', label: 'Family', path: '/application/family' },
  { id: 'work', label: 'Work / Education', path: '/application/work' },
  { id: 'security', label: 'Security and Background', path: '/application/security1' },
  { id: 'photo', label: 'Photo', path: '/application/photo' },
  { id: 'review', label: 'Review', path: '/application/review' },
  { id: 'sign', label: 'Sign and Submit', path: '/application/sign' },
  { id: 'confirmation', label: 'Confirmation', path: '/application/confirmation' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const currentPath = location.pathname.replace('/application/', '');
  const completedSections = state.completedSections || [];

  const isActive = (section) => {
    if (section.id === 'security') {
      return /^security\d*$/.test(currentPath);
    }
    if (section.id === 'confirmation') {
      return currentPath === 'confirmation';
    }
    return currentPath === section.id;
  };

  const isCompleted = (section) => {
    if (section.id === 'security') {
      return completedSections.some(s => s === 'security' || /^security\d+$/.test(s));
    }
    return completedSections.includes(section.id);
  };

  const applicationStatus = state.ds160Application?.status;
  const confirmationSection = SECTIONS.find(s => s.id === 'confirmation');
  const visibleSections = applicationStatus === 'Submitted'
    ? SECTIONS
    : SECTIONS.filter(s => s.id !== 'confirmation');

  return (
    <div className="w-[170px] flex-shrink-0 bg-[#F5F5F5] border-r border-[#CCCCCC] min-h-[600px] pt-2">
      <ul className="text-[11px] font-sans">
        {visibleSections.map((section) => {
          const active = isActive(section);
          const completed = isCompleted(section);

          return (
            <li
              key={section.id}
              onClick={() => navigate(section.path)}
              className={`
                px-2 py-[2px] border-b border-white cursor-pointer
                ${active ? 'bg-[#666666] text-white font-bold' : 'text-black hover:underline hover:bg-[#E8E8E8]'}
              `}
            >
              {completed && <span className="text-green-600 mr-1">&#10003;</span>}
              {section.label}
            </li>
          );
        })}
      </ul>

      {/* Help Box */}
      <div className="mt-6 mx-2 border border-[#99CCFF] bg-[#E8F0F8] p-2 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-[14px] h-[14px] bg-[#3366CC] rounded-full flex items-center justify-center text-white font-serif italic font-bold text-[10px]">i</div>
          <span className="font-bold text-[11px] text-[#003366]">Help: Navigation</span>
        </div>
        <p className="text-[10px] leading-tight text-black">
          Click on the sections above to navigate between pages.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
