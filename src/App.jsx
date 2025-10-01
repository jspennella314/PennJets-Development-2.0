import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './components/pages/Home/Home';
import About from './components/pages/About/About';
import Services from './components/pages/Services/Services';
import AircraftListing from './components/pages/AircraftListing/AircraftListing';
import AircraftDetail from './components/pages/AircraftDetail/AircraftDetail';
import Contact from './components/pages/Contact/Contact';
import Blog from './components/pages/Blog/Blog';
import PennShare from './components/pages/PennShare/PennShare';
import Charter from './components/pages/Charter/Charter';
import PrivacyPolicy from './components/pages/Legal/PrivacyPolicy';
import TermsOfService from './components/pages/Legal/TermsOfService';
import CookiePolicy from './components/pages/Legal/CookiePolicy';
import Compliance from './components/pages/Legal/Compliance';
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/aircraft" element={<AircraftListing />} />
              <Route path="/aircraft/:id" element={<AircraftDetail />} />
              <Route path="/pennshare" element={<PennShare />} />
              <Route path="/charter" element={<Charter />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/compliance" element={<Compliance />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;