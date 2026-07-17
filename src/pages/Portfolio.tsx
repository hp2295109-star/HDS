import { motion } from 'motion/react';
import { ExternalLink, MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const projects = [
  {
    title: "Unique Salon",
    category: "Beauty & Wellness",
    type: "Demo Design" as const,
    services: ["Website Design", "Booking Integration", "Mobile Optimization"],
    url: "https://uniquesalons.netlify.app/",
    color: "from-pink-500/20 to-purple-500/20"
  },
  {
    title: "Anmol Textile",
    category: "Retail & Fashion",
    type: "Demo Design" as const,
    services: ["E-commerce UI", "Brand Identity", "Product Showcase"],
    url: "https://anmoltextile.netlify.app/",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Puja Jewellers",
    category: "Luxury Retail",
    type: "Demo Design" as const,
    services: ["Premium UI/UX", "Collection Catalog", "WhatsApp Lead Gen"],
    url: "https://pujajewellers.netlify.app/",
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    title: "The Muscle Gym",
    category: "Fitness & Health",
    type: "Demo Design" as const,
    services: ["High-Energy Design", "Membership Forms", "SEO"],
    url: "https://themuscle.netlify.app/",
    color: "from-red-500/20 to-orange-500/20"
  },
  {
    title: "Rama Aesthetics",
    category: "Skin Clinic & Wellness",
    type: "Demo Design" as const,
    services: ["Detailed treatment lists & pricing grids", "Interactive doctor slot booking requests", "High-retention post-care instruction FAQs"],
    url: "https://ramaaesthetics.netlify.app/",
    color: "from-teal-500/20 to-emerald-500/20"
  }
];

export default function Portfolio() {
  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white"
          >
            Demo Designs & Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our ready-to-deploy, high-converting demo designs customized for local businesses.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
          
          {/* Projects Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group relative overflow-hidden flex flex-col h-full !p-0"
              >
                {/* Image Placeholder */}
                <div className={`h-56 w-full bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}>
                  <div className="absolute inset-0 bg-transparent/40 backdrop-blur-[2px]"></div>
                  <div className="relative z-10 text-center">
                    <span className="text-2xl font-bold font-heading text-white">{project.title}</span>
                    <p className="text-xs text-white/70 mt-2 font-mono uppercase tracking-widest">{project.type}</p>
                  </div>
                  
                  {/* Overlay Link */}
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="flex items-center text-white font-medium px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      Visit Live Demo <ExternalLink className="w-4 h-4 ml-2" />
                    </span>
                  </a>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">{project.category}</span>
                    <span className="px-2.5 py-0.5 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] uppercase tracking-widest rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4 text-white">{project.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.services.map((service, sIndex) => (
                      <span key={sIndex} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto space-y-3">
                    {/* Live Demo Button */}
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </a>

                    {/* Request Similar Website Button */}
                    <Link 
                      to={`/contact?prefill=${encodeURIComponent(project.title)}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all text-center"
                    >
                      Request Similar Website
                    </Link>

                    {/* WhatsApp CTA */}
                    <a 
                      href={`https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20I%20want%20a%20website%20similar%20to%20the%20${encodeURIComponent(project.title)}%20demo%2E`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#25D366] hover:bg-opacity-90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp Inquiry</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sticky Contact Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 bg-transparent p-8 rounded-3xl shadow-sm border border-white/10">
              <h3 className="text-xl font-bold font-heading mb-2 text-white">Start Your Project</h3>
              <p className="text-gray-400 text-sm mb-8">Ready to build something amazing? Reach out to us directly.</p>
              
              <div className="space-y-4">
                <a 
                  href="https://wa.me/917067363208" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center w-full p-4 rounded-xl bg-white/5 hover:bg-[#25D366]/10 text-white hover:text-[#25D366] border border-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="font-medium">WhatsApp Us</div>
                </a>
                
                <a 
                  href="tel:+917067363208"
                  className="flex items-center w-full p-4 rounded-xl bg-white/5 hover:bg-accent/10 text-white hover:text-accent border border-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="font-medium">Call Us Now</div>
                </a>
                
                <a 
                  href="mailto:harshpatelyt1060@gmail.com"
                  className="flex items-center w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="font-medium">Send Email</div>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </PageTransition>
  );
}
