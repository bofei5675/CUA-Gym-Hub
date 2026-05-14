import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

const SECTION_CONTENT = {
  'ways-to-file': {
    title: 'Ways to File',
    description: 'California offers several ways to file your state income tax return.',
    items: [
      { heading: 'CalFile (Free)', detail: 'File directly with the FTB for free using this online system. Available to most California residents with simple returns.' },
      { heading: 'Authorized e-file Provider', detail: 'Use a tax preparer or commercial software that is authorized by the FTB to e-file California returns.' },
      { heading: 'Paper Return', detail: 'Download and mail Form 540 to the Franchise Tax Board. Processing takes 3–4 months.' },
      { heading: 'VITA (Free Tax Help)', detail: 'IRS-certified volunteers provide free tax preparation for qualifying individuals. Call 800-906-9887 or visit irs.gov/vita.' },
    ]
  },
  'after-you-file': {
    title: 'After You File',
    description: 'What to expect after submitting your California tax return.',
    items: [
      { heading: 'Confirmation', detail: 'You will receive a confirmation number once your return is accepted by the FTB. Keep this for your records.' },
      { heading: 'Refund Timing', detail: 'E-filed returns with direct deposit: typically 2–3 weeks. Paper checks: 4–6 weeks. Paper returns take 3–4 months.' },
      { heading: 'Balance Due', detail: 'If you owe taxes, payment is due by April 15. Late payments accrue interest and penalties.' },
      { heading: 'Amended Returns', detail: 'To correct a filed return, use Form 540X (Amended Individual Income Tax Return).' },
    ]
  },
  'when-to-file': {
    title: 'When to File',
    description: 'Important filing deadlines for California income taxes.',
    items: [
      { heading: 'Standard Deadline', detail: 'April 15 of the year following the tax year (e.g., April 15, 2025 for tax year 2024).' },
      { heading: 'Automatic Extension', detail: 'California provides an automatic 6-month extension to file (until October 15). However, any taxes owed are still due by April 15.' },
      { heading: 'Estimated Tax Payments', detail: 'If you expect to owe $500 or more, make quarterly estimated payments on April 15, June 15, September 15, and January 15.' },
      { heading: 'Disaster Extensions', detail: 'FTB may grant extended deadlines for taxpayers in federally declared disaster areas. Check ftb.ca.gov for current announcements.' },
    ]
  },
  'credit-card': {
    title: 'Pay by Credit Card',
    description: 'Pay your California tax balance using a credit or debit card.',
    items: [
      { heading: 'Accepted Cards', detail: 'Visa, MasterCard, Discover, and American Express are accepted. A 2.3% service fee is charged by the payment processor.' },
      { heading: 'How to Pay', detail: 'Use the FTB\'s Official Payments service at officialpayments.com or call 800-272-9829. You will need your tax year and SSN.' },
      { heading: 'Confirmation', detail: 'You will receive a confirmation number. Allow 3–5 business days for the payment to post to your account.' },
      { heading: 'Note', detail: 'Credit card payments cannot be processed through CalFile directly. Use Web Pay for electronic bank transfers without a service fee.' },
    ]
  },
  'payment-plans': {
    title: 'Payment Plans (Installment Agreements)',
    description: 'If you cannot pay your full tax balance, you may qualify for an installment agreement.',
    items: [
      { heading: 'Eligibility', detail: 'You must owe $25,000 or less in combined tax, penalties, and interest. Your return must be filed before requesting a payment plan.' },
      { heading: 'How to Apply', detail: 'Log in to MyFTB and select "Request Installment Agreement." You can also call 800-852-5711 or submit FTB Form 3567.' },
      { heading: 'Fees & Interest', detail: 'A $34 setup fee applies ($10 if income is below the poverty level). Interest continues to accrue on any unpaid balance.' },
      { heading: 'Default', detail: 'Missing a payment may result in the agreement being cancelled and immediate collection action.' },
    ]
  },
  'penalties': {
    title: 'Penalties & Interest',
    description: 'FTB penalties and interest rates for late filing and payment.',
    items: [
      { heading: 'Late Filing Penalty', detail: '5% of the unpaid tax for each month (or part of a month) the return is late, up to 25%. Minimum penalty of $135 or 100% of unpaid tax, whichever is less.' },
      { heading: 'Late Payment Penalty', detail: '0.5% per month on the unpaid tax, up to 25%.' },
      { heading: 'Interest Rate', detail: 'Interest is compounded daily. The annual rate is the federal short-term rate plus 3%. For 2025, the rate is approximately 8%.' },
      { heading: 'Avoiding Penalties', detail: 'File and pay on time, even if you cannot pay the full amount. You can request a penalty abatement for reasonable cause.' },
    ]
  },
  'refund-help': {
    title: 'Refund Help',
    description: 'Answers to common refund questions.',
    items: [
      { heading: 'Checking Your Status', detail: 'Use the "Where\'s My Refund?" tool (available from the Refund menu) or call the automated refund line at 800-852-5711.' },
      { heading: 'Timeframes', detail: 'E-filed with direct deposit: 2–3 weeks. E-filed with paper check: 4–6 weeks. Paper filed: 3–4 months.' },
      { heading: 'Delayed Refunds', detail: 'Refunds may be delayed if your return is selected for review, if information does not match FTB records, or if you owe other debts.' },
      { heading: 'Intercepted Refunds', detail: 'FTB may apply your refund to past-due tax debts, court-ordered child support, or other state agency obligations.' },
    ]
  },
  '2024-forms': {
    title: '2024 Tax Forms',
    description: 'Key California tax forms for tax year 2024.',
    items: [
      { heading: 'Form 540', detail: 'California Resident Income Tax Return — the main form for full-year California residents.' },
      { heading: 'Form 540-2EZ', detail: 'Simplified return for taxpayers with straightforward tax situations (wages, pensions, interest, dividends only).' },
      { heading: 'Schedule CA (540)', detail: 'California Adjustments — used to report differences between federal and California income, deductions, and credits.' },
      { heading: 'FTB 3514', detail: 'California Earned Income Tax Credit (CalEITC) — claim this refundable credit if you have low to moderate earned income.' },
    ]
  },
  'publications': {
    title: 'Publications',
    description: 'FTB publications and guides for California taxpayers.',
    items: [
      { heading: 'Publication 1005', detail: 'Pension and Annuity Guidelines — explains California\'s treatment of retirement income from various sources.' },
      { heading: 'Publication 1001', detail: 'Supplemental Guidelines to California Adjustments — detailed guidance on CA-specific income and deduction adjustments.' },
      { heading: 'Publication 1034', detail: 'Franchise Tax Board Privacy Notice — explains how FTB collects and uses taxpayer information.' },
      { heading: 'Publication 3840', detail: 'California Like-Kind Exchanges — guidance on reporting Section 1031 exchanges involving California property.' },
    ]
  },
  'free-tax-help': {
    title: 'Free Tax Help',
    description: 'Free tax preparation services available to qualifying Californians.',
    items: [
      { heading: 'VITA (Volunteer Income Tax Assistance)', detail: 'Free tax preparation for individuals who generally earn $67,000 or less, persons with disabilities, and limited English-speaking taxpayers. Call 800-906-9887.' },
      { heading: 'TCE (Tax Counseling for the Elderly)', detail: 'Free tax help for taxpayers age 60 and older. Specializes in questions about pensions and retirement-related issues. Call 888-227-7669.' },
      { heading: 'CalFile', detail: 'The FTB\'s own free online filing system (this application) — no income limit for CalFile eligibility.' },
      { heading: 'MyFTB', detail: 'Create a free MyFTB account to view your tax records, check refund status, and manage correspondence online at ftb.ca.gov.' },
    ]
  },
  'letters-notices': {
    title: 'Letters & Notices',
    description: 'Understanding notices and letters from the Franchise Tax Board.',
    items: [
      { heading: 'Why Did I Receive a Notice?', detail: 'FTB sends notices when your return is received, when a balance is due, when information does not match federal data, or when you have been selected for review.' },
      { heading: 'Notice of Proposed Assessment (NPA)', detail: 'FTB believes you owe additional taxes. You have 60 days to file a protest. Review carefully and respond promptly.' },
      { heading: 'Demand for Tax Return', detail: 'You have not filed a required return. File immediately or contact FTB to discuss your options.' },
      { heading: 'Responding to Notices', detail: 'Include the notice number and your SSN in all correspondence. Send responses to the address listed on the notice. Keep copies of everything.' },
    ]
  },
  'about-us': {
    title: 'About the Franchise Tax Board',
    description: 'The California Franchise Tax Board (FTB) administers two of California\'s major tax programs.',
    items: [
      { heading: 'Our Mission', detail: 'FTB\'s mission is to provide innovative and cost-effective tax services that fairly and effectively administer California\'s tax programs.' },
      { heading: 'Personal Income Tax', detail: 'FTB administers personal income tax for the approximately 40 million residents of California, collecting over $100 billion in revenue annually.' },
      { heading: 'Corporation Tax', detail: 'FTB administers corporation taxes for over 1 million businesses operating in California.' },
      { heading: 'Headquarters', detail: '9646 Butterfield Way, Sacramento, CA 95827. Established in 1950, FTB has grown to over 5,000 employees statewide.' },
    ]
  },
  'careers': {
    title: 'Careers at FTB',
    description: 'Join the Franchise Tax Board team and make a difference for California taxpayers.',
    items: [
      { heading: 'Available Positions', detail: 'FTB employs accountants, auditors, IT professionals, customer service representatives, legal staff, and administrative personnel.' },
      { heading: 'How to Apply', detail: 'All state positions are listed on CalCareers at calcareers.ca.gov. Create a profile, complete an examination, and apply to open positions.' },
      { heading: 'Benefits', detail: 'State employees receive comprehensive health, dental, and vision benefits, defined benefit pension (CalPERS), 11 paid holidays, and generous paid leave.' },
      { heading: 'Work Locations', detail: 'Most positions are in Sacramento. Additional offices are located in Los Angeles, San Diego, San Francisco, and Fresno.' },
    ]
  },
  'newsroom': {
    title: 'FTB Newsroom',
    description: 'The latest news, announcements, and tax updates from the Franchise Tax Board.',
    items: [
      { heading: 'Tax Filing Deadline Reminder', detail: 'The California income tax filing deadline for tax year 2024 is April 15, 2025. CalFile is open 24/7 for free electronic filing.' },
      { heading: 'CalEITC Expansion', detail: 'The California Earned Income Tax Credit has been expanded for 2024. Taxpayers with incomes up to $30,950 may qualify.' },
      { heading: 'Beware of Tax Scams', detail: 'FTB warns taxpayers to be alert to scammers impersonating FTB representatives. FTB will never demand immediate payment by gift card or wire transfer.' },
      { heading: 'MyFTB Enhancements', detail: 'MyFTB has been updated with improved navigation, faster load times, and new self-service options for managing your account online.' },
    ]
  },
  'privacy': {
    title: 'Privacy Policy',
    description: 'How the Franchise Tax Board collects, uses, and protects your personal information.',
    items: [
      { heading: 'Information We Collect', detail: 'FTB collects information you provide when filing taxes (name, SSN, income, etc.) and technical information from your visit (IP address, browser type).' },
      { heading: 'How We Use Your Information', detail: 'Your information is used to administer California tax laws, verify identity, and detect fraud. We do not sell your personal information.' },
      { heading: 'Information Sharing', detail: 'FTB may share information with other government agencies for tax administration purposes, as required by California law (Revenue and Taxation Code).' },
      { heading: 'Your Rights', detail: 'You have the right to access, correct, and (in some cases) delete your personal information. Contact FTB\'s Privacy Office at 916-845-4543.' },
    ]
  },
  'e-updates': {
    title: 'Sign Up for E-Updates',
    description: 'Stay informed with email updates from the Franchise Tax Board.',
    items: [
      { heading: 'Tax News', detail: 'Receive alerts about changes to California tax law, new credits, updated forms, and important deadlines.' },
      { heading: 'Filing Reminders', detail: 'Get reminders for quarterly estimated tax payment due dates and the annual filing deadline.' },
      { heading: 'FTB Notices', detail: 'Opt in to receive your FTB notices electronically through MyFTB instead of by mail. Faster and more secure.' },
      { heading: 'How to Subscribe', detail: 'Create or log in to your MyFTB account at ftb.ca.gov and navigate to Account Settings > Notification Preferences to manage your subscriptions.' },
    ]
  },
  'social-media': {
    title: 'Follow FTB on Social Media',
    description: 'Connect with the Franchise Tax Board on social media for tax tips and updates.',
    items: [
      { heading: 'Twitter / X', detail: 'Follow @CalFTB for real-time updates, tax tips, deadline reminders, and links to FTB resources. Handle: @CalFTB.' },
      { heading: 'Facebook', detail: 'Like the FTB\'s Facebook page for news, scam alerts, and taxpayer resources. Search "California Franchise Tax Board."' },
      { heading: 'YouTube', detail: 'Watch instructional videos on how to use CalFile, understand your notice, and more at youtube.com/CalFTB.' },
      { heading: 'LinkedIn', detail: 'Follow FTB on LinkedIn for career opportunities and organizational updates.' },
    ]
  },
  'accessibility': {
    title: 'Accessibility',
    description: 'FTB is committed to making our website accessible to all Californians.',
    items: [
      { heading: 'Compliance', detail: 'The FTB website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.' },
      { heading: 'Assistive Technology', detail: 'Our website is designed to work with screen readers, keyboard navigation, and other assistive technologies.' },
      { heading: 'Accessibility Features in CalFile', detail: 'CalFile supports keyboard-only navigation, clear focus indicators, descriptive form labels, and ARIA attributes for screen reader compatibility.' },
      { heading: 'Report an Issue', detail: 'If you encounter an accessibility barrier, contact FTB Accessibility at accessibility@ftb.ca.gov or call 800-852-5711.' },
    ]
  },
  'calfile-help': {
    title: 'CalFile Help Center',
    description: 'Get help using CalFile to file your California income tax return.',
    items: [
      { heading: 'Who Can Use CalFile?', detail: 'CalFile is available to most California residents who filed a California return last year or have a valid California ID. Some restrictions apply for complex returns.' },
      { heading: 'Technical Requirements', detail: 'CalFile works in modern browsers (Chrome, Firefox, Safari, Edge). JavaScript must be enabled. Your session is saved automatically every time you move between steps.' },
      { heading: 'Common Questions', detail: 'Q: Can I save and return later? Yes — CalFile auto-saves your progress. Q: What if I make a mistake? Use the "Edit" buttons to go back to any section before submitting.' },
      { heading: 'Need More Help?', detail: 'Call FTB at 800-852-5711 (Mon–Fri 8 AM–5 PM) or use the "Send a Message" form on the Contact Us page.' },
    ]
  },
  'tax-glossary': {
    title: 'Tax Glossary',
    description: 'Definitions of common California income tax terms.',
    items: [
      { heading: 'Adjusted Gross Income (AGI)', detail: 'Your total gross income minus specific deductions called "above the line" deductions. This is the starting point for calculating your taxable income.' },
      { heading: 'California Earned Income Tax Credit (CalEITC)', detail: 'A refundable state tax credit for low- to moderate-income workers. The amount depends on income and number of qualifying children.' },
      { heading: 'Standard Deduction', detail: 'A fixed dollar amount that reduces your taxable income. For 2024: $5,540 (single/married filing separately) or $11,080 (married filing jointly/head of household).' },
      { heading: 'Withholding', detail: 'Income tax withheld from your wages or other payments during the year. Shown in Box 17 of your W-2 for state income tax withheld.' },
    ]
  },
  'taxpayer-rights': {
    title: 'Taxpayer Rights',
    description: 'Your rights as a California taxpayer when dealing with the Franchise Tax Board.',
    items: [
      { heading: 'Right to Be Informed', detail: 'You have the right to know what you need to do to comply with California tax laws. FTB must explain tax laws and procedures in plain language.' },
      { heading: 'Right to Appeal', detail: 'You have the right to appeal FTB\'s decisions. File a written protest within 60 days of receiving a Notice of Proposed Assessment.' },
      { heading: 'Right to Representation', detail: 'You may be represented by a CPA, attorney, enrolled agent, or other authorized representative in all dealings with FTB.' },
      { heading: 'Taxpayer Advocate', detail: 'If you are experiencing significant hardship due to FTB actions, contact the FTB Taxpayer Advocate at 916-845-4750.' },
    ]
  },
  'translate': {
    title: 'Translate This Page',
    description: 'The California Franchise Tax Board provides translation services for our website.',
    items: [
      { heading: 'Available Languages', detail: 'FTB publications and forms are available in Spanish, Chinese (Traditional and Simplified), Korean, Vietnamese, and Tagalog.' },
      { heading: 'CalFile Language Support', detail: 'CalFile is currently available in English only. For assistance in other languages, call FTB at 800-852-5711 and request an interpreter.' },
      { heading: 'Spanish Publications', detail: 'Formulario 540 en Español and other key publications are available at ftb.ca.gov/forms. Search for "Spanish" to find translated documents.' },
      { heading: 'In-Person Language Assistance', detail: 'Interpreter services are available at FTB offices in Sacramento and Los Angeles. Please call ahead to schedule.' },
    ]
  },
  'scam-alerts': {
    title: 'Scam Alerts',
    description: 'Protect yourself from tax scams and identity theft.',
    items: [
      { heading: 'FTB Will Never...', detail: 'Demand immediate payment by gift card, wire transfer, or cryptocurrency. Threaten to call police for non-payment. Demand payment without opportunity to question or appeal.' },
      { heading: 'Phishing Emails', detail: 'FTB does not initiate contact via email requesting personal or financial information. If you receive such an email, do not click any links. Report it to ftb@ftb.ca.gov.' },
      { heading: 'Phone Scams', detail: 'If you receive a suspicious call claiming to be FTB, hang up and call FTB directly at 800-852-5711 to verify any legitimate notice or balance.' },
      { heading: 'Identity Theft', detail: 'If you believe someone filed a fraudulent return using your identity, call FTB Identity Theft at 916-845-7088 immediately.' },
    ]
  },
};

