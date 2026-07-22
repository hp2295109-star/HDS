import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Home, Compass, MessageSquare, PhoneCall } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-card-bg/80 backdrop-blur-xl border border-card-border rounded-3xl p-8 md:p-12 text-center relative z-10 shadow-2xl"
      >
        <span className="px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-wider inline-block mb-6">
          404 Error • Page Not Found
        </span>
        
        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-4">
          Lost in Digital Space?
        </h1>
        
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The page or asset you are looking for doesn't exist, was renamed, or is temporarily unavailable. Let's get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            to="/"
            className="px-5 py-3 bg-accent text-bg-base font-bold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/services"
            className="px-5 py-3 bg-neutral-900 border border-card-border hover:border-accent/40 text-text-primary font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-accent" />
            <span>Explore Services</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-card-border/60 flex flex-wrap justify-center items-center gap-6 text-xs text-text-tertiary">
          <Link to="/contact" className="hover:text-accent transition-colors flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-accent" />
            <span>Contact Support</span>
          </Link>
          <Link to="/portfolio" className="hover:text-accent transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span>View Portfolio</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
