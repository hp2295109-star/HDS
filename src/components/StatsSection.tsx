import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Globe, Gauge, Smartphone, Clock } from 'lucide-react';

const AnimatedNumber = ({ value, duration = 2 }: { value: number | string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const suffix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeProgress * numericValue));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(numericValue);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, numericValue, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

export default function StatsSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: Globe,
      value: "20+",
      label: "Landing Pages Designed"
    },
    {
      icon: Gauge,
      value: "95+",
      label: "Performance Score Target"
    },
    {
      icon: Smartphone,
      value: "100%",
      label: "Responsive Experience"
    },
    {
      icon: Clock,
      value: "24hrs",
      label: "Average Response Time"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" ref={containerRef}>
      {/* Background with Grid & Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <motion.div 
          animate={{ 
            y: [0, -20, 0], 
            opacity: [0.1, 0.3, 0.1],
            x: [0, 10, 0]
          }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute left-[10%] top-[20%] w-1.5 h-1.5 bg-accent rounded-full blur-[1px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0], 
            opacity: [0.1, 0.4, 0.1],
            x: [0, -15, 0]
          }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute right-[20%] top-[60%] w-2 h-2 bg-accent rounded-full blur-[2px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, -40, 0], 
            opacity: [0.05, 0.2, 0.05] 
          }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
          className="absolute left-[50%] bottom-[10%] w-3 h-3 bg-secondary rounded-full blur-[3px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 tracking-tight text-white"
          >
            Trusted By Businesses That Want To <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Grow Smarter</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Every project is built with performance, speed and long-term business growth in mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                className="h-full"
              >
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="group relative bg-surface hover:bg-surface-hover backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:border-accent/40 transition-all duration-500 flex flex-col items-center text-center overflow-hidden h-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,240,255,0.15)]"
                >
                {/* Subtle animated gradient border on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl border-[1px] border-transparent" style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(0, 240, 255, 0.3) 50%, transparent 60%) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }} />
                
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-accent/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div 
                  className="w-14 h-14 bg-white/5 group-hover:bg-accent/10 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500 relative z-10"
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <stat.icon className="w-7 h-7 text-gray-300 group-hover:text-accent transition-colors duration-500" />
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-4xl font-bold font-heading text-white mb-2 relative z-10 tracking-tight flex items-center justify-center min-h-[48px]"
                >
                  {isInView ? <AnimatedNumber value={stat.value} duration={2.5} /> : "0"}
                </motion.div>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 font-medium text-sm relative z-10">
                  {stat.label}
                </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
