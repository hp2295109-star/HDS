import { motion } from 'motion/react';
import { Instagram, Facebook, MessageCircle, Mail, Globe, Cpu, Code, MousePointer2, Search, LineChart, Zap, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const icons = [Instagram, Facebook, MessageCircle, Mail, Globe, Cpu, Code, MousePointer2, Search, LineChart, Zap, Sparkles];

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<{ id: number; Icon: any; x: number; y: number; delay: number; duration: number; depth: number }[]>([]);
  
  useEffect(() => {
    // Only 8 particles for a cleaner look and 100% fluent rendering
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      delay: Math.random() * 2,
      duration: 25 + Math.random() * 25,
      depth: 0.6 + Math.random() * 0.8
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg-base">
      {/* Soft gradient mesh - Made static to eliminate heavy GPU compositing and blur stutter */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 hidden md:block">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-accent/30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: Math.floor(p.depth * 5) }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
          >
            <p.Icon className="w-8 h-8" strokeWidth={1} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
