import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import Logo from '../assets/HDS_logo_embedded.svg';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from './LanguageProvider';
import { openSaaSModal } from './SaaSModals';

const links = [
  { name: 'Home', path: '/', key: 'nav.home' },
  { name: 'About', path: '/about', key: 'nav.about' },
  { name: 'Services', path: '/services', key: 'nav.services' },
  { name: 'Pricing', path: '/pricing', key: 'nav.pricing' },
  { name: 'Portfolio', path: '/portfolio', key: 'nav.portfolio' },
  { name: 'Blog', path: '/blog', key: 'nav.blog' },
  { name: 'FAQ', path: '/faq', key: 'nav.faq' },
  { name: 'Contact', path: '/contact', key: 'nav.contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/85 backdrop-blur-md shadow-sm border-b border-white/5 py-2.5' 
          : 'bg-transparent py-4.5'
      }`}
      style={{ willChange: 'padding, background-color' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Harsh Digital Studio" className="h-12 md:h-14 lg:h-15 w-auto object-contain transition-all duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`text-sm font-medium relative py-1.5 transition-colors duration-200 hover:text-accent ${
                    isActive ? 'text-accent' : 'text-white'
                  }`}
                >
                  <span className="relative z-10">{t(link.key, link.name)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right: Language Toggle, Theme Toggle & CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => openSaaSModal('audit', 'Website Audit', 'Navbar Desktop')}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-surface rounded-full hover:bg-white/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-200 group border border-border cursor-pointer active:scale-98"
            >
              {t('nav.audit', 'Book Free Website Audit')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Right: Language Toggle, Theme Toggle & Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button
              className="p-2 text-white hover:text-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-black/95 backdrop-blur-lg border-b border-white/10"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`text-base font-medium px-4 py-2.5 rounded-xl transition-all ${
                    location.pathname === link.path ? 'bg-accent/10 text-accent font-semibold' : 'text-white hover:bg-surface'
                  }`}
                >
                  {t(link.key, link.name)}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
                <button
                  onClick={() => { setIsOpen(false); openSaaSModal('audit', 'Website Audit', 'Navbar Mobile'); }}
                  className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-white bg-surface border border-border rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  {t('nav.audit', 'Book Free Website Audit')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
