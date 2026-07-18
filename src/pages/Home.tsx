import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, Shield, Search, Smartphone, Globe, 
  MessageSquare, Star, ArrowUpRight, Zap, Play, ChevronDown, 
  ChevronUp, BarChart3, HeartHandshake, Eye, RefreshCw, Mail, 
  MapPin, Phone, Award, Layers, Sparkles
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { supabaseService } from '../services/supabaseService';
import { useLanguage } from '../components/LanguageProvider';

// Interfaces
interface ServicePillar {
  id: string;
  title: string;
  category: 'Design' | 'SEO' | 'Marketing' | 'Maintenance';
  price: string;
  desc: string;
  benefits: string[];
}

interface GalleryProject {
  id: string;
  title: string;
  industry: string;
  url: string;
  features: string[];
  desc: string;
  colorClass: string;
  accentColor: string;
  badgeColor: string;
  mockupBg: string;
  icon: string;
  tagline: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  // Leads form state
  const [leadName, setLeadName] = useState('');
  const [leadBusiness, setLeadBusiness] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadService, setLeadService] = useState('Business Website Design');
  const [leadBudget, setLeadBudget] = useState('₹10k - ₹25k');
  const [leadCity, setLeadCity] = useState('Raigarh');
  const [leadMessage, setLeadMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // UI Interactive States
  const [activeServiceTab, setActiveServiceTab] = useState<'all' | 'Design' | 'SEO' | 'Marketing' | 'Maintenance'>('all');
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [liveStatsIndex, setLiveStatsIndex] = useState(0);

  // Live local conversions feed (simulated high-trust proof)
  const localEnquiries = [
    { name: "Suresh S.", business: "Gupta Electronics", location: "Subhash Chowk, Raigarh", time: "2 mins ago", action: "Requested Website Audit" },
    { name: "Dr. Ananya R.", business: "Kelo Dental Clinic", location: "Kelo Vihar, Raigarh", time: "15 mins ago", action: "Booked Strategy Call" },
    { name: "Vikram A.", business: "Rhythm Gym & Fitness", location: "Tamnar", time: "1 hour ago", action: "Inquired about Local SEO" },
    { name: "Pooja Patel", business: "La Belle Unisex Salon", location: "Kharsia", time: "3 hours ago", action: "Requested Custom Demo" },
    { name: "Ramesh M.", business: "Chhattisgarh Minerals", location: "Industrial Area, Raigarh", time: "5 hours ago", action: "Signed up for Maintenance" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStatsIndex((prev) => (prev + 1) % localEnquiries.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 12 Services Matrix (Prominent with detailed prices, benefit bullets)
  const servicePillars: ServicePillar[] = [
    {
      id: "biz-web",
      title: "Business Website Design",
      category: "Design",
      price: "₹15,000+",
      desc: "Premium, ultra-fast business websites styled with high-contrast display typography. Engineered purely in lightweight code to load instantly and hook local B2B/B2C leads.",
      benefits: ["Mobile-first custom layout", "Lighthouse speed index >95", "Domain & Hostinger setup support", "WhatsApp & secure contact forms"]
    },
    {
      id: "landing",
      title: "Landing Page Design",
      category: "Design",
      price: "₹7,000+",
      desc: "High-converting single-screen sales funnels built for maximum conversions. Ideal for targeted advertising campaigns, product launches, or local promotions.",
      benefits: ["Clear psychological CTA path", "Speed-optimized layout assets", "Lead collection database", "Social testimonials grid"]
    },
    {
      id: "redesign",
      title: "Website Redesign",
      category: "Design",
      price: "₹12,000+",
      desc: "Transform outdated, slow WordPress websites or builders into next-generation, high-speed custom code. Retain your current SEO value while boosting performance.",
      benefits: ["Convert builders to pure code", "Eliminate bulky database lag", "Modernized responsive graphics", "Over 80% improvement in load times"]
    },
    {
      id: "seo-adv",
      title: "Search Engine Optimization (SEO)",
      category: "SEO",
      price: "₹8,000/mo+",
      desc: "Comprehensive on-page and technical search engine optimization. Dominate competitive industry keywords and appear right when high-intent buyers search on Google.",
      benefits: ["Semantic schema markup injects", "Speed & performance structural fixes", "High-relevance content creation", "Google Search Console audit"]
    },
    {
      id: "seo-local",
      title: "Local SEO Dominance",
      category: "SEO",
      price: "₹5,000/mo+",
      desc: "Targeted geographical search optimization to rank first in Raigarh, Tamnar, Kharsia, and neighboring regions. Command local queries directly.",
      benefits: ["Geotagged local content nodes", "NAP consistency verification", "Competitor gap blueprint", "Map pack rank tracking reports"]
    },
    {
      id: "gbp-opt",
      title: "Google Business Profile Optimization",
      category: "SEO",
      price: "₹3,000+",
      desc: "Full creation, verification, and technical configuration of your Google Maps listing (GMB). The absolute highest ROI local marketing channel.",
      benefits: ["Primary/Secondary category matching", "Review booster strategy booklet", "EXIF geo-optimized photos", "Spam competitor listing cleaning"]
    },
    {
      id: "meta-ads",
      title: "Meta Ads Campaigns",
      category: "Marketing",
      price: "₹6,000/mo+",
      desc: "Highly-targeted advertising on Facebook and Instagram. Focuses strictly on direct-response lead generation for local gyms, salons, clinics, or real estate.",
      benefits: ["Custom pixel & events tracking", "Lead-generation instant forms", "A/B copywriting experiments", "Weekly ROAS performance metrics"]
    },
    {
      id: "smm",
      title: "Social Media Management",
      category: "Marketing",
      price: "₹8,000/mo+",
      desc: "Build local authority with structured content grids and visual assets. We design high-converting reels concepts, carousel tips, and stories.",
      benefits: ["Consistent custom-branded grids", "Short-form video scripts & editing", "Engagement booster planning", "Canva asset toolkit handover"]
    },
    {
      id: "speed-opt",
      title: "Website Speed Optimization",
      category: "Maintenance",
      price: "₹4,000+",
      desc: "Struggling with slow loading speeds? We strip redundant codes, minify CSS, implement smart lazy loading, and compress heavy images to drop load times under 2 seconds.",
      benefits: ["Core Web Vitals alignment", "Cloudflare CDN configuration", "Image format conversion to WebP", "Caching setup and server tweak"]
    },
    {
      id: "maint",
      title: "Website Maintenance & Support",
      category: "Maintenance",
      price: "₹2,500/mo+",
      desc: "Ensure your digital asset remains online, updated, secure, and fast. Perfect for business owners wanting complete peace of mind.",
      benefits: ["Weekly code & DB backups", "Uptime & security monitoring", "Minor content & pricing updates", "Immediate emergency assistance"]
    },
    {
      id: "site-audit",
      title: "Free Website Audit",
      category: "SEO",
      price: "₹0 (Free)",
      desc: "Get an exhaustive technical audit of your existing website. We analyze your speed, mobile responsiveness, local rankings, schema setup, and provide actionable fixes.",
      benefits: ["Full Lighthouse reports", "Competitor local rank analysis", "UX friction checklist", "20-minute strategy walk-through"]
    },
    {
      id: "analytics",
      title: "Analytics & Reporting",
      category: "Maintenance",
      price: "₹3,000+",
      desc: "Implement advanced conversion monitoring on your website. Learn exactly where your traffic comes from and which buttons drive real cash.",
      benefits: ["Google Analytics 4 configuration", "Google Search Console connection", "Custom event & conversion goals", "Simple live metrics dashboard"]
    }
  ];

  // Dynamic Portfolio Projects State loaded from Supabase / LocalStorage fallback
  const [galleryProjects, setGalleryProjects] = useState<GalleryProject[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await supabaseService.getPortfolioProjects();
        // Filter out hidden ones and sort by display order
        const visible = data
          .filter(p => !p.hidden)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        const mapped = visible.map(p => {
          let ind = p.category;
          if (ind === "Luxury & Jewellery") ind = "Jewellery";
          if (ind === "Beauty & Fitness") ind = "Gym & Fitness";
          if (ind === "Medical & Clinical") ind = "Aesthetic Clinic";
          if (ind === "Fashion & Textile") ind = "Textile & Fashion";
          if (ind === "Creative Portfolio") ind = "Personal Portfolio";

          return {
            id: p.id || 'project-' + Math.random(),
            title: p.title,
            industry: ind,
            url: p.url,
            tagline: p.tagline || (p.description.length > 50 ? p.description.slice(0, 47) + "..." : p.description),
            desc: p.description,
            features: p.features || ["Custom Design", "Mobile Friendly", "WhatsApp Ready"],
            colorClass: p.category.includes("Beauty") ? "from-pink-600/20 via-purple-600/5 to-neutral-950" :
                        p.category.includes("Luxury") ? "from-amber-600/20 via-yellow-600/5 to-neutral-950" :
                        p.category.includes("Clinical") ? "from-emerald-600/20 via-teal-600/5 to-neutral-950" :
                        p.category.includes("Fashion") ? "from-indigo-600/20 via-blue-600/5 to-neutral-950" :
                        "from-cyan-600/20 via-blue-600/5 to-neutral-950",
            accentColor: p.category.includes("Beauty") ? "text-pink-400 border-pink-500/20" :
                        p.category.includes("Luxury") ? "text-amber-400 border-amber-500/20" :
                        p.category.includes("Clinical") ? "text-emerald-400 border-emerald-500/20" :
                        p.category.includes("Fashion") ? "text-indigo-400 border-indigo-500/20" :
                        "text-cyan-400 border-cyan-500/20",
            badgeColor: p.category.includes("Beauty") ? "bg-pink-400/10 text-pink-300 border-pink-400/20" :
                        p.category.includes("Luxury") ? "bg-amber-400/10 text-amber-300 border-amber-400/20" :
                        p.category.includes("Clinical") ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20" :
                        p.category.includes("Fashion") ? "bg-indigo-400/10 text-indigo-300 border-indigo-400/20" :
                        "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
            mockupBg: p.category.includes("Beauty") ? "bg-gradient-to-tr from-pink-950 via-neutral-900 to-purple-900" :
                      p.category.includes("Luxury") ? "bg-gradient-to-tr from-amber-950 via-neutral-900 to-amber-900" :
                      p.category.includes("Clinical") ? "bg-gradient-to-tr from-emerald-950 via-neutral-900 to-teal-900" :
                      p.category.includes("Fashion") ? "bg-gradient-to-tr from-indigo-950 via-neutral-900 to-blue-900" :
                      "bg-gradient-to-tr from-cyan-950 via-neutral-900 to-blue-900",
            icon: p.icon || (p.category.includes("Beauty") ? "✨" :
                             p.category.includes("Luxury") ? "💎" :
                             p.category.includes("Clinical") ? "🩺" :
                             p.category.includes("Fashion") ? "🛍️" : "✈️"),
            thumbnail: p.thumbnail
          };
        });
        setGalleryProjects(mapped);
      } catch (err) {
        console.error('Error loading gallery projects on home page:', err);
      }
    }
    loadProjects();
  }, []);

  // Project Image Mapping fallback for default mockups
  const projectImages: Record<string, string> = {
    jewellers: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    gym: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    travels: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    textile: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    samglanz: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    dental: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    portfolio: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    femina: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    aesthetics: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
  };

  // Pre-fill fields and smooth scroll to contact form
  const handleRequestSimilar = (projectName: string, industry: string) => {
    setLeadMessage(`I want a website similar to the "${projectName}" (${industry}) demo. Please share details on timeline and pricing.`);
    setLeadBusiness(projectName);
    
    // Auto-map service dropdown
    let matchedService = "Business Website Design";
    const lowerIndustry = industry.toLowerCase();
    if (lowerIndustry.includes("gym") || lowerIndustry.includes("fitness") || lowerIndustry.includes("portfolio")) {
      matchedService = "Landing Page Design";
    } else if (lowerIndustry.includes("redesign")) {
      matchedService = "Website Redesign";
    }
    setLeadService(matchedService);

    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQs - 20+ High impact covering all services and details
  const faqs = [
    { q: "Who is Harsh Patel and why should I choose a freelancer over a digital agency?", a: "Harsh Patel is a professional freelance developer, digital marketing specialist, and local business growth consultant based in Raigarh, Chhattisgarh. Holding a Bachelor of Commerce (B.Com) and an MBA in Marketing, Harsh blends technical full-stack code with real-world business psychology. Unlike large agencies that charge hefty overheads and pass your project to junior interns, Harsh works with you directly. You get transparent pricing, direct WhatsApp communication, faster launch speeds, and 1-on-1 accountability." },
    { q: "Which areas in Chhattisgarh do you specialize in serving?", a: "While we design for clients nationwide, we offer highly optimized local SEO and website development solutions specifically tailored for local business owners in Raigarh, Tamnar, Kharsia, Gharghoda, Sarangarh, and surrounding industrial zones. We understand local customer search psychology, the local competitor landscapes, and geographical ranking strategies in Chhattisgarh." },
    { q: "How much does a basic business website cost?", a: "Our premium landing pages and single-page sales funnels start at ₹7,000. Full multi-page business websites with complete Local SEO and WhatsApp lead automation typically range from ₹15,000 to ₹35,000 depending on features, copy length, and integrations. We provide flat upfront quotes with absolutely zero hidden annual charges." },
    { q: "Do you build on WordPress, or do you write custom code?", a: "We specialize in writing high-performance, custom-coded websites (using React, HTML5, Vite, Tailwind CSS) because custom code loads up to 10x faster than bloated WordPress sites, has zero vulnerable database plugins, and provides far superior SEO rankings. However, if you explicitly require a WordPress site for easy blog editing, we can build custom, speed-optimized Elementor or Gutenberg sites." },
    { q: "How long does it take to design and launch a business website?", a: "A single-page landing page is typically designed and launched in 4 to 7 days. A comprehensive multi-page business website takes between 2 to 4 weeks, depending on content availability, design reviews, and customized form requirements." },
    { q: "Will my website rank #1 on Google for my local keywords?", a: "We build every single website with proper SEO hygiene—including clean semantic HTML tags, Google Search Console linkage, correct robots.txt, fast load speeds, and local schema markups. While nobody can 'guarantee' a permanent #1 Google rank overnight, combining our Local SEO services with Google Business Profile optimization typically gets local businesses into the high-converting Google Maps 'Top 3 Pack' within 60 to 90 days." },
    { q: "What is Google Business Profile (GBP) optimization and why do I need it?", a: "Google Business Profile (formerly Google My Business) is the free map listing that appears when customers search for local terms (e.g., 'best dental clinic in Raigarh'). Optimizing this listing with geotagged photos, proper category matching, name-cleaning, and direct reviews ensures your business shows up on top of Google Maps, driving high-intent phone calls and store visits daily." },
    { q: "How do your Meta Ads services generate leads for local businesses?", a: "We set up professional Facebook and Instagram ad campaigns targeted strictly at users in Raigarh, Tamnar, or Kharsia. Instead of clicking 'boost post' (which wastes ad budget on likes), we create custom lead-capture forms, eye-catching visual creatives, and compelling offers (like 'Get 20% off on your first salon visit') that deliver actual names, phone numbers, and requirements directly to your CRM." },
    { q: "Do you provide web domain names and hosting?", a: "We help you select, secure, and set up your personal domain name (e.g., yourbusiness.com) and purchase highly reliable, fast local cloud hosting (such as Hostinger or Cloudflare). All assets are registered under your own name, ensuring you have 100% full ownership of your digital property." },
    { q: "Is a custom website secure against hacking and virus issues?", a: "Yes. Bloated plugins make platforms like WordPress major targets for local hackers. Because we write lightweight custom frontend code and utilize secure, cloud-hosted backends (like Supabase or Google Cloud), your website is virtually unhackable, requiring zero regular anti-virus overheads." },
    { q: "Can we track how many customers actually visit the website?", a: "Absolutely. We link every project with Google Analytics 4 (GA4) and Google Search Console. You will get access to a simplified, live dashboard showing exactly how many people visited your site, which city they came from, and which buttons (like 'WhatsApp Chat' or 'Call Now') they clicked." },
    { q: "Can you redesign my existing slow website?", a: "Yes. Many of our clients come to us with slow, outdated websites that load in 8+ seconds and fail to bring in any business. We rebuild these sluggish platforms from scratch into premium, responsive, under-2-seconds masterpieces while carefully redirecting your old links to preserve all existing Google rankings." },
    { q: "What happens after the website is launched? Do you offer support?", a: "We don't just launch and disappear. We provide ongoing Website Maintenance packages starting from ₹2,500/mo. This covers weekly secure backups, uptime monitoring, minor text/price updates, and emergency recovery so you can focus entirely on running your physical business." },
    { q: "How can I start? What is the booking process?", a: "It's extremely simple. You can fill out our embedded Lead Capture Form below, or click 'Chat on WhatsApp' to message Harsh Patel directly. We will schedule a free 20-minute digital strategy consultation, audit your existing online presence, show you custom wireframe mockups, and draw a 90-day action plan for your business." }
  ];

  // Handle Form Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      setSubmitError('Full Name and Phone Number are required to initiate lead routing.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        name: leadName,
        email: leadEmail || 'no-email@hds.local',
        phone: leadPhone,
        business_name: leadBusiness || 'Local Proprietor',
        service: leadService,
        budget: leadBudget,
        message: leadMessage || `Prospect located in ${leadCity}. Inquired from HDS Home CRM Lead form.`,
        status: 'New' as const,
        city: leadCity,
        notes: ''
      };

      const success = await supabaseService.submitLead(payload);
      if (success) {
        setSubmitSuccess(true);
        // Clear forms
        setLeadName('');
        setLeadBusiness('');
        setLeadPhone('');
        setLeadEmail('');
        setLeadMessage('');
      } else {
        setSubmitError('Failed to connect to the CRM database. Please try connecting via direct WhatsApp!');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('An unexpected server error occurred during lead capture.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      {/* 1. HERO SECTION WITH TARGET PROOF & LIVE FEED */}
      <section className="relative pt-8 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-[-10%] left-[10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/[0.04] border border-white/5 px-3 py-1.5 rounded-full text-xs text-gray-400 font-mono">
                <Award className="w-4 h-4 text-accent" />
                <span>{t('hero.badge', 'MBA Marketer & Professional Web Designer')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.1]">
                {t('hero.title.line1', 'Stop Posting.')}<br />
                <span className="bg-gradient-to-r from-[#00F0FF] to-secondary bg-clip-text text-transparent">
                  {t('hero.title.line2', 'Start Building Your Local Brand.')}
                </span>
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {t('hero.subtitle', 'I help business owners in Raigarh, Tamnar, and Kharsia double their customer bookings with premium website designs, local Google Maps ranking, and high-impact search strategies. Zero agency bloat. Pure results.')}
              </p>

              {/* Trust highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-accent text-xl font-bold font-mono">100%</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{language === 'hi' ? 'स्पीड इंडेक्स' : 'Speed Index'}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-secondary text-xl font-bold font-mono">2.4x</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{language === 'hi' ? 'लीड मल्टीप्लायर' : 'Lead Multiplier'}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-[#0080FF] text-xl font-bold font-mono">1-on-1</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{language === 'hi' ? 'सीधी जवाबदेही' : 'Direct Accountability'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                <a 
                  href="#contact-form" 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all text-center cursor-pointer shadow-lg shadow-accent/10"
                >
                  {t('hero.cta.bookCall', 'Book Free Strategy Call')}
                </a>
                <Link 
                  to="/portfolio" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
                >
                  {t('hero.cta.exploreDemos', 'Explore Demo Designs')}
                </Link>
              </div>
            </div>

            {/* Right Column Bento Box Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              {/* Card 1: Speed Meter */}
              <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full blur-xl" />
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">Core Web Vitals</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white font-mono">99+</div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Lighthouse Score</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Lightweight clean code beats heavy templates.</p>
                </div>
              </div>

              {/* Card 2: Local Map Focus */}
              <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/5 rounded-full blur-xl" />
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#00F0FF] uppercase tracking-widest">Maps pack</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white font-mono">#1 Pack</div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Local Map Domination</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Be the answer when clients search "near me".</p>
                </div>
              </div>

              {/* Card 3: Credibility Story Badge */}
              <div className="col-span-2 bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ABOUT THE FREELANCER</div>
                  <h4 className="text-base font-bold text-white mt-1">Harsh Patel, MBA Marketing</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[280px]">Combining deep strategic consumer psychology with clean, performance-optimized code files.</p>
                </div>
                <div className="w-16 h-16 bg-accent/15 border border-accent/20 rounded-2xl flex items-center justify-center text-accent text-lg font-bold shrink-0 shadow-sm">
                  HP
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE 12 PILLARS - INTERACTIVE SERVICES HUB */}
      <section className="py-24 relative" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Our Mastery Suite</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
              12 High-Performance Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-base">
              Tailored growth services engineered to build digital credibility, rank on Google, generate verified leads, and maintain site health.
            </p>
          </div>

          {/* Interactive Tags Selector */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2 scrollbar-none gap-2">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'Design', label: 'Custom Design' },
              { id: 'SEO', label: 'Search Optimization' },
              { id: 'Marketing', label: 'Direct Lead Gen' },
              { id: 'Maintenance', label: 'Speed & Uptime' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveServiceTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                  activeServiceTab === tab.id 
                    ? 'bg-accent text-black border-accent font-extrabold shadow-md shadow-accent/10' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Services Grid (3 Columns Desktop, 1 Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicePillars
              .filter(s => activeServiceTab === 'all' || s.category === activeServiceTab)
              .map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-accent/40 hover:bg-white/[0.02] transition-all duration-300"
                >
                  <div>
                    {/* Header: Title & Starting Price */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-white/5 px-2.5 py-1 rounded-md">
                        {service.category}
                      </span>
                      <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {service.price}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Benefit Bullets */}
                    <ul className="space-y-2 mt-6 pt-5 border-t border-white/5">
                      {service.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="text-[11px] text-gray-300 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent mr-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Immediate CTA inside Card */}
                  <div className="mt-8">
                    <a
                      href={`https://wa.me/917067363208?text=Hello%20Harsh%20Digital%20Studios%2C%20I%20want%20to%20discuss%20your%20service%3A%20${encodeURIComponent(service.title)}%20for%20my%20business%21`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-white/5 hover:bg-accent hover:text-black border border-white/5 text-[11px] text-gray-300 font-bold uppercase rounded-xl transition-all"
                    >
                      <span>Inquire Now</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
          </div>

        </div>
      </section>

      {/* 3. WEBSITE DESIGN GALLERY */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="demo-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-accent/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{language === 'hi' ? 'वेबसाइट डिज़ाइन गैलरी' : 'Website Design Gallery'}</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
              {language === 'hi' ? 'वेबसाइट डिज़ाइन गैलरी' : 'Website Design Gallery'}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm md:text-base leading-relaxed">
              Explore real website demos I've designed for different industries. Click any project to experience the live website.
            </p>
          </div>

          {/* Industry Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {["All", "Luxury & Jewellery", "Beauty & Fitness", "Medical & Clinical", "Fashion & Textile", "Creative Portfolio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setGalleryFilter(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  galleryFilter === tab
                    ? "bg-accent text-black border-accent"
                    : "bg-btn-bg text-text-secondary border-btn-border hover:bg-btn-hover-bg hover:text-text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Featured Project at the Top */}
          {(() => {
            if (galleryFilter !== "All" && galleryFilter !== "Luxury & Jewellery") return null;
            const featured = galleryProjects[0];
            if (!featured) return null;
            return (
              <div className="mb-16">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
                  <span>Featured Masterpiece</span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card-bg border border-card-border rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl hover:border-accent/30 hover:shadow-[0_0_50px_rgba(0,240,255,0.06)] transition-all duration-500 group"
                >
                  {/* Left: Beautiful Mockup with actual image */}
                  <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] overflow-hidden flex flex-col justify-between">
                    <img
                      src={(featured as any).thumbnail || projectImages[featured.id]}
                      alt={`${featured.title} Mockup`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 flex flex-col justify-between p-6 md:p-8" />
                    
                    {/* Browser Mockup Bar on top of image */}
                    <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/50 block"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500/50 block"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500/50 block"></span>
                      </div>
                      <div className="text-[10px] bg-black/60 text-amber-300 font-mono px-4 py-1.5 rounded-full max-w-[240px] sm:max-w-[320px] truncate border border-amber-500/20 shadow-inner">
                        {featured.url.replace("https://", "")}
                      </div>
                      <div className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                        100/100 SPEED
                      </div>
                    </div>

                    {/* Mock Landing Page Body */}
                    <div className="relative z-10 flex-grow flex flex-col justify-center py-8">
                      <div className="max-w-md bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl">
                        <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono text-[10px] uppercase tracking-widest rounded-full font-bold">
                          💎 {featured.tagline.toUpperCase()}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-50 mt-4 tracking-tight leading-tight">
                          Elevating Luxury Retail & Jewellery brands.
                        </h3>
                        <p className="text-neutral-300 text-xs sm:text-sm mt-3 leading-relaxed">
                          A curated digital showroom featuring high-res collection catalogs, real-time gold rates, and automatic WhatsApp inquiries.
                        </p>
                      </div>
                    </div>

                    {/* Bottom mock ribbon */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-3 text-[10px] text-neutral-300 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>LIVE GOLD RATE: ₹7,250/g (24K)</span>
                      </div>
                      <span>SECURE WHATSAPP DESK READY</span>
                    </div>
                  </div>

                  {/* Right: Info Area */}
                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[9px] uppercase tracking-widest rounded-full">
                          Featured Demo
                        </span>
                        <span className="px-2.5 py-1 bg-btn-bg border border-btn-border text-text-secondary font-mono text-[9px] uppercase tracking-widest rounded-full">
                          Portfolio Project
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-heading tracking-tight mb-2">
                        {featured.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono mb-4 text-accent">
                        Industry: {featured.industry}
                      </p>
                      
                      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                        {featured.desc}
                      </p>

                      <div className="space-y-3 pt-4 border-t border-card-border mb-8">
                        <h4 className="text-[10px] uppercase font-bold text-text-tertiary tracking-widest mb-1">Key Conversion Highlights:</h4>
                        {featured.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start text-xs text-text-secondary">
                            <CheckCircle2 className="w-4 h-4 text-accent mr-2 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-4 bg-accent hover:bg-accent/90 text-black text-center text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <span>View Live Demo</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleRequestSimilar(featured.title, featured.industry)}
                        className="flex-1 py-4 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-btn-text text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center cursor-pointer"
                      >
                        Request Similar Website
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* Grid of Projects */}
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
              <span>{galleryFilter === "All" ? "All Website Demos" : `${galleryFilter} Projects`}</span>
              <span className="h-px bg-white/10 flex-grow"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryProjects
                .filter(project => {
                  if (galleryFilter === "All") {
                    return project.id !== "jewellers";
                  }
                  const ind = project.industry.toLowerCase();
                  if (galleryFilter === "Luxury & Jewellery") {
                    return ind.includes("jewel") || ind.includes("luxury");
                  }
                  if (galleryFilter === "Beauty & Fitness") {
                    return ind.includes("gym") || ind.includes("fitness") || ind.includes("salon") || ind.includes("beauty");
                  }
                  if (galleryFilter === "Medical & Clinical") {
                    return ind.includes("clinic") || ind.includes("dental") || ind.includes("aesthetic");
                  }
                  if (galleryFilter === "Fashion & Textile") {
                    return ind.includes("fashion") || ind.includes("textile") || ind.includes("apparel");
                  }
                  if (galleryFilter === "Creative Portfolio") {
                    return ind.includes("portfolio") || ind.includes("personal") || ind.includes("travel");
                  }
                  return true;
                })
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
                    className="bg-card-bg border border-card-border rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-accent/30 hover:shadow-[0_15px_30px_rgba(0,240,255,0.03)] transition-all duration-300 group"
                  >
                    {/* Card Thumbnail Area */}
                    <div className="relative overflow-hidden aspect-[16:10] w-full border-b border-card-border">
                      <img
                        src={(project as any).thumbnail || projectImages[project.id]}
                        alt={`${project.title} Mockup`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Browser Mockup Header overlaying the image */}
                      <div className="absolute top-0 inset-x-0 bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-red-500/50 block"></span>
                          <span className="w-2 h-2 rounded-full bg-yellow-500/50 block"></span>
                          <span className="w-2 h-2 rounded-full bg-green-500/50 block"></span>
                        </div>
                        <div className="text-[9px] text-neutral-200 font-mono px-3 py-0.5 rounded-full max-w-[140px] truncate bg-black/40 border border-white/5">
                          {project.url.replace("https://", "")}
                        </div>
                        <span className="text-[8px] text-emerald-400 font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30">100/100</span>
                      </div>
 
                      {/* Gradient Overlay for Title/Icon over image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="inline-flex items-center text-[8px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 border border-accent/25 px-2.5 py-0.5 rounded-full mb-1">
                              {project.industry}
                            </span>
                            <h4 className="text-base font-extrabold text-neutral-50 font-heading tracking-tight leading-tight group-hover:text-accent transition-colors">
                              {project.title}
                            </h4>
                          </div>
                          <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            {project.icon}
                          </span>
                        </div>
                      </div>
                    </div>
 
                    {/* Card Content Area */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono text-text-tertiary">Tagline: {project.tagline}</span>
                          <span className="px-2 py-0.5 bg-btn-bg border border-btn-border text-[9px] font-mono text-text-tertiary rounded-full shrink-0">
                            Portfolio Project
                          </span>
                        </div>
                        
                        <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-3">
                          {project.desc}
                        </p>
 
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.features.slice(0, 2).map((feat, fIdx) => (
                            <span key={fIdx} className="text-[9px] text-text-tertiary bg-btn-bg px-2.5 py-1 rounded-md border border-btn-border">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
 
                      <div className="space-y-2.5">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-btn-text text-center text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>View Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                        </a>
                        <button
                          onClick={() => handleRequestSimilar(project.title, project.industry)}
                          className="w-full py-3 bg-accent/10 hover:bg-accent hover:text-black border border-accent/20 hover:border-accent text-accent text-center text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Request Similar Website
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Direct WhatsApp Prompt */}
          <div className="mt-16 text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              <span>Explore All Demo Designs / View More</span>
              <ArrowUpRight className="w-4 h-4 text-accent" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE HARSH PATEL - TRUST & TOOL MASTERY */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="about-credentials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story column */}
            <div className="space-y-6">
              <span className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <span>The Brain Behind HDS</span>
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
                Harsh Patel<br />
                <span className="text-gray-400">B.Com, MBA Marketing Expert</span>
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed font-sans">
                Many developers know how to write code, but very few understand how local buyers think. With a Bachelor of Commerce (B.Com) and an MBA in Marketing, I don't just build sites that look visually clean—I engineer high-converting digital pipelines designed to build deep consumer trust and generate active inbound phone calls.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0 mt-1">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Certified Digital Marketer</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Specialized in Search Engine Optimization, local GBP, and consumer action optimization in local B2C markets.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shrink-0 mt-1">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full-Stack Freelancer Independence</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Zero massive corporate overheads, zero telephone games with lazy middlemen. You deal directly with the coder and strategist.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Mastery Grid */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[32px] p-8">
              <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider font-mono">Core Tool Mastery</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "Google Search Console", level: "Expert", desc: "Rank tracking & schemas" },
                  { name: "Google Analytics 4", level: "Expert", desc: "User action logging" },
                  { name: "GBP Optimization", level: "Expert", desc: "Maps pack ranks" },
                  { name: "Meta Business Suite", level: "Expert", desc: "Direct response ads" },
                  { name: "Canva Pro", level: "Pro", desc: "Aesthetic branding" },
                  { name: "GitHub", level: "Pro", desc: "Secure deployment" },
                  { name: "Cloudflare CDN", level: "Expert", desc: "Global speed index" },
                  { name: "Hostinger Panel", level: "Pro", desc: "Reliable cloud servers" },
                  { name: "Supabase Backend", level: "Pro", desc: "Secure CRM databases" }
                ].map((tool, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{tool.name}</div>
                      <p className="text-[10px] text-gray-500 mt-1">{tool.desc}</p>
                    </div>
                    <div className="mt-3 text-[10px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded self-start">
                      {tool.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. HOW WE WORK - THE WEBSITE PROCESS */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Our Blueprint</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
              Our 4-Step Launch Process
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-base">
              From raw concept to front-page organic Google rankings, here is how we work with local Chhattisgarh businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery & Strategy Plan", desc: "We analyze your top local competitors, audit your current brand presence, find local keyword gaps, and design a transparent project roadmap." },
              { step: "02", title: "Premium Visual UI Design", desc: "We build custom, modern page layouts. No boring templates. We craft tailored, brand-specific aesthetics, typography pairings, and clean assets." },
              { step: "03", title: "High-Speed & SEO Build", desc: "We write clean, lightweight code. We optimize Web Vitals, write semantic tags, configure schemas, and link Search Console dashboards." },
              { step: "04", title: "Launch, Training & Handover", desc: "We deploy the site to fast cloud servers, optimize your Google Maps listing, set up analytics, and hand over simple Canva/admin control panels." }
            ].map((proc, pIdx) => (
              <div key={pIdx} className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 relative group">
                <span className="text-4xl font-extrabold font-mono text-accent/25 group-hover:text-accent transition-colors block mb-4">{proc.step}</span>
                <h3 className="text-base font-bold text-white mb-2">{proc.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{proc.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. WORK IN PROGRESS - BUILDING SUCCESS STORIES */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="testimonials">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Building Success Stories</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
              Work in Progress
            </h2>
          </div>

          <div className="bg-white/[0.01] border border-white/5 text-center p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-secondary"></div>
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-medium">
              "I'm currently helping local businesses build their online presence. As I complete more client projects, genuine testimonials and case studies will be added here."
            </p>
            <p className="text-xs text-gray-500 mt-6 font-mono uppercase tracking-wider">
              100% Honest & Transparent • No Fake Social Proof
            </p>
            
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="#contact-form"
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-accent text-white font-bold text-xs rounded-xl transition-all"
              >
                Be My First Success Story
              </a>
              <a
                href="https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20let's%20discuss%20a%20project%20for%20my%20business%21"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-white font-bold text-xs rounded-xl hover:bg-opacity-90 transition-all inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Let's Connect</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SECURE LEAD CAPTURE - THE CONVERSION HEART */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="contact-form">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-card-bg border border-card-border rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-[0_0_80px_rgba(0,240,255,0.05)]">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/5 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="inline-flex items-center space-x-1.5 bg-accent/15 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फ्री डिजिटल ग्रोथ ऑडिट' : 'Free Digital Growth Audit'}</span>
              </span>
              <h2 className="text-2xl md:text-4xl font-bold font-heading text-text-primary">
                {language === 'hi' ? 'आइए आपके स्थानीय व्यवसाय को बढ़ाएं' : "Let's Fuel Your Local Business"}
              </h2>
              <p className="text-text-secondary text-xs md:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'नीचे दिए गए सुरक्षित फॉर्म को भरें। हर्ष पटेल व्यक्तिगत रूप से आपकी ऑनलाइन उपस्थिति का विश्लेषण करेंगे और आपको 90 दिनों का विस्तार ब्लूप्रिंट व्हाट्सएप/कॉल पर साझा करेंगे।'
                  : 'Fill out our secure CRM form below. Harsh Patel will manually analyze your online presence and call/WhatsApp you with a tailored 90-day expansion blueprint.'}
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {language === 'hi' ? 'लीड सुरक्षित रूप से सिंक हुई!' : 'Lead Securely Routed!'}
                </h3>
                <p className="text-xs text-text-secondary mt-2">
                  {language === 'hi'
                    ? 'धन्यवाद! आपकी आवश्यकताएं HDS CRM के साथ सिंक हो गई हैं। हर्ष पटेल 2 घंटे के भीतर व्हाट्सएप के माध्यम से आपसे संपर्क करेंगे।'
                    : 'Thank you! Your requirements have been synchronized with the HDS CRM. Harsh Patel will contact you via WhatsApp within 2 hours.'}
                </p>
                
                <a
                  href={`https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20I%20just%20submitted%20the%20CRM%20form%20for%20my%20business%2E%20Let's%20discuss%20my%20digital%20growth%21`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-opacity-90 text-white font-bold text-xs rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{language === 'hi' ? 'व्हाट्सएप पर तुरंत चैट करें' : 'Speed up on WhatsApp'}</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start text-red-400 text-xs">
                    <Shield className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'पूरा नाम / मालिक' : 'Full Name / Owner'}
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder={language === 'hi' ? 'जैसे: हर्ष पटेल' : 'e.g. Harsh Patel'}
                      className="w-full px-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'व्यवसाय का नाम' : 'Business Name'}
                    </label>
                    <input
                      type="text"
                      value={leadBusiness}
                      onChange={(e) => setLeadBusiness(e.target.value)}
                      placeholder={language === 'hi' ? 'जैसे: अपैक्स जिम एंड फिटनेस' : 'e.g. Apex Gym & Fitness'}
                      className="w-full px-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'फ़ोन नंबर (व्हाट्सएप)' : 'Phone Number (WhatsApp)'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="e.g. +91 70673 63208"
                      className="w-full px-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full px-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'आवश्यक सेवा' : 'Required Service'}
                    </label>
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      className="w-full px-4 py-3 bg-card-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="Business Website Design" className="bg-card-bg text-text-primary">Business Website Design</option>
                      <option value="Landing Page Design" className="bg-card-bg text-text-primary">Landing Page Design</option>
                      <option value="Website Redesign" className="bg-card-bg text-text-primary">Website Redesign</option>
                      <option value="Search Engine Optimization (SEO)" className="bg-card-bg text-text-primary">Search Engine Optimization (SEO)</option>
                      <option value="Local SEO" className="bg-card-bg text-text-primary">Local SEO</option>
                      <option value="Google Business Profile Optimization" className="bg-card-bg text-text-primary">Google Business Profile (GBP)</option>
                      <option value="Meta Ads" className="bg-card-bg text-text-primary">Meta Ads Campaigns</option>
                      <option value="Website Speed Optimization" className="bg-card-bg text-text-primary">Speed Optimization</option>
                      <option value="Free Website Audit" className="bg-card-bg text-text-primary">Free Website Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'अनुमानित बजट' : 'Estimated Budget'}
                    </label>
                    <select
                      value={leadBudget}
                      onChange={(e) => setLeadBudget(e.target.value)}
                      className="w-full px-4 py-3 bg-card-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="Under ₹10k" className="bg-card-bg text-text-primary">Under ₹10k</option>
                      <option value="₹10k - ₹25k" className="bg-card-bg text-text-primary">₹10k - ₹25k</option>
                      <option value="₹25k - ₹50k" className="bg-card-bg text-text-primary">₹25k - ₹50k</option>
                      <option value="Above ₹50k" className="bg-card-bg text-text-primary">Above ₹50k</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                      {language === 'hi' ? 'लक्ष्य शहर / क्षेत्र' : 'Target Market / City'}
                    </label>
                    <select
                      value={leadCity}
                      onChange={(e) => setLeadCity(e.target.value)}
                      className="w-full px-4 py-3 bg-card-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="Raigarh" className="bg-card-bg text-text-primary">Raigarh</option>
                      <option value="Tamnar" className="bg-card-bg text-text-primary">Tamnar</option>
                      <option value="Kharsia" className="bg-card-bg text-text-primary">Kharsia</option>
                      <option value="Other Chhattisgarh" className="bg-card-bg text-text-primary">Other Chhattisgarh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                    {language === 'hi' ? 'अतिरिक्त आवश्यकताएं / संदेश' : 'Specific Requirements / Target Competitor'}
                  </label>
                  <textarea
                    rows={4}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder={language === 'hi' ? 'संक्षेप में हमें बताएं कि आपका व्यवसाय क्या है या शीर्ष प्रतिद्वंद्वी की वेबसाइट का लिंक दें...' : "Briefly tell us what you do or link your top competitor's website..."}
                    className="w-full px-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent resize-none placeholder:text-text-tertiary"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-card-border">
                  <div className="flex items-center space-x-2 text-[10px] text-text-tertiary">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>
                      {language === 'hi' ? 'सुरक्षित एन्क्रिप्शन सक्षम है। आपकी जानकारी गोपनीय रहेगी।' : 'Secure encryption enabled. Your info is never sold.'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{language === 'hi' ? 'सिंक किया जा रहा है...' : 'Synchronizing Lead...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'hi' ? 'पूछताछ भेजें' : 'Submit Growth Inquiry'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* 8. DYNAMIC INSIGHTS / LATEST BLOG PREVIEWS */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="insights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
            <div>
              <span className="inline-flex items-center space-x-1.5 bg-[#00F0FF]/10 text-[#00F0FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <span>Free Knowledge</span>
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
                Latest Growth Insights
              </h2>
              <p className="text-gray-400 mt-2 max-w-xl text-sm">
                Practical, actionable advice written specifically for local Chhattisgarh business owners on web design and SEO.
              </p>
            </div>

            <Link
              to="/blog"
              className="text-accent text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore All Insights</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: "raigarh-local-business-website-2026",
                title: "Why Every Local Business in Raigarh Needs a Professional Website in 2026",
                tag: "Web Design",
                time: "12 min read",
                desc: "Explore how a premium, SEO-optimized business website drives high-intent client inquiries 24/7. Stop renting social spaces and secure your brand."
              },
              {
                id: "google-business-profile-optimization-guide-2026",
                title: "Google Business Profile Optimization: Complete Maps Dominance Blueprint",
                tag: "Local SEO & GBP",
                time: "14 min read",
                desc: "Discover how to optimize your Google Business Profile to rank #1 on Google Maps, generate direct calls, and attract local showroom traffic."
              },
              {
                id: "website-vs-instagram-for-local-business-2026",
                title: "Website vs Instagram: Which One Actually Brings More Customers?",
                tag: "Marketing Strategy",
                time: "11 min read",
                desc: "Compare organic social feeds with custom website funnels. Learn why high-intent Google search traffic delivers far better conversions."
              }
            ].map(art => (
              <div key={art.id} className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-accent/30 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-widest">{art.tag}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{art.time}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{art.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6">{art.desc}</p>
                </div>

                <Link
                  to="/blog"
                  className="text-accent text-xs font-bold hover:underline inline-flex items-center gap-1 self-start"
                >
                  <span>Read Guide</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. 20+ HIGH-IMPACT LOCAL SEO FAQ SECTION */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="faqs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>SEO Answer Engine</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Answering everything about domain ownership, local rankings, pricing structures, and website maintenance.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isExpanded = expandedFaqId === index;
              return (
                <div 
                  key={index} 
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm font-bold text-white leading-snug">{faq.q}</span>
                    <span className="text-accent shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-gray-400 leading-relaxed font-sans border-t border-white/5 bg-white/[0.005]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-xs text-gray-400">Still have questions specific to your business model?</p>
            <a 
              href="https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20I%20have%20some%20questions%20regarding%20web%20development%20for%20my%20business%2E"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-xs font-bold mt-2 inline-block"
            >
              Ask Harsh Patel directly on WhatsApp →
            </a>
          </div>

        </div>
      </section>

    </PageTransition>
  );
}
