import { Link } from 'react-router-dom';
import { Search, Map, Layers, Code, Activity, Rocket, ArrowRight, MessageSquare } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Discover",
    icon: Search,
    desc: "We understand your business, goals, target audience, and challenges before starting any website development or digital presence work."
  },
  {
    number: "02",
    title: "Plan",
    icon: Map,
    desc: "We prepare the right strategy, structure, and user experience tailored specifically for your local business website and target market."
  },
  {
    number: "03",
    title: "Design",
    icon: Layers,
    desc: "We create a modern, responsive, and user-friendly interface focused on building trust, showcasing your brand, and converting visitors into customers."
  },
  {
    number: "04",
    title: "Develop",
    icon: Code,
    desc: "We build a fast, secure, mobile responsive website and SEO-ready platform using modern coding best practices."
  },
  {
    number: "05",
    title: "Review & Optimize",
    icon: Activity,
    desc: "We test everything across multiple devices, optimize speed, and configure your Google Business Profile for ultimate performance."
  },
  {
    number: "06",
    title: "Launch & Grow",
    icon: Rocket,
    desc: "After a successful launch, we accelerate your business growth through ongoing SEO, AI automation, and target-driven digital marketing."
  }
];

export default function HowWeWorkSection() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden border-t border-white/5" id="how-we-work">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
            A Simple Process That Delivers Results
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-sans">
            Every project follows a clear step-by-step workflow to ensure quality, transparency, and long-term success.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Desktop Horizontal Line Connector */}
          <div className="hidden lg:block absolute top-[68px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-accent/20 via-[#00F0FF]/40 to-secondary/20 pointer-events-none" />

          {/* Timeline Grid */}
          {/* Desktop: 6 Columns. Tablet & Mobile: Vertical layout */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-6">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="relative group flex flex-col items-center lg:items-start text-center lg:text-left">
                  
                  {/* Step Icon & Number Indicator */}
                  <div className="relative z-10 flex flex-col items-center lg:items-start mb-6">
                    <div className="w-16 h-16 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#00F0FF] group-hover:border-[#00F0FF] group-hover:bg-[#00F0FF]/5 group-hover:-translate-y-[5px] transition-all duration-300 shadow-sm relative">
                      <IconComponent className="w-7 h-7 group-hover:scale-105 transition-transform duration-300" />
                      
                      {/* Step Number Badge */}
                      <span className="absolute -top-2.5 -right-2.5 bg-neutral-900 border border-white/10 text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded-full">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Tablet/Mobile Vertical Line Connector */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden absolute top-[74px] bottom-[-48px] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#00F0FF]/30 to-transparent pointer-events-none" />
                  )}

                  {/* Content Container */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 lg:p-0 lg:bg-transparent lg:border-0 lg:rounded-none group-hover:border-[#00F0FF]/20 transition-all duration-300 w-full max-w-sm lg:max-w-none">
                    <h3 className="text-lg font-bold font-heading mb-2 text-white group-hover:text-[#00F0FF] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-20 bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-md max-w-3xl mx-auto">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold font-heading mb-3 text-white">
              Ready to start your project?
            </h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto mb-8 leading-relaxed font-sans">
              Let's craft an industry-leading digital presence and SEO plan that helps your business grow and stand out in search results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-6 py-3.5 bg-accent text-black font-bold rounded-xl text-xs hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10"
              >
                Book Free Consultation
              </Link>
              <a 
                href="https://wa.me/917067363208?text=Hello%20Harsh%20Digital%20Studios%2C%20I%20would%20like%20to%20discuss%20a%20new%20project%20with%20you%21" 
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
