import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import RetrieveApplication from './pages/RetrieveApplication';
import ApplicationLayout from './layouts/ApplicationLayout';
import PersonalInfo1 from './pages/PersonalInfo1';
import PersonalInfo2 from './pages/PersonalInfo2';
import AddressPhone from './pages/AddressPhone';
import Passport from './pages/Passport';
import Travel from './pages/Travel';
import TravelCompanions from './pages/TravelCompanions';
import PreviousTravel from './pages/PreviousTravel';
import USContact from './pages/USContact';
import Family from './pages/Family';
import WorkEducation from './pages/WorkEducation';
import Security1 from './pages/Security1';
import Security2 from './pages/Security2';
import Security3 from './pages/Security3';
import Security4 from './pages/Security4';
import Security5 from './pages/Security5';
import Photo from './pages/Photo';
import Review from './pages/Review';
import SignSubmit from './pages/SignSubmit';
import Confirmation from './pages/Confirmation';
import SecurityQuestion from './pages/SecurityQuestion';
import AppIdDisplay from './pages/AppIdDisplay';
import Go from './pages/Go';
import { AppProvider } from './context/AppContext';

function RedirectWithQuery({ to }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  return <Navigate to={query ? `${to}?${query}` : to} replace />;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="ds-container flex flex-col">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/retrieve" element={<RetrieveApplication />} />
              <Route path="/go" element={<Go />} />

              {/* Intermediate steps before main layout */}
              <Route path="/application/security-question" element={
                <div className="p-4 bg-white"><SecurityQuestion /></div>
              } />
              <Route path="/application/id-generation" element={
                <div className="p-4 bg-white"><AppIdDisplay /></div>
              } />

              <Route path="/application" element={<ApplicationLayout />}>
                <Route path="personal1" element={<PersonalInfo1 />} />
                <Route path="personal2" element={<PersonalInfo2 />} />
                <Route path="address" element={<AddressPhone />} />
                <Route path="passport" element={<Passport />} />
                <Route path="travel" element={<Travel />} />
                <Route path="travelCompanions" element={<TravelCompanions />} />
                <Route path="previousTravel" element={<PreviousTravel />} />
                <Route path="usContact" element={<USContact />} />
                <Route path="family" element={<Family />} />
                <Route path="work" element={<WorkEducation />} />
                <Route path="security1" element={<Security1 />} />
                <Route path="security2" element={<Security2 />} />
                <Route path="security3" element={<Security3 />} />
                <Route path="security4" element={<Security4 />} />
                <Route path="security5" element={<Security5 />} />
                <Route path="photo" element={<Photo />} />
                <Route path="review" element={<Review />} />
                <Route path="sign" element={<SignSubmit />} />
                <Route path="confirmation" element={<Confirmation />} />
                {/* Legacy redirect: old /security route -> security1 */}
                <Route path="security" element={<Navigate to="/application/security1" replace />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
