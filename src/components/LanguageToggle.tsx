import { useLanguage } from './LanguageProvider';
import { motion } from 'motion/react';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="relative p-2 rounded-full bg-surface hover:bg-white/10 transition-colors flex items-center justify-center group border border-border cursor-pointer h-10 px-3 gap-1.5"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
      <span className="text-xs font-bold text-white font-mono uppercase">
        {language === 'en' ? 'EN' : 'हिं'}
      </span>
      <motion.span
        layoutId="activeIndicator"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 rounded-full border border-accent/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
}
