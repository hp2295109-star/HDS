import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Pricing() {
  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Premium quality websites at accessible prices for local businesses.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
            
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold font-heading mb-2">Starter Launch</h3>
                <p className="text-gray-400 text-sm mb-6">Best For: New Local Businesses</p>
                <div className="text-4xl font-bold font-heading">₹7k<span className="text-lg text-gray-400 font-normal"> - 10k</span></div>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {["1 Landing Page", "Responsive Design", "WhatsApp Integration", "Click to Call", "Contact Form", "Basic SEO", "Google Maps", "Social Links", "7 Days Support", "Customizations based on requirements"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5 mr-3">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-gray-400 text-sm">{feature}</span>
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

            {/* Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card shadow-xl relative flex flex-col transform md:-translate-y-4"
            >
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-accent text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                Most Popular
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold font-heading mb-2">Growth Website</h3>
                <p className="text-gray-400 text-sm mb-6">Best For: Gym, Dental, Bakery, Jewellery</p>
                <div className="text-4xl font-bold font-heading">₹11k<span className="text-lg text-gray-400 font-normal"> - 15k</span></div>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {["4 Pages (Home, About, Services, Contact)", "Premium UI", "Lead Form", "WhatsApp Integration", "Blog Ready", "Speed Optimization", "Basic SEO"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 mr-3">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link 
                to="/contact" 
                className="premium-button w-full inline-flex items-center justify-center text-sm group"
              >
                Book Free Website Audit
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

          {/* Add-On Services */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-heading mb-4">Add-On Services</h2>
              <p className="text-gray-400">Enhance your digital presence with specialized tools.</p>
            </div>
            
            <div className="glass-card sm:p-10">
              <div className="divide-y divide-gray-100">
                {[
                  { name: "Google Business Profile Setup", price: "₹2,999", type: "One-time" },
                  { name: "Local SEO", price: "₹4,999", type: "per month" },
                  { name: "Website Maintenance", price: "₹1,999", type: "per month" },
                  { name: "Meta Ads Setup", price: "₹4,999", type: "One-time" },
                  { name: "AI Chatbot Integration", price: "₹5,999", type: "One-time" },
                  { name: "Professional Product Upload", price: "₹2,999", type: "One-time" }
                ].map((addon, index) => (
                  <div key={index} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="font-medium text-white">{addon.name}</span>
                    <div className="flex items-end sm:items-center gap-2">
                      <span className="font-bold font-heading text-lg">{addon.price}</span>
                      <span className="text-sm text-gray-400 w-20 text-right sm:text-left">{addon.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
