import { Link } from 'react-router-dom';
import { Zap, Search, Cpu, Smartphone, Target, LifeBuoy, MessageSquare } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    emoji: "⚡",
    title: "Fast Performance",
    desc: "Every website is optimized for speed, smooth navigation, and excellent user experience. We focus on lightweight structures to ensure fast loading times across all networks."
  },
  {
    icon: Search,
    emoji: "🔍",
    title: "SEO Ready",
    desc: "We build websites following modern SEO best practices to improve visibility on Google. This includes proper schema markups, structured meta data, and local search optimization."
  },
  {
    icon: Cpu,
    emoji: "🤖",
    title: "AI Powered",
    desc: "We use AI tools and automation to improve efficiency, customer engagement, and business workflows. Automate enquiries and repetitive tasks directly through WhatsApp."
  },
  {
    icon: Smartphone,
    emoji: "📱",
    title: "Mobile First",
    desc: "Every website is fully responsive and designed to perform perfectly on every screen size. We ensure a seamless experience for your mobile visitors who constitute over 80% of traffic."
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "Conversion Focused",
    desc: "Our websites are designed to encourage enquiries, bookings, and customer actions. We focus on clear layouts, visible contact points, and intuitive user paths to turn visitors into leads."
  },
  {
    icon: LifeBuoy,
    emoji: "🛠",
    title: "Ongoing Support",
    desc: "We continue helping businesses with updates, improvements, and digital growth after launch. Rest easy knowing your website remains updated, secure, and fully supported."
  }
];

export default function WhyChooseSection() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden border-t border-white/5" id="why-choose-us">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading & Subheading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
            Why Businesses Choose Harsh Digital Studios
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-sans">
            We focus on building modern digital experiences that help businesses establish a stronger online presence and create more opportunities to grow.
          </p>
        </div>

        {/* 3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/10 rounded-[24px] p-8 flex flex-col justify-between h-full transition-all duration-300 hover:border-[#00F0FF] hover:-translate-y-[5px] group shadow-sm backdrop-blur-md"
              >
                <div>
                  {/* Premium Icon Container with Emoji */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-[#00F0FF] group-hover:bg-[#00F0FF]/20 transition-all duration-300">
                      <IconComponent className="w-6 h-6 group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <span className="text-2xl" role="img" aria-label={reason.title}>
                      {reason.emoji}
                    </span>
                  </div>

                  {/* Reason Title */}
                  <h3 className="text-xl font-bold font-heading mb-3 text-white group-hover:text-[#00F0FF] transition-colors">
                    {reason.title}
                  </h3>

                  {/* Description (2-3 lines) */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {reason.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-16 bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-md max-w-3xl mx-auto">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold font-heading mb-3 text-white">
              Have a business idea?
            </h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto mb-8 leading-relaxed font-sans">
              Let's build something that helps your business grow. Get in touch with us to design a modern website, rank higher on Google, or automate client conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-6 py-3.5 bg-accent text-black font-bold rounded-xl text-xs hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10"
              >
                Start Your Project
              </Link>
              <a 
                href="https://wa.me/917067363208?text=Hello%20Harsh%20Digital%20Studios%2C%20I%20have%20a%20business%20idea%20and%20want%20to%20start%20my%20digital%20growth%20project%21" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-xl text-xs hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/10 inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
