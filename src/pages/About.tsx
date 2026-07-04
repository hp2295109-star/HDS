import { motion } from 'motion/react';
import { ArrowRight, Code, Layout, LineChart, Megaphone, MonitorSmartphone, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const expertise = [
  { icon: Layout, title: "Website Design", desc: "Premium, conversion-focused interfaces." },
  { icon: Sparkles, title: "AI Automation", desc: "Smart workflows and chatbots." },
  { icon: Search, title: "SEO", desc: "Local search ranking optimization." },
  { icon: MonitorSmartphone, title: "Responsive Design", desc: "Pixel-perfect on all devices." },
  { icon: LineChart, title: "Conversion Optimization", desc: "Turning visitors into leads." },
  { icon: Megaphone, title: "Ad Creative Posters", desc: "Engaging social media graphics." },
  { icon: Code, title: "Website Audits", desc: "Performance & UX evaluations." },
];

export default function About() {
  return (
    <PageTransition>
      {/* Header */}
      <section className="pt-24 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Meet Harsh
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Founder of <span className="text-primary font-semibold">HarshDigitalStudios</span> — a modern AI-powered digital studio focused on helping local businesses build premium online experiences.
          </motion.p>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border-l-2 border-gray-100 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
            
            {/* Timeline Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 transform -translate-x-1/2"></div>

            {[
              { 
                year: "The Vision", 
                title: "Empowering Local Businesses", 
                desc: "I realized that local businesses were losing customers simply because their digital presence didn't match the quality of their physical service. HarshDigitalStudios was born to bridge that gap with premium, enterprise-grade design at accessible pricing." 
              },
              { 
                year: "The Approach", 
                title: "Design Meets Automation", 
                desc: "A beautiful website isn't enough. It needs to work for you. By integrating modern AI tools, automated lead captures, and WhatsApp integrations, we turn websites into 24/7 sales machines." 
              },
              { 
                year: "The Future", 
                title: "AI-First Web Experiences", 
                desc: "As search engines evolve into AI answer engines, having a structured, fast, and SEO-optimized website is more critical than ever. We ensure our clients are ready for the future of search." 
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative mb-16 md:mb-24 flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Center Dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1.5 items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-white z-10"></div>
                </div>
                {/* Mobile Dot */}
                <div className="md:hidden absolute top-1.5 -left-10 w-4 h-4 rounded-full bg-accent ring-4 ring-white"></div>
                
                <div className="md:w-1/2 px-0 md:px-12">
                  <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">{item.year}</span>
                  <h3 className="text-2xl font-bold font-heading mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="hidden md:block md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Core Expertise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The skills we use to elevate your digital presence.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {expertise.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-[32px] border border-black/5 hover:border-accent/30 hover:bg-white transition-all shadow-sm"
              >
                <item.icon className="w-5 h-5 text-accent" />
                <span className="font-medium text-primary">{item.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading mb-6">Ready to transform your business?</h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary rounded-full hover:bg-secondary transition-all shadow-lg group"
          >
            Book Free Website Audit
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
