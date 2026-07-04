import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Globe, Layout, Megaphone, MonitorSmartphone, Search } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const services = [
  {
    icon: Layout,
    title: "Website Builder & Designer",
    desc: "Custom-designed, premium websites tailored to your brand identity. We don't use cheap templates.",
    benefits: ["Custom UI/UX", "Conversion Focused", "Brand Aligned"]
  },
  {
    icon: Bot,
    title: "AI Automation",
    desc: "Integrate smart chatbots and automated lead generation flows to capture customers 24/7.",
    benefits: ["24/7 Lead Capture", "WhatsApp Bots", "Instant Replies"]
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive Websites",
    desc: "Your website will look pixel-perfect and load blazingly fast on every device, from mobile to 4K displays.",
    benefits: ["Mobile-First", "Fast Loading", "Cross-Browser"]
  },
  {
    icon: Globe,
    title: "Custom Domain",
    desc: "Establish your professional identity with a custom .com or .in domain name for your business.",
    benefits: ["Professional Email", "Brand Trust", "Easy to Remember"]
  },
  {
    icon: Code,
    title: "Free Hosting",
    desc: "We provide secure, blazing-fast hosting so you never have to worry about servers or uptime.",
    benefits: ["99.9% Uptime", "SSL Certificate", "Global CDN"]
  },
  {
    icon: Search,
    title: "Website Audit",
    desc: "Comprehensive analysis of your current website's speed, SEO, and user experience.",
    benefits: ["Speed Test", "SEO Report", "Actionable Plan"]
  },
  {
    icon: Megaphone,
    title: "Ad Creative Posters",
    desc: "Eye-catching, scroll-stopping social media graphics designed to convert views into clicks.",
    benefits: ["Instagram Ready", "Facebook Ads", "High Conversion"]
  }
];

export default function Services() {
  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Premium Digital Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to build, scale, and automate your local business online.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white text-accent transition-colors">
                  <service.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold font-heading mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {service.desc}
                </p>
                
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link 
                  to="/contact" 
                  className="premium-button-outline w-full inline-flex items-center justify-center text-sm group"
                >
                  Book Free Website Audit
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
