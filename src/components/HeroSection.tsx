import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowRight, Instagram, Facebook, MessageCircle, Mail, Globe, Code, Search, Cpu, Megaphone, Zap, Smartphone, CheckCircle2, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const SocialIcon = ({ Icon, left, top, delay }: any) => {
  return (
    <motion.div
      style={{ left, top }}
      initial={{ opacity: 0 }}
      animate={{ 
        y: [0, -15, 10, 0],
        opacity: [0.2, 0.6, 0.2]
      }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute text-white p-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hidden md:block shadow-[0_0_15px_rgba(0,0,0,0.05)] z-0"
    >
      <Icon className="w-5 h-5 opacity-70" />
    </motion.div>
  );
};

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-7 lg:row-span-4 bg-surface backdrop-blur-3xl rounded-[32px] p-8 md:p-12 border border-border shadow-2xl relative overflow-hidden group min-h-[550px] flex flex-col xl:flex-row items-center"
    >
      {/* Background Interactive Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: mousePos.x * -2, y: mousePos.y * -2 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute inset-0"
        >
          {/* Soft Gradients */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-30%] left-[-10%] w-[80%] h-[80%] bg-accent/20 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-30%] right-[-10%] w-[80%] h-[80%] bg-secondary/20 rounded-full blur-[100px]"
          />

          {/* AI Nodes and Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <motion.path 
              d="M-100,100 C100,200 300,50 500,250 S800,100 1100,200" 
              fill="none" 
              stroke="url(#grad)" 
              strokeWidth="1.5" 
              strokeDasharray="6 6"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.path 
              d="M-100,400 C200,300 400,450 600,200 S900,400 1100,300" 
              fill="none" 
              stroke="url(#grad2)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="var(--color-secondary)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Social Icons */}
          <SocialIcon Icon={Instagram} left="10%" top="15%" delay={0} />
          <SocialIcon Icon={Facebook} left="5%" top="65%" delay={1} />
          <SocialIcon Icon={MessageCircle} left="40%" top="8%" delay={2} />
          <SocialIcon Icon={Mail} left="85%" top="15%" delay={1.5} />
          <SocialIcon Icon={Globe} left="80%" top="80%" delay={0.5} />

          {/* Soft Particles */}
          <motion.div animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 7, repeat: Infinity }} className="absolute left-[30%] top-[40%] w-2 h-2 bg-accent/40 rounded-full blur-[2px]" />
          <motion.div animate={{ y: [0, 20, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 9, repeat: Infinity, delay: 1 }} className="absolute left-[70%] top-[30%] w-3 h-3 bg-white/30 rounded-full blur-[3px]" />
          <motion.div animate={{ y: [0, -40, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 11, repeat: Infinity, delay: 2 }} className="absolute left-[20%] top-[80%] w-4 h-4 bg-secondary/30 rounded-full blur-[4px]" />
          <motion.div animate={{ y: [0, 25, 0], opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 8, repeat: Infinity, delay: 3 }} className="absolute left-[90%] top-[60%] w-2 h-2 bg-accent/30 rounded-full blur-[2px]" />
        </motion.div>
      </div>

      {/* Mouse Glow Follower */}
      <motion.div
        className="absolute w-64 h-64 bg-accent/15 rounded-full blur-[80px] pointer-events-none hidden md:block"
        animate={{ 
          x: mousePos.x * 15,
          y: mousePos.y * 15
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{ left: 'calc(50% - 128px)', top: 'calc(50% - 128px)' }}
      />

      {/* Left Side Content */}
      <div className="w-full xl:w-[55%] relative z-10 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center w-max bg-surface border border-border text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 shadow-sm backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2 shadow-[0_0_8px_var(--color-accent)]"></span>
          Premium AI-Powered Agency
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6 leading-[1.1] text-white"
        >
          Dominate Digital.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
            Automate Growth.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
          className="text-base md:text-lg text-gray-400 mb-10 max-w-lg leading-relaxed"
        >
          We craft high-converting websites and implement smart AI automation to scale your local business effortlessly.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link 
            to="/contact" 
            className="premium-button w-full sm:w-auto inline-flex items-center justify-center group"
          >
            Book Free Consultation
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/portfolio" 
            className="premium-button-outline w-full sm:w-auto inline-flex items-center justify-center"
          >
            View Our Work
          </Link>
        </motion.div>
      </div>

      {/* Right Side: Premium Dashboard Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full xl:w-[45%] mt-12 xl:mt-0 relative z-10 xl:pl-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotateX: [0, 1, 0], rotateY: [0, -1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative group overflow-hidden"
        >
          {/* Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-0" />
          
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <Activity className="w-3 h-3" />
              <span>System Active</span>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors shadow-sm gap-2 sm:gap-0 group/item hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-accent/10 rounded-lg text-accent group-hover/item:scale-110 transition-transform"><Code className="w-4 h-4" /></div>
                <span className="font-semibold text-sm text-white">Website Development</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3 mr-1"/> Fast Delivery</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors shadow-sm gap-2 sm:gap-0 group/item hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-accent/10 rounded-lg text-accent group-hover/item:scale-110 transition-transform"><Search className="w-4 h-4" /></div>
                <span className="font-semibold text-sm text-white">SEO Optimization</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent flex items-center bg-accent/10 px-2 py-1 rounded-full"><Zap className="w-3 h-3 mr-1"/> Online</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors shadow-sm gap-2 sm:gap-0 group/item hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-accent/10 rounded-lg text-accent group-hover/item:scale-110 transition-transform"><Cpu className="w-4 h-4" /></div>
                <span className="font-semibold text-sm text-white">AI Automation</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A855F7] flex items-center bg-[#A855F7]/10 px-2 py-1 rounded-full"><Cpu className="w-3 h-3 mr-1"/> AI Powered</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors shadow-sm gap-2 sm:gap-0 group/item hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-accent/10 rounded-lg text-accent group-hover/item:scale-110 transition-transform"><Megaphone className="w-4 h-4" /></div>
                <span className="font-semibold text-sm text-white">Meta Ads</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary flex items-center bg-secondary/10 px-2 py-1 rounded-full"><Smartphone className="w-3 h-3 mr-1"/> Mobile Friendly</span>
            </div>
          </div>
          
          {/* Subtle glowing border overlay */}
          <div className="absolute inset-0 border-[1.5px] border-accent/20 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
