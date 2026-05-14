import React from 'react';

const Header = () => {
  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="w-full relative">
        {/* Gradient Background - Exact match to DS-160 header */}
        <div className="h-[88px] w-full bg-[#003366] border-b-[5px] border-[#002244] flex justify-center relative overflow-hidden">
          {/* Gradient overlay to simulate the shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#003366] to-[#002244] opacity-90"></div>
          
          <div className="w-[980px] h-full flex items-center px-2 relative z-10">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 mt-1">
              {/* Seal */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/U.S._Department_of_State_official_seal.svg/1200px-U.S._Department_of_State_official_seal.svg.png" 
                alt="Department of State Seal"
                className="w-[72px] h-[72px]"
              />
              
              <div className="flex flex-col justify-center h-full pt-2">
                <h1 className="text-white font-serif text-[28px] font-bold tracking-wide leading-none mb-[2px] drop-shadow-md whitespace-nowrap">
                  U.S. DEPARTMENT <span className="text-[22px] font-normal italic">of</span> STATE
                </h1>
                <h2 className="text-white font-sans text-[12px] font-bold tracking-wider uppercase drop-shadow-sm whitespace-nowrap">
                  CONSULAR ELECTRONIC APPLICATION CENTER
                </h2>
              </div>
            </div>

            {/* Right Controls */}
            <div className="absolute right-2 top-3 flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-[11px] font-bold font-sans">Select Tooltip Language</span>
                <select className="h-[20px] text-[11px] border border-[#7F9DB9] bg-[#ECE9D8] text-black px-1 font-sans">
                  <option>ENGLISH</option>
                  <option>ESPAÑOL</option>
                  <option>FRANÇAIS</option>
                  <option>中文</option>
                </select>
              </div>
              {/* Help/FAQ Links inside the blue header */}
              <div className="flex gap-3 text-white text-[11px] font-bold font-sans underline mt-1">
                 <a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Help</a>
                 <a href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application/ds-160-faqs.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">FAQ</a>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;