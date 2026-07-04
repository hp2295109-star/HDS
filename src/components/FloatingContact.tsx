import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        href="tel:+917067363208"
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary transition-colors group"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.a>
      
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        href="https://wa.me/917470822184"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-colors group relative"
        aria-label="WhatsApp Us"
      >
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-50"></span>
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform relative z-10" />
      </motion.a>
    </div>
  );
}
