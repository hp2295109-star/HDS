import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, Shield, Search, Smartphone, Globe, 
  MessageSquare, Star, ArrowUpRight, Zap, Play, ChevronDown, 
  ChevronUp, BarChart3, HeartHandshake, Eye, RefreshCw, Mail, 
  MapPin, Phone, Award, Layers, Sparkles
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { supabaseService } from '../services/supabaseService';

// Interfaces
interface ServicePillar {
  id: string;
  title: string;
  category: 'Design' | 'SEO' | 'Marketing' | 'Maintenance';
  price: string;
  desc: string;
  benefits: string[];
}

interface DemoTemplate {
  id: string;
  title: string;
  niche: string;
  features: string[];
  link?: string;
  imageAlt: string;
  icon: string;
}

export default function Home() {
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
  const [activeDemoId, setActiveDemoId] = useState('salon');
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

  // 5 Niche Demo Templates
  const demoTemplates: DemoTemplate[] = [
    {
      id: "salon",
      title: "Unique Salon",
      niche: "Beauty & Wellness",
      features: ["Premium visual treatments menu", "Direct WhatsApp booking pre-fills", "Stylists & therapists bios grid", "Fully responsive before/after gallery"],
      link: "https://uniquesalons.netlify.app/",
      imageAlt: "Unique Salon Template Mockup",
      icon: "✨"
    },
    {
      id: "textile",
      title: "Anmol Textile",
      niche: "Retail & Fashion",
      features: ["Premium visual product catalogs", "Instagram feed synchronization", "Direct inquiry for fabric customization", "Elegant high-contrast display layout"],
      link: "https://anmoltextile.netlify.app/",
      imageAlt: "Anmol Textile Template Mockup",
      icon: "🛍️"
    },
    {
      id: "jewellers",
      title: "Puja Jewellers",
      niche: "Luxury Retail",
      features: ["Stunning high-res catalog displays", "Live gold rate indicator widget", "Secure direct WhatsApp inquiry integration", "Bespoke customized design consultation form"],
      link: "https://pujajewellers.netlify.app/",
      imageAlt: "Puja Jewellers Template Mockup",
      icon: "💎"
    },
    {
      id: "gym",
      title: "The Muscle Gym",
      niche: "Fitness & Health",
      features: ["Dynamic interactive class schedule", "Trainer profile cards with credentials", "Membership pricing comparison table", "Lead-generating free trial pass form"],
      link: "https://themuscle.netlify.app/",
      imageAlt: "The Muscle Gym Template Mockup",
      icon: "🏋️‍♂️"
    },
    {
      id: "aesthetics",
      title: "Rama Aesthetics",
      niche: "Skin Clinic & Wellness",
      features: ["Detailed treatment lists & pricing grids", "Interactive doctor slot booking requests", "High-retention post-care instruction FAQs", "Exquisite pastel and warm cream color palette"],
      link: "https://ramaaesthetics.netlify.app/",
      imageAlt: "Rama Aesthetics Skin Clinic Mockup",
      icon: "🩺"
    }
  ];

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

  const selectedDemo = demoTemplates.find(d => d.id === activeDemoId) || demoTemplates[0];

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
                <span>MBA Marketer & Professional Web Designer</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.1]">
                Stop Posting.<br />
                <span className="bg-gradient-to-r from-[#00F0FF] to-secondary bg-clip-text text-transparent">
                  Start Building Your Local Brand.
                </span>
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                I help business owners in <span className="text-white font-semibold">Raigarh, Tamnar, and Kharsia</span> double their customer bookings with premium website designs, local Google Maps ranking, and high-impact search strategies. Zero agency bloat. Pure results.
              </p>

              {/* Trust highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-accent text-xl font-bold font-mono">100%</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">Speed Index</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-secondary text-xl font-bold font-mono">2.4x</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">Lead Multiplier</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-[#0080FF] text-xl font-bold font-mono">1-on-1</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">Direct Accountability</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                <a 
                  href="#contact-form" 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all text-center cursor-pointer shadow-lg shadow-accent/10"
                >
                  Book Free Strategy Call
                </a>
                <Link 
                  to="/portfolio" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
                >
                  Explore Demo Designs
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

      {/* 3. DEMO DESIGNS INTERACTIVE SHOWCASE */}
      <section className="py-24 bg-transparent border-t border-white/5 relative" id="demo-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-[#00F0FF]/10 text-[#00F0FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Niche Previews</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white tracking-tight">
              Pre-Built Premium Demo Designs
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-base">
              Explore dynamic, high-converting layouts fully customized for local niches. Instantly copy a template, or request a custom build.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left selector menu (Col-4) */}
            <div className="lg:col-span-4 space-y-3">
              {demoTemplates.map(demo => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemoId(demo.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center space-x-4 cursor-pointer ${
                    activeDemoId === demo.id 
                      ? 'bg-accent/10 border-accent/40 shadow-sm' 
                      : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <span className="text-2xl shrink-0">{demo.icon}</span>
                  <div>
                    <h3 className={`text-sm font-bold ${activeDemoId === demo.id ? 'text-accent' : 'text-white'}`}>
                      {demo.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">{demo.niche}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right mockup window & feature checklist (Col-8) */}
            <div className="lg:col-span-8 bg-neutral-950 border border-white/10 rounded-[32px] p-6 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest">{selectedDemo.niche}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1">{selectedDemo.title}</h3>
                </div>

                {selectedDemo.link && (
                  <a
                    href={selectedDemo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-xs text-white font-bold hover:bg-white/10 rounded-xl transition-all"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                  </a>
                )}
              </div>

              {/* Blueprint details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">Key Conversion Modules:</h4>
                  <ul className="space-y-3">
                    {selectedDemo.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-gray-300 flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#00F0FF] mr-2 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                    <a
                      href="#contact-form"
                      onClick={(e) => {
                        e.preventDefault();
                        setLeadMessage(`I want a website similar to the ${selectedDemo.title} demo.`);
                        setLeadService(selectedDemo.niche === "Beauty & Wellness" ? "Business Website Design" : "Landing Page Design");
                        const contactForm = document.getElementById('contact-form');
                        if (contactForm) {
                          contactForm.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-5 py-3 bg-accent text-black font-extrabold text-xs rounded-xl hover:opacity-90 transition-all inline-flex items-center justify-center text-center"
                    >
                      Request Similar Website
                    </a>

                    <a
                      href={`https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20I%20want%20a%20website%20similar%20to%20the%20${encodeURIComponent(selectedDemo.title)}%20demo%2E`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-[#25D366] text-white font-bold text-xs rounded-xl hover:bg-opacity-90 transition-all inline-flex items-center justify-center gap-2 text-center"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>WhatsApp CTA</span>
                    </a>
                  </div>
                </div>

                {/* Simulated Web View Mockup */}
                <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 shadow-inner relative group h-56 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center space-x-1.5 pb-2 border-b border-white/5 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/50 block"></span>
                    <span className="text-[10px] text-gray-500 font-mono pl-2 truncate">https://hds-demo-preview.local/{selectedDemo.id}</span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center items-center text-center p-3">
                    <span className="text-4xl mb-2">{selectedDemo.icon}</span>
                    <p className="text-xs font-bold text-white">{selectedDemo.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Pre-styled interactive local database ready</p>
                  </div>

                  <div className="text-[9px] text-gray-500 font-mono text-center pt-2 border-t border-white/5">
                    CORE WEB VITALS: SPEED INDEX <span className="text-emerald-400">100/100</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CTA Link to Dedicated Demo Designs page */}
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
          
          <div className="bg-[#0B0F19] border border-accent/20 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-[0_0_80px_rgba(0,240,255,0.1)]">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/5 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="inline-flex items-center space-x-1.5 bg-accent/15 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Digital Growth Audit</span>
              </span>
              <h2 className="text-2xl md:text-4xl font-bold font-heading text-white">Let's Fuel Your Local Business</h2>
              <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                Fill out our secure CRM form below. Harsh Patel will manually analyze your online presence and call/WhatsApp you with a tailored 90-day expansion blueprint.
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-white">Lead Securely Routed!</h3>
                <p className="text-xs text-gray-400 mt-2">Thank you! Your requirements have been synchronized with the HDS CRM. Harsh Patel will contact you via WhatsApp within 2 hours.</p>
                
                <a
                  href={`https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20I%20just%20submitted%20the%20CRM%20form%20for%20my%20business%2E%20Let's%20discuss%20my%20digital%20growth%21`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-opacity-90 text-white font-bold text-xs rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Speed up on WhatsApp</span>
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
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Full Name / Owner</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Harsh Patel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={leadBusiness}
                      onChange={(e) => setLeadBusiness(e.target.value)}
                      placeholder="e.g. Apex Gym & Fitness"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="e.g. +91 70673 63208"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Required Service</label>
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none"
                    >
                      <option value="Business Website Design">Business Website Design</option>
                      <option value="Landing Page Design">Landing Page Design</option>
                      <option value="Website Redesign">Website Redesign</option>
                      <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
                      <option value="Local SEO">Local SEO</option>
                      <option value="Google Business Profile Optimization">Google Business Profile (GBP)</option>
                      <option value="Meta Ads">Meta Ads Campaigns</option>
                      <option value="Website Speed Optimization">Speed Optimization</option>
                      <option value="Free Website Audit">Free Website Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Estimated Budget</label>
                    <select
                      value={leadBudget}
                      onChange={(e) => setLeadBudget(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none"
                    >
                      <option value="Under ₹10k">Under ₹10k</option>
                      <option value="₹10k - ₹25k">₹10k - ₹25k</option>
                      <option value="₹25k - ₹50k">₹25k - ₹50k</option>
                      <option value="Above ₹50k">Above ₹50k</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Target Market / City</label>
                    <select
                      value={leadCity}
                      onChange={(e) => setLeadCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none"
                    >
                      <option value="Raigarh">Raigarh</option>
                      <option value="Tamnar">Tamnar</option>
                      <option value="Kharsia">Kharsia</option>
                      <option value="Other Chhattisgarh">Other Chhattisgarh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Specific Requirements / Target Competitor</label>
                  <textarea
                    rows={4}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="Briefly tell us what you do or link your top competitor's website..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-500">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>Secure encryption enabled. Your info is never sold.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synchronizing Lead...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Growth Inquiry</span>
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
