import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, CheckCircle2, Globe, Lightbulb, Search, Smartphone, Users } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-5 lg:h-[800px]">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 lg:row-span-4 glass-card md:p-12 flex flex-col justify-center relative overflow-hidden group"
          >
            {/* Background Animated Blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[80px]"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -40, 0], y: [0, -50, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-support-4/20 rounded-full blur-[80px]"
              />
            </div>

            <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="1">
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4"/>
              </svg>
            </div>
            
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex w-max bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8"
              >
                Premium Web Design & AI Automation
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6 leading-[1.1]"
              >
                Build a Website That<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-accent">Works While You Sleep</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed"
              >
                Modern websites. AI automation. Beautiful user experiences. 
                Helping local businesses generate more leads and build trust online.
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
                  Book Free Website Audit
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/portfolio" 
                  className="premium-button-outline w-full sm:w-auto inline-flex items-center justify-center"
                >
                  View Portfolio
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 lg:row-span-2 bg-surface rounded-[32px] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-4xl font-bold font-heading mb-1 text-white">75%</div>
                <div className="text-white/60 text-xs uppercase tracking-widest font-semibold">Customer Trust</div>
              </div>
              <div className="bg-transparent/10 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-[400px]">
              of customers judge a business's credibility by its website. Establish a premium presence that builds immediate trust and converts visitors into leads.
            </p>
          </motion.div>

          {/* Portfolio Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 lg:row-span-2 bg-transparent border border-white/10 rounded-[32px] p-8 shadow-sm flex flex-col justify-between"
          >
            <div className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-6">Recent Success</div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-surface rounded-2xl border border-white/10 group hover:border-accent/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent to-support-3 flex items-center justify-center text-white font-bold font-heading text-lg">U</div>
                <div>
                  <div className="text-sm font-bold text-white">Unique Salon</div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Beauty & Wellness</div>
                </div>
                <div className="flex-1"></div>
                <a href="https://uniquesalons.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-accent text-xs font-bold flex items-center group-hover:underline">
                  Live <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-surface rounded-2xl border border-white/10 group hover:border-accent/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-support-2 to-support-4 flex items-center justify-center text-white font-bold font-heading text-lg">M</div>
                <div>
                  <div className="text-sm font-bold text-white">The Muscle Gym</div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Fitness Center</div>
                </div>
                <div className="flex-1"></div>
                <a href="https://themuscle.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-accent text-xs font-bold flex items-center group-hover:underline">
                  Live <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 lg:row-span-2 bg-accent rounded-[32px] p-8 text-white flex flex-col justify-between group overflow-hidden relative shadow-sm"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Globe className="w-24 h-24" />
            </div>
            <div className="text-lg font-bold relative z-10">Starter Launch</div>
            <div className="relative z-10 mt-12 lg:mt-0">
              <div className="text-4xl font-bold font-heading mb-2">₹7000+</div>
              <div className="text-white/90 text-sm leading-relaxed max-w-[80%]">
                Perfect for local businesses starting their digital journey.
              </div>
            </div>
          </motion.div>

          {/* Top Service */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 lg:row-span-2 bg-transparent border border-white/10 rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-sm relative group"
          >
            <div className="absolute top-6 right-6 text-accent font-bold text-xs uppercase tracking-wider">Top Service</div>
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white text-accent transition-colors">
              <Lightbulb className="w-7 h-7" />
            </div>
            <div className="text-xl font-bold font-heading mb-2 text-white">AI Automation</div>
            <div className="text-sm text-gray-400 max-w-[200px]">Streamline leads & booking with custom AI workflows.</div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 lg:row-span-2 bg-secondary rounded-[32px] p-8 text-white flex flex-col justify-between overflow-hidden relative group shadow-sm"
          >
            <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 bg-accent/30 rounded-full blur-3xl group-hover:bg-accent/40 transition-colors"></div>
            <div className="z-10">
              <div className="text-xl font-bold font-heading mb-4 text-white">Let's Connect</div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="opacity-60 text-xs uppercase tracking-widest font-bold">WA:</span>
                  <span className="font-mono text-base">+91 74708 22184</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="opacity-60 text-xs uppercase tracking-widest font-bold">IG:</span>
                  <span className="text-base">@harshdigitalstudios</span>
                </div>
              </div>
            </div>
            <a href="mailto:harshpatelyt1060@gmail.com" className="bg-transparent text-white py-3 mt-8 lg:mt-0 text-center rounded-xl font-bold text-sm z-10 hover:bg-surface transition-colors">
              Send Email
            </a>
          </motion.div>

        </div>
      </main>

      {/* Why Need Website Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Your Business Needs a Website</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Future-proof your local business with a modern digital presence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Google Visibility & SEO", desc: "Rank higher on local searches and Google Maps to be found by customers actively looking for your services." },
              { icon: CheckCircle2, title: "Trust & Branding", desc: "A premium website establishes immediate authority and differentiates you from local competitors." },
              { icon: BarChart3, title: "24x7 Sales & Lead Gen", desc: "Convert visitors into customers while you sleep with automated lead forms and WhatsApp integration." },
              { icon: Globe, title: "AI Search Readiness", desc: "Optimize your business data so modern AI search engines (like ChatGPT or Gemini) can recommend you." },
              { icon: Users, title: "Customer Reviews", desc: "Showcase your best testimonials and case studies to build social proof instantly." },
              { icon: Smartphone, title: "Mobile Optimized", desc: "Over 80% of local searches happen on mobile. We build fast, responsive experiences for every device." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/services" 
              className="inline-flex items-center text-white font-medium hover:text-accent transition-colors group"
            >
              Explore Our Services
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
