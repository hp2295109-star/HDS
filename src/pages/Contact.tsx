import { motion } from 'motion/react';
import { Instagram, Mail, MapPin, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Contact() {
  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to build a premium website for your local business? Let's discuss your project.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold font-heading mb-8">Contact Information</h2>
              
              <div className="space-y-6 mb-12">
                <a 
                  href="tel:+917067363208"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-surface/5 text-white rounded-xl flex items-center justify-center mr-6 group-hover:bg-surface group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Call Us Directly</p>
                    <p className="text-lg font-bold font-heading text-white">+91 70673 63208</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/917067363208"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-[#25D366]/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center mr-6 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Chat on WhatsApp</p>
                    <p className="text-lg font-bold font-heading text-white">+91 70673 63208</p>
                  </div>
                </a>

                <a 
                  href="mailto:harshpatelyt1060@gmail.com"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-surface/5 text-white rounded-xl flex items-center justify-center mr-6 group-hover:bg-surface group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Send Email</p>
                    <p className="text-lg font-bold font-heading text-white">harshpatelyt1060@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/harshdigitalstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-pink-500/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mr-6 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Follow on Instagram</p>
                    <p className="text-lg font-bold font-heading text-white">@harshdigitalstudios</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form / Map area */}
            <div className="glass-card h-full flex flex-col">
              <h3 className="text-2xl font-bold font-heading mb-6">Book Your Free Audit</h3>
              <p className="text-gray-400 mb-8">Fill out the form below or message us directly on WhatsApp to get started with your free website audit.</p>
              
              <form className="space-y-4 flex-grow flex flex-col" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 bg-surface border border-white/20 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="business" className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
                  <input type="text" id="business" className="w-full px-4 py-3 bg-surface border border-white/20 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Your Business Ltd." />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">How can we help?</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 bg-surface border border-white/20 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none" placeholder="I need a website for my new salon..."></textarea>
                </div>
                <div className="pt-4 mt-auto">
                  <button type="submit" className="w-full flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-surface rounded-xl hover:bg-white/10 transition-colors group">
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Map Placeholder */}
          <div className="mt-16 glass-card !p-0 h-96 relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/10 flex flex-col items-center justify-center text-gray-400">
                <MapPin className="w-12 h-12 mb-4 text-gray-300 group-hover:text-accent transition-colors group-hover:scale-110 duration-500" />
                <p className="font-medium">Interactive Map Placeholder</p>
                <p className="text-sm">Connect with Google Maps API</p>
             </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
