import { Scissors, Stethoscope, Gem, Dumbbell, Utensils, ShoppingBag, Compass, Factory, MessageSquare, CheckCircle2 } from 'lucide-react';

const WHATSAPP_NUMBER = "917067363208";

const industriesData = [
  {
    icon: Scissors,
    emoji: "💇",
    title: "Salon & Beauty",
    desc: "Professional websites that showcase your services, build trust, and increase appointment bookings.",
    features: [
      "Online Booking Integration",
      "Google Business Profile Sync",
      "Mobile Responsive Website"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Salon%20%26%20Beauty%20business.`
  },
  {
    icon: Stethoscope,
    emoji: "🏥",
    title: "Clinics & Healthcare",
    desc: "Fast, informative websites that help patients find your clinic, understand your services, and contact you easily.",
    features: [
      "Patient Appointment Forms",
      "Local SEO Google Visibility",
      "Mobile Responsive Website"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Clinics%20%26%20Healthcare%20business.`
  },
  {
    icon: Gem,
    emoji: "💍",
    title: "Jewellery Stores",
    desc: "Elegant websites designed to showcase collections, build credibility, and increase customer enquiries.",
    features: [
      "Premium Digital Catalog",
      "Local Business Website",
      "Google Business Profile Setup"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Jewellery%20Store.`
  },
  {
    icon: Dumbbell,
    emoji: "🏋️",
    title: "Gym & Fitness",
    desc: "Modern fitness websites with membership information, trainer profiles, pricing, and enquiry forms.",
    features: [
      "Membership Enquiry Forms",
      "Local Search Optimization",
      "Mobile Responsive Website"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Gym%20%26%20Fitness%20business.`
  },
  {
    icon: Utensils,
    emoji: "🍽",
    title: "Restaurants & Cafés",
    desc: "Beautiful websites with menus, gallery, online enquiries, Google Maps integration, and WhatsApp ordering.",
    features: [
      "WhatsApp Menu Ordering",
      "Google Maps Integration",
      "Local SEO & Visibility Boost"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Restaurant%20%26%20Café.`
  },
  {
    icon: ShoppingBag,
    emoji: "🛍",
    title: "Retail & Fashion",
    desc: "Professional catalog websites that help local stores display products and attract more customers.",
    features: [
      "Product Catalog Display",
      "Google Business Profile Sync",
      "Business Growth Optimization"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Retail%20%26%20Fashion%20business.`
  },
  {
    icon: Compass,
    emoji: "🚌",
    title: "Travel & Tour Agencies",
    desc: "Responsive websites that showcase travel packages, destinations, enquiry forms, and customer trust.",
    features: [
      "Package Booking Forms",
      "Mobile Responsive Website",
      "Digital Presence Accelerator"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Travel%20%26%20Tour%20Agency.`
  },
  {
    icon: Factory,
    emoji: "🏭",
    title: "Manufacturing & Local Businesses",
    desc: "Professional business websites that improve credibility, generate enquiries, and strengthen your online presence.",
    features: [
      "B2B Lead Generation",
      "SEO Google Visibility",
      "Website Development Suite"
    ],
    link: `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20a%20website%20and%20marketing%20solution%20for%20my%20Manufacturing%20%2F%20Local%20Business.`
  }
];

export default function IndustriesSection() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading & Subheading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
            Helping Local Businesses Build a Strong Digital Presence
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-sans">
            We create high-performance websites, improve Google visibility, and help businesses grow using modern digital marketing and AI-powered solutions.
          </p>
        </div>

        {/* 4 Columns Desktop, 2 Columns Tablet, 1 Column Mobile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industriesData.map((industry, index) => {
            const IconComponent = industry.icon;
            return (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/10 rounded-[24px] p-6 flex flex-col justify-between h-full transition-all duration-300 hover:border-[#00F0FF] hover:-translate-y-[5px] group shadow-sm backdrop-blur-md"
              >
                <div>
                  {/* Premium Icon with Emoji */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-[#00F0FF] group-hover:bg-[#00F0FF]/20 transition-all duration-300">
                      <IconComponent className="w-6 h-6 group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <span className="text-2xl" role="img" aria-label={industry.title}>
                      {industry.emoji}
                    </span>
                  </div>

                  {/* Industry Title */}
                  <h3 className="text-lg font-bold font-heading mb-3 text-white">
                    {industry.title}
                  </h3>

                  {/* Description (2-3 lines) */}
                  <p className="text-gray-400 text-xs leading-relaxed mb-5 min-h-[48px]">
                    {industry.desc}
                  </p>

                  {/* 3 Key Features */}
                  <div className="border-t border-white/5 pt-4 mb-6">
                    <ul className="space-y-2">
                      {industry.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] mr-2 shrink-0 animate-none" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Explore Solution Button */}
                <a
                  href={industry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 bg-white/5 border border-white/10 hover:bg-[#00F0FF] hover:text-black hover:border-[#00F0FF] text-white rounded-xl font-semibold text-xs transition-all duration-300"
                >
                  Explore Solution
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden backdrop-blur-md max-w-3xl mx-auto">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold font-heading mb-3 text-white">
              Can't find your business category?
            </h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto mb-6 leading-relaxed font-sans">
              Every business is unique, and we build custom digital solutions tailored to your goals.
            </p>
            
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Harsh%20Digital%20Studios%2C%20I'm%20interested%20in%20discussing%20a%20custom%20digital%20solution%20for%20my%20business.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-xl text-xs hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/10"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Let's Discuss Your Project</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
