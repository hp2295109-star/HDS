import { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { Search, User, Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function Blog() {
  const { scrollYProgress } = useScroll();
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setReadingProgress(latest);
    });
  }, [scrollYProgress]);

  return (
    <PageTransition>
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-accent z-50 origin-left"
        style={{ width: `${readingProgress * 100}%` }}
      />

      {/* Header */}
      <section className="pt-24 pb-12 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">Our Insights</h1>
              <p className="text-gray-400">Digital strategies for local businesses.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="pl-10 pr-4 py-2.5 bg-surface border border-white/20 rounded-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-full md:w-64 transition-all"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {['All', 'SEO', 'Web Design', 'Digital Marketing', 'AI Automation'].map((cat, i) => (
              <button 
                key={i}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0 ? 'bg-white text-black' : 'bg-white/10 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 bg-transparent border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="glass-card md:p-12">
            <header className="mb-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded-full flex items-center">
                  <Tag className="w-3 h-3 mr-1" /> SEO & Strategy
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight">
                The Importance of Having a Website for Local Businesses in 2026
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" /> HarshDigitalStudios
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> July 4, 2026
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 12 min read
                </div>
              </div>
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-accent hover:prose-a:text-white">
              <p className="lead text-xl text-gray-400 mb-8">
                In an era dominated by AI search engines, instant gratification, and digital-first consumer behavior, relying solely on a social media profile or word-of-mouth is no longer sufficient for local businesses. A premium website is the cornerstone of modern digital trust.
              </p>

              <h2>The Shift in Digital Marketing</h2>
              <p>
                Just a few years ago, having a Facebook page or an Instagram profile was enough for a local bakery, gym, or salon to attract customers. Today, the landscape has fundamentally shifted. Consumers are overwhelmed with content, and they demand immediate, authoritative answers when they search for local services.
              </p>
              <p>
                When a potential customer searches for "best physiotherapist near me," they aren't looking for a social media feed; they are looking for a professional presence that validates expertise, provides clear pricing, and allows for instant booking.
              </p>

              <h2>Google Rankings and Local SEO</h2>
              <p>
                Search Engine Optimization (SEO) remains the most powerful driver of high-intent traffic. A custom website allows you to structure your business data using semantic HTML and schema markup. This tells Google exactly who you are, what you do, and where you are located.
              </p>
              <p>
                Without a website, you are completely at the mercy of third-party platforms. A website is a digital asset that you own entirely, serving as the central hub for your local SEO strategy and Google Business Profile integration.
              </p>

              <h2>The Rise of AI Search</h2>
              <p>
                With the advent of AI answer engines (like ChatGPT, Gemini, and AI Overviews), how information is retrieved is changing. These AI models do not typically scrape social media profiles to formulate definitive answers about local businesses. Instead, they rely on well-structured, authoritative websites.
              </p>
              <p>
                If your business does not have a website with clear headings, descriptive content, and structured data, you will be invisible to the next generation of AI-driven search.
              </p>

              <h2>Website vs. Social Media</h2>
              <ul>
                <li><strong>Control:</strong> You control the narrative, the layout, and the user journey on a website. Social media algorithms dictate who sees your content.</li>
                <li><strong>Permanence:</strong> A blog post or a service page on a website generates SEO value for years. A social media post disappears from feeds within 48 hours.</li>
                <li><strong>Trust:</strong> 75% of consumers judge a business's credibility based on its website design. A premium design signals a premium service.</li>
              </ul>

              <h2>Lead Generation and Conversion Optimization</h2>
              <p>
                The ultimate goal of a business website is not just to look pretty, but to convert visitors into paying customers. Modern websites utilize conversion rate optimization (CRO) strategies such as:
              </p>
              <ul>
                <li>Strategic placement of CTA (Call to Action) buttons.</li>
                <li>Frictionless contact forms.</li>
                <li>Instant WhatsApp integration for immediate communication.</li>
                <li>Social proof through structured testimonials.</li>
              </ul>

              <h2>The Future of AI Websites</h2>
              <p>
                As we look ahead, websites are becoming interactive experiences. Integrating AI chatbots that can answer customer FAQs at 2 AM, or automated booking systems that sync with your calendar, means your website literally works while you sleep.
              </p>

              <h2>Conclusion</h2>
              <p>
                Investing in a premium website is no longer an optional luxury; it is a fundamental requirement for survival and growth in the modern local business landscape. It builds trust, drives organic traffic, and automates your lead generation.
              </p>
            </div>

            <div className="mt-12 text-center bg-surface rounded-[32px] p-8">
              <h3 className="text-2xl font-bold font-heading mb-4">Ready to upgrade your digital presence?</h3>
              <p className="text-gray-400 mb-6">Let's build a website that works as hard as you do.</p>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-surface rounded-full hover:bg-white/10 transition-all shadow-lg group"
              >
                Book Free Website Audit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
