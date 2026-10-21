import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './components/pages/Home/Home';
import About from './components/pages/About/About';
import Services from './components/pages/Services/Services';
import AircraftListing from './components/pages/AircraftListing/AircraftListing';
import Contact from './components/pages/Contact/Contact';
import BlogList from './components/pages/Blog/BlogList';
import BlogArticle from './components/pages/Blog/BlogArticle';
import Gallery from './components/pages/Gallery/Gallery';
import PennShare from './components/pages/PennShare/PennShare';
import Charter from './components/pages/Charter/Charter';
import Buy from './components/pages/Buy/Buy';
import Sell from './components/pages/Sell/Sell';
import Consulting from './components/pages/Consulting/Consulting';
import NotFound from './components/pages/NotFound/NotFound';
import PrivacyPolicy from './components/pages/Legal/PrivacyPolicy';
import TermsOfService from './components/pages/Legal/TermsOfService';
import CookiePolicy from './components/pages/Legal/CookiePolicy';
import Compliance from './components/pages/Legal/Compliance';
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop';
import PageMeta from './components/common/PageMeta/PageMeta';
import StickyContactBar from './components/common/StickyContactBar/StickyContactBar';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <PageMeta />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          {/* The sticky bar's measured height (71 px at 390) plus the safe-area
              inset. WO-4.49. */}
          <main className="flex-1 pb-[calc(72px+env(safe-area-inset-bottom))]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              {/* /aircraft is "Recent Inquiries", reached from /buy and the
                  footer; the menu keeps no Aircraft item (WO-4.49). WO-4.52.
                  A listing's own page still sends buyers to Buy until a
                  listing exists (Joseph, 2026-10-20); AircraftDetail stays in
                  src/ for that day. WO-4.49. */}
              <Route path="/aircraft" element={<AircraftListing />} />
              <Route path="/aircraft/:id" element={<Navigate to="/buy" replace />} />
              <Route path="/pennshare" element={<PennShare />} />
              <Route path="/charter" element={<Charter />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <StickyContactBar />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;