import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-dsGray-bg border-t border-dsGray-border mt-8 py-4 mb-8">
      <div className="max-w-[980px] mx-auto px-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-8 h-8 bg-dsBlue rounded-full flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <p className="text-xs text-gray-600 text-left">
            This site is managed by the Bureau of Consular Affairs, U.S. Department of State. External links to other Internet sites should not be construed as an endorsement of the views contained therein.
          </p>
        </div>
        <div className="flex gap-4 text-xs text-blue-700 underline">
          <a href="https://travel.state.gov/content/travel/en/legal/travel-legal-considerations/us-copyright.html" target="_blank" rel="noopener noreferrer">Copyright Information</a>
          <a href="https://travel.state.gov/content/travel/en/legal/disclaimer.html" target="_blank" rel="noopener noreferrer">Disclaimers</a>
          <a href="https://travel.state.gov/content/travel/en/legal/privacy-policy.html" target="_blank" rel="noopener noreferrer">Paperwork Reduction Act</a>
          <a href="https://travel.state.gov/content/travel/en/legal/privacy-policy.html" target="_blank" rel="noopener noreferrer">FBI Privacy Act</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
