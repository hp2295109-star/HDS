import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const faqs = [
  {
    q: "Why does my business need a website?",
    a: "A website establishes instant credibility and trust. Over 90% of consumers search online before visiting a local business. A modern website acts as a 24/7 digital storefront, generating leads, displaying reviews, and helping you rank on Google searches."
  },
  {
    q: "How long does development take?",
    a: "For our Starter Launch package, development typically takes 3-5 days. For the Growth Website, it takes about 7-10 days depending on the content provided and revisions required."
  },
  {
    q: "Will it work on mobile?",
    a: "Yes. Over 80% of local searches happen on mobile devices. Every website we build is fully responsive, ensuring a pixel-perfect, fast-loading experience across smartphones, tablets, and desktop computers."
  },
  {
    q: "Can I update my website later?",
    a: "Absolutely. We build websites with scalability in mind. You can opt for our Website Maintenance add-on (₹1,999/mo) where we handle all updates for you, or request one-time updates as needed."
  },
  {
    q: "Do you provide hosting?",
    a: "Yes, we provide secure, high-speed hosting with a 99.9% uptime guarantee and SSL certificates included to ensure your website is safe and blazing fast."
  },
  {
    q: "Do you provide SEO?",
    a: "Basic SEO (on-page optimization, meta tags, heading structures) is included in all our packages. For businesses wanting to dominate local search, we offer a dedicated Local SEO monthly add-on."
  },
  {
    q: "Do you integrate WhatsApp?",
    a: "Yes, WhatsApp integration is a core feature we provide. We add floating WhatsApp buttons and direct chat links so customers can reach you instantly, increasing your lead conversion rate."
  },
  {
    q: "Can you redesign my current website?",
    a: "Yes, we often help businesses upgrade from outdated, slow websites to modern, premium, high-converting digital experiences. We'll audit your current site and propose a fresh redesign."
  },
  {
    q: "Will my website load fast?",
    a: "Speed is critical for both user experience and SEO. We optimize images, minify code, and utilize fast hosting to ensure your website loads instantly, keeping your bounce rate low."
  },
  {
    q: "Do you help with Google ranking?",
    a: "Yes. Our structural SEO best practices help index your site correctly. For active ranking growth, we offer Google Business Profile Setup and ongoing Local SEO services."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to know about our web design process.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-transparent border border-white/10 rounded-[32px] overflow-hidden shadow-sm hover:border-accent/30 transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-semibold text-white pr-4">{faq.q}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-accent/10 text-accent' : 'bg-surface text-gray-400'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-50 mt-2 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
