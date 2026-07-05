import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Globe, ShieldCheck, Zap, 
  ArrowRight, Loader2, CheckCircle2, 
  Smartphone, MessageCircle, AlertCircle, ChevronDown, 
  TrendingUp, Activity, PlayCircle, Target, Award, Search, LayoutTemplate, X
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

// --- Types ---
interface AssessmentData {
  businessType: string;
  monthlyRevenue: string;
  hasWebsite: string;
  hasGMB: string;
  seoStatus: string;
  runningAds: string;
  socialMedia: string;
  usesWhatsApp: string;
  targetCity: string;
  mainGoal: string;
}

const initialData: AssessmentData = {
  businessType: '',
  monthlyRevenue: '',
  hasWebsite: '',
  hasGMB: '',
  seoStatus: '',
  runningAds: '',
  socialMedia: '',
  usesWhatsApp: '',
  targetCity: '',
  mainGoal: ''
};

// --- Components ---

// 1. Hero Section
const HeroSection = ({ onStart }: { onStart: () => void }) => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <motion.div animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1], x: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[10%] top-[20%] w-1.5 h-1.5 bg-accent rounded-full blur-[1px]" />
        <motion.div animate={{ y: [0, 30, 0], opacity: [0.1, 0.4, 0.1], x: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute right-[20%] top-[60%] w-2 h-2 bg-secondary rounded-full blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mb-8">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">AI-Powered Assessment</span>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight">
          Discover Your Business <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Growth Potential</span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10">
          Answer a few questions and receive a personalized business growth report with practical recommendations to strengthen your online presence.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onStart} className="premium-button w-full sm:w-auto inline-flex items-center justify-center">
            Start Free Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button onClick={onStart} className="premium-button-outline w-full sm:w-auto inline-flex items-center justify-center">
            <PlayCircle className="w-5 h-5 mr-2" />
            View Sample Report
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// 2. Why It Matters
const WhyMattersSection = () => {
  const cards = [
    { icon: Globe, title: "Website Visibility", desc: "Discover how easily customers can find you online." },
    { icon: ShieldCheck, title: "Customer Trust", desc: "Assess how your brand is perceived by new visitors." },
    { icon: Target, title: "Lead Generation", desc: "Identify gaps in your current customer acquisition." },
    { icon: Zap, title: "AI Readiness", desc: "See if your business is ready for the AI revolution." }
  ];

  return (
    <section className="py-24 bg-surface/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why This Assessment Matters</h2>
          <p className="text-gray-400">Data-driven insights to scale your business smartly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass-card group">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                <card.icon className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. Calculator Form
const CalculatorForm = ({ onSubmit, data, setData }: { onSubmit: () => void, data: AssessmentData, setData: React.Dispatch<React.SetStateAction<AssessmentData>> }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <section id="calculator-form" className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 md:p-12 border-accent/20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading mb-2">Business Growth Calculator</h2>
            <p className="text-gray-400">Provide accurate details for the best AI recommendations.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Business Type</label>
                <select required name="businessType" value={data.businessType} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select business type</option>
                  <option value="local">Local Service / Shop</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="b2b">B2B / Agency</option>
                  <option value="saas">SaaS / Tech</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Monthly Revenue */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Est. Monthly Revenue</label>
                <select required name="monthlyRevenue" value={data.monthlyRevenue} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select range</option>
                  <option value="under_1l">Under ₹1L</option>
                  <option value="1l_5l">₹1L - ₹5L</option>
                  <option value="5l_10l">₹5L - ₹10L</option>
                  <option value="above_10l">Above ₹10L</option>
                </select>
              </div>

              {/* Current Website */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Do you have a website?</label>
                <select required name="hasWebsite" value={data.hasWebsite} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select option</option>
                  <option value="yes_good">Yes, and it's good</option>
                  <option value="yes_needs_work">Yes, but needs redesign</option>
                  <option value="no">No website</option>
                </select>
              </div>

              {/* Google Business Profile */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Google Business Profile</label>
                <select required name="hasGMB" value={data.hasGMB} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select option</option>
                  <option value="optimized">Yes, fully optimized</option>
                  <option value="exists">Yes, but rarely updated</option>
                  <option value="no">No profile</option>
                </select>
              </div>

              {/* SEO Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">SEO Status</label>
                <select required name="seoStatus" value={data.seoStatus} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select option</option>
                  <option value="active">Actively doing SEO</option>
                  <option value="past">Did in the past</option>
                  <option value="none">Never done SEO</option>
                </select>
              </div>

              {/* Online Ads */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Running Online Ads?</label>
                <select required name="runningAds" value={data.runningAds} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select option</option>
                  <option value="yes">Yes (Google/Meta)</option>
                  <option value="tried">Tried but stopped</option>
                  <option value="no">Never ran ads</option>
                </select>
              </div>

              {/* Target City */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Target City / Market</label>
                <input required type="text" name="targetCity" value={data.targetCity} onChange={handleChange} placeholder="e.g. Mumbai, Pan India..." className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors" />
              </div>

              {/* Main Goal */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Primary Goal</label>
                <select required name="mainGoal" value={data.mainGoal} onChange={handleChange} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                  <option value="" disabled>Select goal</option>
                  <option value="leads">More Leads / Enquiries</option>
                  <option value="sales">More Online Sales</option>
                  <option value="brand">Better Brand Image</option>
                  <option value="automation">Automate Operations</option>
                </select>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button type="submit" className="premium-button w-full md:w-auto min-w-[240px]">
                Generate AI Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// 4. Loading Screen
const LoadingScreen = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing business profile...",
    "Checking website readiness...",
    "Evaluating local visibility...",
    "Analyzing customer journey...",
    "Generating AI recommendations..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-32 flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="w-12 h-12 text-accent animate-spin mb-8" />
      <div className="h-8 relative overflow-hidden w-64 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="absolute inset-0 text-gray-300 font-medium">
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, percentage }: { label: string, percentage: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1 text-sm font-medium">
      <span className="text-gray-300">{label}</span>
      <span className="text-accent">{percentage}%</span>
    </div>
    <div className="w-full bg-white/5 rounded-full h-2">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full"
      />
    </div>
  </div>
);

// FAQ Accordion Item
const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card !p-6 cursor-pointer hover:border-accent/30 transition-colors" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-white text-lg">{q}</h4>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-accent' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pt-4 text-gray-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 5. Results Section
const ResultsSection = ({ data }: { data: AssessmentData }) => {
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  // Logic to determine scores based on data
  const calculateScores = () => {
    let website = 50;
    if (data.hasWebsite === 'yes_good') website = 95;
    if (data.hasWebsite === 'yes_needs_work') website = 60;
    if (data.hasWebsite === 'no') website = 10;

    let seo = 40;
    if (data.seoStatus === 'active') seo = 90;
    if (data.seoStatus === 'past') seo = 50;
    if (data.seoStatus === 'none') seo = 10;

    let leadGen = 50;
    if (data.runningAds === 'yes') leadGen = 85;
    if (data.runningAds === 'tried') leadGen = 40;
    if (data.runningAds === 'no') leadGen = 15;

    let brand = 50;
    if (data.hasGMB === 'optimized') brand += 30;
    if (data.hasWebsite === 'yes_good') brand += 20;

    const overall = Math.floor((website + seo + leadGen + brand) / 4);

    return { website, seo, leadGen, brand, overall };
  };

  const scores = calculateScores();

  const learningTopics = [
    { title: "Why every business needs a website", desc: "A premium website acts as your 24/7 salesperson, establishing immediate authority and capturing leads even while you sleep.", icon: Globe },
    { title: "SEO explained simply", desc: "SEO is how Google matches your business to customers actively searching for your services. Ranking higher means free, consistent traffic.", icon: Search },
    { title: "Meta Ads vs Google Ads", desc: "Google captures high-intent searches (people looking right now), while Meta builds brand awareness and generates demand proactively.", icon: Target },
    { title: "How AI saves business time", desc: "AI automation can handle repetitive tasks like booking appointments and qualifying leads, freeing you to focus on actual operations.", icon: Zap }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      
      {/* Overview Card */}
      <div className="glass-card grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold font-heading mb-4">Your Digital Growth Score</h2>
          <p className="text-gray-400 mb-8 max-w-md">Based on your inputs, here is how your business performs digitally compared to industry standards.</p>
          <div className="space-y-6">
            <ProgressBar label="Website & Experience" percentage={scores.website} />
            <ProgressBar label="SEO & Discoverability" percentage={scores.seo} />
            <ProgressBar label="Lead Generation" percentage={scores.leadGen} />
            <ProgressBar label="Brand Presence" percentage={scores.brand} />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="50" cy="50" r="40" 
                stroke="url(#gradient)" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="251.2" 
                initial={{ strokeDashoffset: 251.2 }}
                whileInView={{ strokeDashoffset: 251.2 - (251.2 * scores.overall) / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#0080FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-bold font-heading text-white">{scores.overall}</span>
              <span className="text-sm text-gray-400 uppercase tracking-wider font-bold mt-1">Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Growth Opportunities</h2>
          <p className="text-gray-400">Areas that need attention to unlock more revenue.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface border border-white/5 p-6 rounded-2xl group hover:border-accent/30 transition-colors">
            <TrendingUp className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2">Estimated Improvement Potential</h4>
            <p className="text-gray-400 text-sm">By implementing the recommendations, you could see a 2x-3x increase in digital footprint.</p>
          </div>
          <div className="bg-surface border border-white/5 p-6 rounded-2xl group hover:border-accent/30 transition-colors">
            <Search className="w-8 h-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2">Visibility Gaps</h4>
            <p className="text-gray-400 text-sm">{data.seoStatus === 'none' ? 'You are missing out on organic search traffic.' : 'Your organic presence can be optimized further for high-intent keywords.'}</p>
          </div>
          <div className="bg-surface border border-white/5 p-6 rounded-2xl group hover:border-accent/30 transition-colors">
            <Target className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-bold text-white mb-2">Conversion Leakage</h4>
            <p className="text-gray-400 text-sm">{data.hasWebsite === 'no' ? 'Without a website, you are losing trust and direct leads.' : 'Your current setup can be optimized to convert visitors better.'}</p>
          </div>
        </div>
      </div>

      {/* 90-Day Roadmap */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">90-Day Digital Growth Roadmap</h2>
          <p className="text-gray-400">Your step-by-step action plan.</p>
        </div>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-accent/30 before:to-transparent">
          {[
            { month: "Month 1", title: "Foundation & Setup", desc: data.hasWebsite === 'no' ? "Launch a premium, high-converting website." : "Optimize your existing website and Google Business Profile for conversions." },
            { month: "Month 2", title: "Traffic & Lead Generation", desc: data.runningAds === 'no' ? "Setup and launch targeted Meta/Google Ads to drive immediate traffic." : "Scale your existing ad campaigns with better creatives and AI targeting." },
            { month: "Month 3", title: "Scale & Automation", desc: "Implement AI workflows, WhatsApp automation, and focus on long-term SEO scaling." }
          ].map((item, idx) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-accent/20 bg-accent/10 text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card !p-6 !rounded-2xl hover:border-accent/50 transition-colors">
                <div className="text-accent font-bold text-xs uppercase tracking-wider mb-2">{item.month}</div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Center */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Learning Center</h2>
          <p className="text-gray-400">Personalized educational resources for your growth.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningTopics.map((topic, idx) => (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} key={idx} onClick={() => setSelectedTopic(topic)} className="glass-card cursor-pointer group hover:border-accent/50 transition-colors !p-6">
              <topic.icon className="w-8 h-8 text-gray-400 group-hover:text-accent mb-4 transition-colors" />
              <h4 className="text-lg font-bold text-white mb-2">{topic.title}</h4>
              <p className="text-sm text-accent font-bold mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">Read concept <ArrowRight className="w-4 h-4 ml-1" /></p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Learning Center */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTopic(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-surface border border-white/10 rounded-[32px] p-8 md:p-12 max-w-xl w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedTopic(null)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-accent transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
              <selectedTopic.icon className="w-12 h-12 text-accent mb-6" />
              <h3 className="text-2xl font-bold font-heading mb-4 text-white">{selectedTopic.title}</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-accent to-secondary rounded-full mb-6" />
              <p className="text-gray-300 leading-relaxed text-lg">
                {selectedTopic.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommended Services */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Recommended For You</h2>
          <p className="text-gray-400">Services that match your exact business needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(data.hasWebsite === 'no' || data.hasWebsite === 'yes_needs_work' || true) && (
            <div className="glass-card group hover:border-accent/50 transition-colors">
              <LayoutTemplate className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Website Development</h3>
              <p className="text-sm text-gray-400 mb-4">A high-converting, lightning-fast digital storefront.</p>
              <button className="text-accent text-sm font-bold flex items-center group-hover:underline">Learn More <ArrowRight className="w-4 h-4 ml-1" /></button>
            </div>
          )}
          {(data.seoStatus === 'none' || data.seoStatus === 'past' || true) && (
            <div className="glass-card group hover:border-accent/50 transition-colors">
              <Search className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">SEO Optimization</h3>
              <p className="text-sm text-gray-400 mb-4">Dominate local search and get found on Google.</p>
              <button className="text-secondary text-sm font-bold flex items-center group-hover:underline">Learn More <ArrowRight className="w-4 h-4 ml-1" /></button>
            </div>
          )}
          {(data.runningAds === 'no' || data.runningAds === 'tried' || true) && (
            <div className="glass-card group hover:border-accent/50 transition-colors">
              <Target className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Performance Marketing</h3>
              <p className="text-sm text-gray-400 mb-4">Targeted Meta & Google ads to generate immediate leads.</p>
              <button className="text-accent text-sm font-bold flex items-center group-hover:underline">Learn More <ArrowRight className="w-4 h-4 ml-1" /></button>
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">Everything you need to know about the next steps.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem q="How accurate is this report?" a="The report is based on industry benchmarks, current best practices, and our experience helping local businesses grow online." />
          <FAQItem q="Do I have to pay for the recommendations?" a="No, the report and recommendations are completely free. You only pay if you decide to hire Harsh Digital Studios to implement them for you." />
          <FAQItem q="How long does it take to see results?" a="Website updates can be immediate. Paid ads can start generating leads within 48 hours. SEO usually takes 3-6 months for significant organic growth." />
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden group mt-24 shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.1)] transition-shadow duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 tracking-tight relative z-10">
          Ready to Turn This Report Into <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Real Business Growth?</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 mt-10">
          <button className="premium-button w-full sm:w-auto inline-flex items-center justify-center">
            Book Free Strategy Call
          </button>
          <a href="https://wa.me/917470822184" className="premium-button-outline w-full sm:w-auto inline-flex items-center justify-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

    </motion.div>
  );
};

export default function BusinessGrowthCalculator() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState<AssessmentData>(initialData);

  const handleStart = () => {
    setHasStarted(true);
    setTimeout(() => {
      document.getElementById('calculator-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call and analysis
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResults(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }, 2500); // 2.5s loading
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#030509] text-white selection:bg-accent/30 overflow-x-hidden">
        {!showResults && !isSubmitting && (
          <>
            <HeroSection onStart={handleStart} />
            <WhyMattersSection />
            {hasStarted && (
              <CalculatorForm onSubmit={handleSubmit} data={data} setData={setData} />
            )}
          </>
        )}

        {isSubmitting && <LoadingScreen />}

        {showResults && !isSubmitting && (
          <ResultsSection data={data} />
        )}
      </div>
    </PageTransition>
  );
}
