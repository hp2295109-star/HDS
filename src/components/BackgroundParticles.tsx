import { motion, useMotionValue, useSpring } from 'motion/react';
import { Instagram, Facebook, MessageCircle, Mail, Globe, Cpu, Code, MousePointer2, Search, LineChart, Zap, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const icons = [Instagram, Facebook, MessageCircle, Mail, Globe, Cpu, Code, MousePointer2, Search, LineChart, Zap, Sparkles];

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<{ id: number; Icon: any; x: number; y: number; delay: number; duration: number; depth: number }[]>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 20,
      depth: 0.5 + Math.random() * 1.5 // Parallax depth multiplier
    }));
    setParticles(newParticles);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg-base">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        className="absolute inset-0 hidden md:block"
        style={{ x: smoothX, y: smoothY }}
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-accent"
            style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: Math.floor(p.depth * 10) }}
            animate={{
              y: [0, -60 * p.depth, 0],
              x: [0, 40 * p.depth, 0],
              rotate: [0, 360],
              scale: [1, 1.2 * p.depth, 1],
              opacity: [0.01, 0.06, 0.01]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          >
            <p.Icon className="w-12 h-12" strokeWidth={1} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
