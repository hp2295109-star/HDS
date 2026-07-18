import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Instagram, Linkedin, Facebook, MessageCircle, Mail, Phone, MapPin, Clock, Zap, Smartphone, Cpu, Search, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useSupabaseForm } from '../hooks/useSupabaseForm';
import { supabaseService } from '../services/supabaseService';
import { openSaaSModal } from './SaaSModals';
import { useCMS } from '../hooks/useCMS';
// @ts-ignore
import Logo from '../assets/HDS_logo_embedded.svg';

const SocialIcon = ({ Icon, href, label }: { Icon: any, href: string, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-accent/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-110 transition-all duration-300"
  >
    <Icon className="w-4 h-4" />
  </a>
);

export default function Footer() {
  const { cmsContent } = useCMS();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const currentYear = new Date().getFullYear();

  const {
    values: newsletterValues,
    errors: newsletterErrors,
    isLoading: newsletterIsLoading,
    isSuccess: newsletterIsSuccess,
    isError: newsletterIsError,
    statusMessage: newsletterStatusMessage,
    handleChange: newsletterHandleChange,
    handleSubmit: newsletterHandleSubmit
  } = useSupabaseForm({
    formKey: 'newsletter-footer',
    initialValues: { email: '' },
    validateFields: ['email'],
    submitFn: async (formValues) => {
      return supabaseService.submitNewsletter(formValues);
    }
  });

  return (
    <footer ref={containerRef} className="bg-[#0B0F19] text-white relative overflow-hidden border-t border-accent/20">
      {/* Animated Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent shadow-[0_0_20px_rgba(0,240,255,0.5)]"></div>

      {/* Background Interactive Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Soft Particles */}
        <motion.div animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 7, repeat: Infinity }} className="absolute left-[20%] top-[40%] w-1.5 h-1.5 bg-accent rounded-full blur-[1px]" />
        <motion.div animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 9, repeat: Infinity, delay: 1 }} className="absolute right-[30%] top-[30%] w-2 h-2 bg-secondary rounded-full blur-[2px]" />
        <motion.div animate={{ y: [0, -40, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 11, repeat: Infinity, delay: 2 }} className="absolute left-[60%] top-[80%] w-2.5 h-2.5 bg-white/20 rounded-full blur-[3px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12">
        {/* TOP CTA SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-20 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 tracking-tight">
            Ready to Build Something That <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Actually Grows Your Business?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
            Whether you need a premium website, better SEO, AI automation, or high-converting marketing, Harsh Digital Studios helps businesses build a stronger digital presence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => openSaaSModal('booking', 'General Consultation', 'Footer CTA')}
              className="premium-button w-full sm:w-auto inline-flex items-center justify-center cursor-pointer"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="https://wa.me/917067363208" 
              target="_blank" 
              rel="noopener noreferrer"
              className="premium-button-outline w-full sm:w-auto inline-flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <Link to="/" className="inline-block mb-6">
              <img src={Logo} alt="Harsh Digital Studios" className="h-12 md:h-14 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {cmsContent.footer.description}
            </p>
            <div className="mb-6 max-w-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Subscribe to our newsletter</p>
              {newsletterIsSuccess ? (
                <div className="flex items-center text-green-400 text-xs gap-1.5 py-1 bg-green-500/10 border border-green-500/20 px-3 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={newsletterHandleSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-1.5">
                    <input
                      type="email"
                      name="email"
                      value={newsletterValues.email}
                      onChange={newsletterHandleChange}
                      placeholder="business-owner@gmail.com"
                      disabled={newsletterIsLoading}
                      className={`px-3 py-2 bg-white/5 border rounded-xl text-xs text-white focus:outline-none focus:ring-1 w-full transition-all ${
                        newsletterErrors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent/50 focus:ring-accent/30'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={newsletterIsLoading}
                      className="px-3 py-2 bg-accent text-black font-bold rounded-xl text-xs hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                    >
                      {newsletterIsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-black" /> : 'Join'}
                    </button>
                  </div>
                  {newsletterErrors.email && (
                    <p className="text-[10px] text-red-400 font-medium">{newsletterErrors.email}</p>
                  )}
                  {newsletterIsError && !newsletterErrors.email && (
                    <p className="text-[10px] text-red-400 font-medium">{newsletterStatusMessage}</p>
                  )}
                </form>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <SocialIcon Icon={Instagram} href={cmsContent.socials.instagram || "https://www.instagram.com/harshdigitalstudios"} label="Instagram" />
              <SocialIcon Icon={Linkedin} href={cmsContent.socials.linkedin || "#"} label="LinkedIn" />
              <SocialIcon Icon={Facebook} href={cmsContent.socials.facebook || "#"} label="Facebook" />
              <SocialIcon Icon={MessageCircle} href={cmsContent.socials.whatsapp || "https://wa.me/917067363208"} label="WhatsApp" />
              <SocialIcon Icon={Mail} href={`mailto:${cmsContent.contact.email || "harshpatelyt1060@gmail.com"}`} label="Email" />
            </div>
          </motion.div>

          {/* COLUMN 2: Services */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-heading font-bold mb-6 text-white tracking-wide">Services</h3>
            <ul className="space-y-3">
              {[
                { name: 'Website Development', path: '/services/website-development' },
                { name: 'Landing Pages', path: '/services/landing-pages' },
                { name: 'SEO Optimization', path: '/services/seo' },
                { name: 'Meta Ads', path: '/services/meta-ads' },
                { name: 'Social Media Management', path: '/services/social-media' },
                { name: 'AI Automation', path: '/services/ai-automation' },
                { name: 'Google Business Profile', path: '/services/gmb' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-accent transition-colors text-sm font-medium flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COLUMN 3: Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-heading font-bold mb-6 text-white tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'Services', path: '/services' },
                { name: 'Contact', path: '/contact' },
                { name: 'Growth Calculator', path: '/business-growth-calculator' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms & Conditions', path: '/terms' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COLUMN 4: Let's Connect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-heading font-bold mb-6 text-white tracking-wide">Let's Connect</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${cmsContent.contact.phone || "+917067363208"}`} className="flex items-start text-gray-400 hover:text-white transition-colors text-sm group">
                  <Phone className="w-4 h-4 mr-3 mt-0.5 text-accent group-hover:scale-110 transition-transform" />
                  <span>
                    <span className="block font-medium">Phone</span>
                    <span className="opacity-80">{cmsContent.contact.phone || "+91 70673 63208"}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${cmsContent.contact.email || "harshpatelyt1060@gmail.com"}`} className="flex items-start text-gray-400 hover:text-white transition-colors text-sm group">
                  <Mail className="w-4 h-4 mr-3 mt-0.5 text-accent group-hover:scale-110 transition-transform" />
                  <span>
                    <span className="block font-medium">Email</span>
                    <span className="opacity-80">{cmsContent.contact.email || "harshpatelyt1060@gmail.com"}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-accent" />
                <span>
                  <span className="block font-medium">Location</span>
                  <span className="opacity-80">{cmsContent.contact.address || "India"}</span>
                </span>
              </li>
              <li className="flex items-start text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-3 mt-0.5 text-accent" />
                <span>
                  <span className="block font-medium">Business Hours</span>
                  <span className="block opacity-80">Mon–Sat</span>
                  <span className="block opacity-80">10:00 AM – 7:00 PM</span>
                </span>
              </li>
            </ul>
            
            <div className="mt-6 inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">Usually replies within 30 min</span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          {/* Left */}
          <div className="text-gray-500 text-xs font-medium">
            &copy; {currentYear} Harsh Digital Studios. {cmsContent.footer.rights || "All Rights Reserved."}
          </div>
          
          {/* Center */}
          <div className="text-gray-500 text-xs font-medium flex items-center">
            Designed & Developed with <span className="text-red-500 mx-1">❤️</span> by Harsh Digital Studios.
          </div>

          {/* Right */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Performance', icon: Zap },
              { label: 'Responsive', icon: Smartphone },
              { label: 'AI Powered', icon: Cpu },
              { label: 'SEO Ready', icon: Search }
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                <badge.icon className="w-3 h-3 text-accent" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
