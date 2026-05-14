import React, { useContext, useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import StepSidebar from './StepSidebar';
import { TaxContext } from '../context/TaxContext';

const STEP_LABELS = {
  '/filing/personal-info': 'Personal Information',
  '/filing/dependents': 'Dependents',
  '/filing/income': 'Income',
  '/filing/deductions': 'Deductions',
  '/filing/credits': 'Credits',
  '/filing/tax-summary': 'Tax Summary',
  '/filing/review': 'Review & Sign',
  '/filing/confirmation': 'Confirmation',
};

const NAV_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'CalFile (Free)', path: '/filing/personal-info' },
      { label: 'Ways to File', path: '/coming-soon/ways-to-file' },
      { label: 'After You File', path: '/coming-soon/after-you-file' },
      { label: 'When to File', path: '/coming-soon/when-to-file' },
    ]
  },
  {
    label: 'Pay',
    items: [
      { label: 'Web Pay', path: '/pay' },
      { label: 'Credit Card', path: '/coming-soon/credit-card' },
      { label: 'Payment Plans', path: '/coming-soon/payment-plans' },
      { label: 'Penalties & Interest', path: '/coming-soon/penalties' },
    ]
  },
  {
    label: 'Refund',
    items: [
      { label: 'Check Refund Status', path: '/refund' },
      { label: 'Refund Help', path: '/coming-soon/refund-help' },
    ]
  },
  {
    label: 'Forms',
    items: [
      { label: 'Search Forms', path: '/forms' },
      { label: '2024 Forms', path: '/coming-soon/2024-forms' },
      { label: 'Publications', path: '/coming-soon/publications' },
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'Contact Us', path: '/help' },
      { label: 'Free Tax Help', path: '/coming-soon/free-tax-help' },
      { label: 'Letters & Notices', path: '/coming-soon/letters-notices' },
      { label: 'Scam Alerts', path: '/coming-soon/scam-alerts' },
    ]
  },
];

function NavDropdown({ menu, location }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleItemClick = (path) => {
    setOpen(false);
    navigate(path + (location.search || ''));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-4 py-3 text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
      >
        {menu.label}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0 bg-white border border-gray-200 shadow-lg rounded-b-sm min-w-48 z-50">
          {menu.items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-ftb-blue hover:text-white transition-colors first:pt-3 last:pb-3"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const taxCtx = useContext(TaxContext);
  const savingIndicator = taxCtx?.savingIndicator || false;
  const isFilingRoute = location.pathname.startsWith('/filing');
  const currentStepLabel = STEP_LABELS[location.pathname];

  return (
    <div className="min-h-screen flex flex-col bg-ftb-light">
      {/* Utility Bar */}
      <div className="bg-ca-gray-100 border-b border-ca-gray-300">
        <div className="max-w-ca mx-auto px-4 py-1.5 flex items-center justify-end gap-4 text-xs text-gray-600">
          <Link to={'/account' + (location.search || '')} className="hover:text-ftb-blue hover:underline font-medium">MyFTB</Link>
          <span className="text-ca-gray-400">|</span>
          <Link to={'/help' + (location.search || '')} className="hover:text-ftb-blue hover:underline">Contact Us</Link>
          <span className="text-ca-gray-400">|</span>
          <Link to={'/coming-soon/translate' + (location.search || '')} className="hover:text-ftb-blue hover:underline">Translate</Link>
          <span className="text-ca-gray-400">|</span>
          <Link to={'/forms' + (location.search || '')} className="hover:text-ftb-blue hover:underline">Search</Link>
        </div>
      </div>

      {/* Brand Bar */}
      <div className="bg-white border-b border-ca-gray-300">
        <div className="max-w-ca mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/ftb-logo.svg" alt="CA FTB" className="h-10 w-10" />
          <div>
            <div className="text-lg font-bold text-ca-gray-800 leading-tight">Franchise Tax Board</div>
            <div className="text-xs text-gray-500">State of California</div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-ftb-blue relative z-40">
        <div className="max-w-ca mx-auto px-4 flex items-center">
          <Link to={'/' + (location.search || '')} className="px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
            CalFile Home
          </Link>
          {NAV_MENUS.map((menu) => (
            <NavDropdown key={menu.label} menu={menu} location={location} />
          ))}
          <div className="ml-auto text-right">
            <span className="text-xs text-blue-200">Tax Year 2024 | Form 540</span>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      {isFilingRoute && currentStepLabel && (
        <div className="bg-white border-b border-ca-gray-300">
          <div className="max-w-ca mx-auto px-4 py-2">
            <nav className="breadcrumb">
              <Link to={'/' + (location.search || '')}>Home</Link>
              <span className="separator">/</span>
              <Link to={'/' + (location.search || '')}>CalFile</Link>
              <span className="separator">/</span>
              <span className="text-gray-800 font-medium">{currentStepLabel}</span>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="max-w-ca mx-auto w-full flex">
          {isFilingRoute && (
            <aside className="w-64 flex-shrink-0">
              <StepSidebar />
            </aside>
          )}
          <main className={`flex-1 ${isFilingRoute ? 'p-6' : ''}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Auto-save Toast */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          transition: 'opacity 0.3s ease-in-out',
          opacity: savingIndicator ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ftb-success flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Saved</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ca-gray-800 text-gray-300">
        <div className="max-w-ca mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Contact FTB</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:800-852-5711" className="hover:text-white hover:underline">General Information: 800-852-5711</a></li>
                <li><a href="tel:800-822-6268" className="hover:text-white hover:underline">Hearing Impaired: 800-822-6268</a></li>
                <li>
                  <Link to={'/help' + (location.search || '')} className="hover:text-white hover:underline">Send us a message</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">About FTB</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={'/coming-soon/about-us' + (location.search || '')} className="hover:text-white hover:underline">About Us</Link></li>
                <li><Link to={'/coming-soon/careers' + (location.search || '')} className="hover:text-white hover:underline">Careers</Link></li>
                <li><Link to={'/coming-soon/newsroom' + (location.search || '')} className="hover:text-white hover:underline">Newsroom</Link></li>
                <li><Link to={'/coming-soon/privacy' + (location.search || '')} className="hover:text-white hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Stay Connected</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={'/coming-soon/e-updates' + (location.search || '')} className="hover:text-white hover:underline">Sign up for e-updates</Link></li>
                <li><Link to={'/coming-soon/social-media' + (location.search || '')} className="hover:text-white hover:underline">Follow us on social media</Link></li>
                <li><Link to={'/coming-soon/accessibility' + (location.search || '')} className="hover:text-white hover:underline">Accessibility</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600">
          <div className="max-w-ca mx-auto px-4 py-3 flex flex-wrap justify-between items-center text-xs text-gray-400">
            <span>Copyright &copy; {new Date().getFullYear()} State of California</span>
            <span>Franchise Tax Board | ftb.ca.gov | Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
