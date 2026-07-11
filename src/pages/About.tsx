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
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight"
          >
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-support-4">Harsh</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Founder of <span className="text-white font-semibold">Harsh Digital Studios</span> — leading professional website designer and local SEO specialist empowering businesses across <span className="text-accent">Raigarh, Chhattisgarh</span> with high-performance digital marketing platforms.
          </motion.p>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border-l-2 border-white/10 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
            
            {/* Timeline Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 transform -translate-x-1/2"></div>

            {[
              { 
                year: "The Mission", 
                title: "Empowering Local Commerce in Raigarh", 
                desc: "I observed that remarkable local showrooms, clinics, salons, and businesses across Chhattisgarh were losing local market share simply because their online presence didn't match the premium quality of their real-world service. Harsh Digital Studios was founded to bridge this gap with professional website development in Raigarh, raising the bar for local digital credibility.",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              { 
                year: "The Innovation", 
                title: "Premium Website Development & AI Systems", 
                desc: "A beautiful design is only half the battle. To turn searchers into long-term clients, your business needs a high-performance system. We engineer custom mobile-responsive web portals, landing page designs, and integrate intelligent automated WhatsApp messaging to make sure every visitor can connect with your brand instantly.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              { 
                year: "The Local Impact", 
                title: "Dominating Google Business & Search Engines", 
                desc: "With the rise of local 'near me' searches, appearing on top of Google Maps and local search packs is the single most valuable source of high-intent buyers. We deliver complete local SEO services and Google Business Profile optimization to help local Raigarh enterprises win sustainable, long-term visibility without continuous high advertising fees.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`group relative mb-16 md:mb-24 flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
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
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className={`md:w-1/2 ${'image' in item ? 'mt-8 md:mt-0' : 'hidden md:block'}`}>
                  {'image' in item && item.image && (
                    <div className="px-0 md:px-12 h-full flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="rounded-[32px] shadow-sm border border-white/10 object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Core Expertise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The skills we use to elevate your digital presence.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {expertise.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 px-6 py-4 bg-surface rounded-[32px] border border-white/10 hover:border-accent/30 hover:bg-transparent transition-all shadow-sm"
              >
                <item.icon className="w-5 h-5 text-accent" />
                <span className="font-medium text-white">{item.title}</span>
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
            className="premium-button inline-flex items-center justify-center group"
          >
            Book Free Website Audit
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