function ComingSoonPage() {
  const { section } = useParams();
  const location = useLocation();
  const content = SECTION_CONTENT[section];

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Section Not Found</h1>
        <p className="text-gray-500 mb-6">This section could not be found. Please navigate using the menus above.</p>
        <Link
          to={'/' + (location.search || '')}
          className="inline-flex items-center gap-2 px-5 py-2 bg-ftb-blue text-white text-sm font-medium rounded-md hover:bg-ftb-blue-hover transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-2">
        <Link to={'/' + (location.search || '')} className="text-xs text-ftb-blue hover:underline">Home</Link>
        <span className="text-xs text-gray-400 mx-1">/</span>
        <span className="text-xs text-gray-600">{content.title}</span>
      </div>
      <h1 className="text-2xl font-bold text-ftb-blue mb-2">{content.title}</h1>
      <p className="text-sm text-gray-600 mb-6">{content.description}</p>

      <div className="space-y-4">
        {content.items.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-1">{item.heading}</h3>
            <p className="text-sm text-gray-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-3">For more information, contact the Franchise Tax Board:</p>
        <div className="flex flex-wrap gap-4">
          <Link
            to={'/help' + (location.search || '')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-ftb-blue text-white text-sm font-medium rounded-md hover:bg-ftb-blue-hover transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to={'/' + (location.search || '')}
            className="inline-flex items-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonPage;
