import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Laptop, MapPin, Megaphone, Bot, Sparkles, 
  ShieldCheck, CheckCircle2, MessageSquare 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const servicesData = [
  {
    icon: Laptop,
    title: "Premium Website Development",
    desc: "Build fast, responsive and professional websites that create trust and convert visitors into customers.",
    features: [
      "Mobile Responsive",
      "Fast Loading",
      "SEO Ready"
    ],
    link: "/contact?service=website"
  },
  {
    icon: MapPin,
    title: "Local SEO & Google Visibility",
    desc: "Help your business appear on Google Search and Google Maps so nearby customers can easily find you.",
    features: [
      "Local SEO",
      "Google Business Profile",
      "Search Optimization"
    ],
    link: "/contact?service=seo"
  },
  {
    icon: Megaphone,
    title: "Meta Ads & Lead Generation",
    desc: "Reach the right audience with targeted Facebook and Instagram advertising campaigns.",
    features: [
      "Audience Targeting",
      "Lead Campaigns",
      "Performance Tracking"
    ],
    link: "/contact?service=ads"
  },
  {
    icon: Bot,
    title: "AI Automation",
    desc: "Automate customer enquiries, follow-ups and repetitive business tasks using AI-powered workflows.",
    features: [
      "WhatsApp Automation",
      "Smart Workflows",
      "Time Saving"
    ],
    link: "/contact?service=automation"
  },
  {
    icon: Sparkles,
    title: "Social Media Branding",
    desc: "Create a professional online presence with high-quality content and consistent branding.",
    features: [
      "Content Design",
      "Reels Strategy",
      "Brand Identity"
    ],
    link: "/contact?service=branding"
  },
  {
    icon: ShieldCheck,
    title: "Website Maintenance & Support",
    desc: "Keep your website secure, updated and performing at its best.",
    features: [
      "Regular Updates",
      "Security",
      "Performance Monitoring"
    ],
    link: "/contact?service=maintenance"
  }
];

export default function Services() {
  return (
    <PageTransition>
      {/* Services Hero Section */}
      <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-1.5 bg-accent/5 border border-accent/20 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Enterprise Growth Suite</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight text-white leading-none"
          >
            Everything Your Business <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              Needs to Grow Online
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-sans"
          >
            From premium websites to AI automation, we provide complete digital solutions to help your business attract more customers and grow faster.
          </motion.p>
        </div>
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Services Grid Section */}
      <section className="pb-24 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 2 x 3 Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white/[0.02] border border-white/10 rounded-[24px] p-8 flex flex-col justify-between h-full transition-all duration-300 hover:border-accent hover:-translate-y-[5px] group shadow-sm backdrop-blur-md"
                >
                  <div>
                    {/* Premium Icon Container */}
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:bg-accent/20 transition-all duration-300">
                      <IconComponent className="w-7 h-7 group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    
                    {/* Service Title */}
                    <h3 className="text-xl font-bold font-heading mb-3 text-white">
                      {service.title}
                    </h3>
                    
                    {/* Short Description (2-3 lines) */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {service.desc}
                    </p>
                    
                    {/* 3 Key Features */}
                    <div className="border-t border-white/5 pt-6 mb-8">
                      <ul className="space-y-3">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-accent mr-3 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Learn More Button */}
                  <Link 
                    to={service.link}
                    className="w-full text-center py-3 bg-white/5 border border-white/10 hover:bg-accent hover:text-black hover:border-accent text-white rounded-xl font-semibold text-sm transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-24 bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden backdrop-blur-md max-w-4xl mx-auto">
            {/* Subtle light flair */}
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-white">
                Need a solution tailored to your business?
              </h3>
              <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed font-sans">
                Our specialists are ready to design a custom digital strategy that perfectly aligns with your goals and accelerates your market growth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/contact" 
                  className="w-full sm:w-auto px-8 py-4 bg-accent text-black font-bold rounded-xl text-sm hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10"
                >
                  Book a Free Consultation
                </Link>
                <a 
                  href="https://wa.me/917067363208" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl text-sm hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/10 inline-flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Talk on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PageTransition>
  );
}
