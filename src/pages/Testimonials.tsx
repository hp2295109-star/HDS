import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { openSaaSModal } from '../components/SaaSModals';

export default function Testimonials() {
  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Client Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            See what local business owners have to say about working with HarshDigitalStudios.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent min-h-[50vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center justify-center text-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card max-w-2xl w-full p-10 md:p-14 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
              
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-accent fill-accent" />
                ))}
              </div>
              
              <h2 className="text-3xl font-bold font-heading mb-4 text-white">Building Success Stories</h2>
              <p className="text-xl text-gray-400 mb-8 italic">
                "I'm currently helping local businesses build their online presence. As I complete more client projects, genuine testimonials and case studies will be added here."
              </p>
              
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                   <div className="text-gray-400 font-medium">You</div>
                </div>
                <div className="ml-4 text-left">
                  <div className="font-bold text-white">Your Name</div>
                  <div className="text-sm text-gray-400">Founder, Your Business</div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <button 
                  onClick={() => openSaaSModal('audit', 'Testimonials CTA', 'Testimonials Page')}
                  className="inline-flex items-center text-white font-medium hover:text-accent transition-colors group cursor-pointer"
                >
                  Book Free Website Audit To Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </PageTransition>
  );
}
