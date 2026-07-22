/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import SaaSModals from './components/SaaSModals';
import ScrollToTop from './components/ScrollToTop';
import MouseGlow from './components/MouseGlow';
import BackgroundParticles from './components/BackgroundParticles';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import SEOManager from './components/SEOManager';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import BusinessGrowthCalculator from './pages/BusinessGrowthCalculator';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Loader2 } from 'lucide-react';
import { analyticsTracker } from './services/analyticsTracker';

function AdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          const sandboxAuth = localStorage.getItem('hds_sandbox_auth');
          if (sandboxAuth === 'active') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/admin/login', { replace: true });
          }
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/admin/login', { replace: true });
        }
      } catch (err) {
        navigate('/admin/login', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-bg-base">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  // Track page views on route change
  useEffect(() => {
    analyticsTracker.trackPageView(location.pathname, document.title || 'Harsh Digital Studios');
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/business-growth-calculator" element={<BusinessGrowthCalculator />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default function App() {
  // Initialize analytics tracker
  useEffect(() => {
    analyticsTracker.init();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <SEOManager />
            <ScrollToTop />
            <MouseGlow />
            <BackgroundParticles />
            <div className="flex flex-col min-h-screen relative z-10">
              <Navbar />
              <main className="flex-grow pt-24">
                <AnimatedRoutes />
              </main>
              <Footer />
              <AIAssistant />
              <SaaSModals />
            </div>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
