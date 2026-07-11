import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { 
  ArrowRight, Globe, Search, Cpu, Megaphone, Zap, 
  Smartphone, CheckCircle2, Activity, Play, RefreshCw,
  TrendingUp, Users, Eye, Target, Sparkles, AlertCircle,
  Clock, MapPin, Bell, Shield, HeartPulse, Sparkle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SIMULATION_MESSAGES = [
  "Testing server response & core web vitals...",
  "Crawl check: verifying sitemap & schema.org data...",
  "Local MAP API search rank audit...",
  "Meta ads pixel & landing page match score...",
  "HDS Growth engine fully synchronized! 🚀"
];

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Interactive Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(-1);
  const [currentScore, setCurrentScore] = useState(95);
  const [webHealth, setWebHealth] = useState(98);
  const [seoScore, setSeoScore] = useState(94);
  const [leadGrowth, setLeadGrowth] = useState(142);
  const [googleVisibility, setGoogleVisibility] = useState(89);
  const [metaRoi, setMetaRoi] = useState(4.2);
  
  // Dynamic Leads List
  const [leads, setLeads] = useState([
    { name: "Arjun K.", service: "Luxury Salon Website", value: "₹18k/mo", time: "2 mins ago", status: "Hot Lead", initial: "A", color: "bg-emerald-500/10 text-emerald-400" },
    { name: "Sarah Mehta", service: "Spa Campaign Setup", value: "₹35k budget", time: "15 mins ago", status: "Inbound", initial: "S", color: "bg-accent/10 text-accent" },
    { name: "Rajesh Sharma", service: "Gym AI Booking Bot", value: "₹42k contract", time: "1 hour ago", status: "Converted", initial: "R", color: "bg-[#A855F7]/10 text-[#A855F7]" }
  ]);

  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
    };
  }, []);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(0);
    
    // Set initial depressed scores to count up from
    setCurrentScore(64);
    setWebHealth(71);
    setSeoScore(58);
    setLeadGrowth(82);
    setGoogleVisibility(45);
    setMetaRoi(2.1);

    // Reset leads back to initial state so we can append a new one upon completion
    setLeads([
      { name: "Arjun K.", service: "Luxury Salon Website", value: "₹18k/mo", time: "2 mins ago", status: "Hot Lead", initial: "A", color: "bg-emerald-500/10 text-emerald-400" },
      { name: "Sarah Mehta", service: "Spa Campaign Setup", value: "₹35k budget", time: "15 mins ago", status: "Inbound", initial: "S", color: "bg-accent/10 text-accent" },
      { name: "Rajesh Sharma", service: "Gym AI Booking Bot", value: "₹42k contract", time: "1 hour ago", status: "Converted", initial: "R", color: "bg-[#A855F7]/10 text-[#A855F7]" }
    ]);

    const delay = 1000;

    const tick = (step: number) => {
      if (step >= SIMULATION_MESSAGES.length) {
        setIsSimulating(false);
        setSimulationStep(-1);
        
        // Append a live new lead upon successful simulation as a surprise delight
        setLeads(prev => [
          { name: "Tanya Sen (Live)", service: "Dental SEO + WhatsApp Automation", value: "₹55k value", time: "Just now", status: "Direct WhatsApp", initial: "T", color: "bg-amber-500/10 text-amber-400" },
          ...prev.slice(0, 2)
        ]);
        return;
      }

      setSimulationStep(step);

      // Dynamically improve scores in blocks
      if (step === 0) {
        setWebHealth(98);
        setCurrentScore(71);
      } else if (step === 1) {
        setSeoScore(94);
        setCurrentScore(79);
      } else if (step === 2) {
        setGoogleVisibility(89);
        setCurrentScore(85);
      } else if (step === 3) {
        setMetaRoi(4.2);
        setLeadGrowth(142);
        setCurrentScore(95);
      }

      simulationTimeoutRef.current = setTimeout(() => {
        tick(step + 1);
      }, delay);
    };

    tick(0);
  };

  // Generate path coordinates for a glowing Sparkline chart
  const sparklinePoints = [
    { x: 0, y: 35 },
    { x: 15, y: 30 },
    { x: 30, y: 40 },
    { x: 45, y: 15 },
    { x: 60, y: 25 },
    { x: 75, y: 8 },
    { x: 90, y: 18 },
    { x: 100, y: 5 }
  ];

  const chartPathLine = sparklinePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const chartPathArea = `${chartPathLine} L 100 45 L 0 45 Z`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-7 lg:row-span-4 bg-surface backdrop-blur-3xl rounded-[32px] p-6 md:p-10 border border-border shadow-2xl relative overflow-hidden group min-h-[580px] flex flex-col xl:flex-row items-center gap-10"
    >
      {/* Background Interactive Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: mousePos.x * -1.5, y: mousePos.y * -1.5 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute inset-0"
        >
          {/* Soft Gradients */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-accent/15 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
            className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-secondary/15 rounded-full blur-[120px]"
          />

          {/* Clean SaaS Grid Network */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </motion.div>
      </div>

      {/* Mouse Glow Follower */}
      <motion.div
        className="absolute w-80 h-80 bg-accent/10 rounded-full blur-[90px] pointer-events-none hidden md:block"
        animate={{ 
          x: mousePos.x * 12,
          y: mousePos.y * 12
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ left: 'calc(50% - 160px)', top: 'calc(50% - 160px)' }}
      />

      {/* Left Side Content */}
      <div className="w-full xl:w-[50%] relative z-10 flex flex-col justify-center text-left">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center w-max bg-white/5 border border-white/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md hover:bg-white/10 transition-colors"
        >
          <Sparkle className="w-3.5 h-3.5 animate-spin mr-1.5 text-accent" />
          <span>Next-Gen SaaS Growth Suite</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-4xl md:text-5xl lg:text-[56px] font-bold font-heading tracking-tight mb-5 leading-[1.05] text-white"
        >
          Build. <br className="hidden sm:inline" />
          Automate. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-secondary to-[#A855F7] animate-gradient-bg">
            Grow.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-base md:text-[17px] text-gray-400 mb-8 max-w-[480px] leading-relaxed"
        >
          Everything your business needs to grow online—from premium websites and SEO to AI automation—in one platform.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link 
            to="/business-growth-calculator" 
            className="premium-button w-full sm:w-auto inline-flex items-center justify-center group text-center"
          >
            Start Free Assessment
            <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className={`premium-button-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              isSimulating ? 'opacity-70 bg-white/5 border-accent/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : ''
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin text-accent" />
                <span>Running Audit...</span>
              </>
            ) : (
              <>
                <Play className="w-4.5 h-4.5 text-accent" />
                <span>View Live Demo</span>
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Right Side: Premium SaaS Dashboard */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.65, type: "spring" }}
        className="w-full xl:w-[50%] mt-6 xl:mt-0 relative z-10 xl:pl-4 self-stretch flex flex-col justify-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="bg-black/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative group hover:border-accent/20 transition-colors"
        >
          {/* Glass Reflection Flare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-0" />
          
          {/* Top Bar Window Controls */}
          <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3.5">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.4)]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_6px_rgba(234,179,8,0.4)]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_6px_rgba(34,197,94,0.4)]"></div>
              <span className="text-[10px] text-gray-500 font-mono pl-2 tracking-widest uppercase">HDS.OS V2.4</span>
            </div>
            
            <div className="flex items-center">
              <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div 
                    key="simulating"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center space-x-1.5 text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="truncate max-w-[130px] md:max-w-none">{SIMULATION_MESSAGES[simulationStep]}</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="active"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>System Active & Synced</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Business Health Score Card */}
            <div className="col-span-1 md:col-span-7 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 shadow-sm relative overflow-hidden group/card">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Business Health</span>
                <span className="text-2xl font-bold font-heading text-white mt-1.5">{currentScore}/100</span>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Excellent
                </span>
              </div>
              
              {/* Custom SVG Circular Progress */}
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-white/5"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-accent"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - currentScore / 100) }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  />
                </svg>
                <div className="absolute font-mono text-xs font-bold text-white">
                  {currentScore}
                </div>
              </div>
            </div>

            {/* Google Visibility Pill */}
            <div className="col-span-1 md:col-span-5 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Google Vis</span>
                <Eye className="w-3.5 h-3.5 text-[#0080FF]" />
              </div>
              <div className="mt-2">
                <span className="text-xl font-bold text-white">{googleVisibility}%</span>
                <div className="text-[10px] text-accent font-semibold mt-1 flex items-center">
                  Rank #1-3 Local Pack
                </div>
              </div>
            </div>

            {/* Middle row: Website Health & SEO Score */}
            <div className="col-span-1 md:col-span-6 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center space-x-3.5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 shadow-sm">
              <div className="p-2.5 bg-accent/10 text-accent rounded-lg">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Website Health</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-lg font-bold text-white">{webHealth}%</span>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase">A+ Speed</span>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-6 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center space-x-3.5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 shadow-sm">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                <Search className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SEO Core Audit</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-lg font-bold text-white">{seoScore}/100</span>
                  <span className="text-[9px] text-purple-400 font-bold">Excellent</span>
                </div>
              </div>
            </div>

            {/* Sparkline & Lead Growth Card */}
            <div className="col-span-1 md:col-span-8 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Traffic & Lead Growth</span>
                  <span className="text-xl font-bold text-white mt-0.5">+{leadGrowth}% <span className="text-xs text-gray-500 font-normal">this month</span></span>
                </div>
                <div className="text-[10px] text-[#A855F7] font-semibold flex items-center bg-[#A855F7]/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" /> Dynamic Scaling
                </div>
              </div>
              
              {/* Floating Sparkline */}
              <div className="h-14 w-full mt-2 relative">
                <svg className="w-full h-full" viewBox="0 0 100 45" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.35"/>
                      <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Glowing shaded area under line */}
                  <path d={chartPathArea} fill="url(#chart-glow)" />
                  
                  {/* Sparkline Neon Path */}
                  <motion.path
                    d={chartPathLine}
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0.1 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  
                  {/* Glowing active point at end */}
                  <motion.circle
                    cx="100"
                    cy="5"
                    r="3.5"
                    fill="var(--color-accent)"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </svg>
              </div>
            </div>

            {/* Ads ROI Indicator */}
            <div className="col-span-1 md:col-span-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 shadow-sm">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Meta Ads ROI</span>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white font-heading">{metaRoi.toFixed(1)}x</span>
                <span className="text-[9px] uppercase tracking-wider block text-emerald-400 font-bold mt-1">3.5% Avg CTR</span>
              </div>
            </div>

            {/* Recent Leads Feed */}
            <div className="col-span-1 md:col-span-12 bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-3.5 h-3.5 text-accent animate-bounce" />
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Recent Local Enquiries</span>
                </div>
                <span className="text-[9px] text-gray-500 font-mono">Real-time Stream</span>
              </div>
              
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {leads.map((lead, idx) => (
                    <motion.div 
                      key={lead.name}
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${lead.color} shrink-0`}>
                          {lead.initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{lead.service}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end pl-2 shrink-0">
                        <span className="text-xs font-bold text-accent">{lead.value}</span>
                        <span className="text-[9px] text-gray-500 flex items-center mt-0.5">
                          <Clock className="w-2.5 h-2.5 mr-0.5 text-gray-600" />
                          {lead.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Google Business Profile Status Badge */}
            <div className="col-span-1 md:col-span-12 flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#4285F4]/5 border border-[#4285F4]/15 hover:bg-[#4285F4]/10 transition-colors">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#4285F4]" />
                <span className="text-xs text-[#90B5F7] font-semibold">Google Business Profile Sync</span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-bold text-[#4285F4] bg-white px-2 py-0.5 rounded-full uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Verified</span>
              </div>
            </div>

          </div>

          {/* Interactive outer glowing outline */}
          <div className="absolute inset-0 border-[1.5px] border-accent/20 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(0,240,255,0.08)]"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
