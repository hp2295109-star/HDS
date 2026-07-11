import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, User, Clock, Calendar, ArrowLeft, Tag, CheckCircle2, ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

interface Article {
  id: string;
  title: string;
  category: string;
  tag: string;
  readTime: string;
  date: string;
  author: string;
  snippet: string;
  introduction: string;
  sections: {
    heading: string;
    subheading?: string;
    content: string[];
    listItems?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  conclusion: string;
  waText: string;
}

const blogArticles: Article[] = [
  {
    id: "raigarh-local-business-website-2026",
    title: "Why Every Local Business in Raigarh Needs a Professional Website in 2026",
    category: "Web Design",
    tag: "Website Development",
    readTime: "12 min read",
    date: "July 10, 2026",
    author: "Harsh Patel",
    snippet: "Relying on word-of-mouth or social media is no longer enough for local businesses in Raigarh. Explore how a professional, SEO-optimized business website drives high-intent client inquiries 24/7.",
    introduction: "Raigarh, Chhattisgarh is undergoing a massive digital shift. From local retail outlets near Subhash Chowk to healthcare clinics in Kelo Vihar, local business owners are realizing that word-of-mouth and simple social media profiles are no longer sufficient to guarantee sustainable growth. In 2026, over 93% of customer journeys start with a search on Google or AI engines. If your business doesn't own a mobile responsive website, you are invisible to the highest-paying customers in your area. This comprehensive guide covers why a professional website design is your most valuable asset, how it builds digital trust, and how local search optimization changes the customer acquisition game.",
    sections: [
      {
        heading: "The Myth of Social Media Sufficiency",
        subheading: "Why owning your digital asset beats renting social space",
        content: [
          "Many local business owners in Raigarh make the mistake of believing that a free Facebook page or an Instagram handle is a complete substitute for website development. While social platforms are great for engagement, they come with fatal flaws: algorithmic lockouts, lack of control, and poor search intent.",
          "On Instagram, users are casually scrolling through a feed of photos. They are not actively looking to hire or buy. However, when someone searches Google for 'best clinical dermatologist in Raigarh' or 'premium salon near me', they have extreme buying intent. They want a fast, informative, and authoritative local business website that displays service menus, pricing, contact details, and booking forms immediately.",
          "Moreover, a website is a digital asset you own entirely. Facebook or Instagram can change their reach algorithms overnight, rendering your accumulated followers virtually unreachable unless you pay for expensive ads. A website remains your secure, permanent digital home."
        ]
      },
      {
        heading: "Building Digital Trust & Brand Credibility in Chhattisgarh",
        subheading: "First impressions are made in milliseconds",
        content: [
          "In a competitive market like Raigarh, credibility is everything. When a prospective customer hears about your service from a friend, the first action they take is searching your brand name online. If nothing professional appears, or if they only see a poorly formatted directory page, their trust drops.",
          "A premium, fast-loading business website designed with clear typography and structured spacing signals that you are an established, professional operator. It acts as an online showroom where you showcase your actual work, highlight customer testimonials honestly, and detail your certifications. For salons, jewelry stores, and manufacturing businesses alike, a premium design makes you stand out from local competitors who rely on outdated marketing channels."
        ]
      },
      {
        heading: "Crucial Elements of a High-Converting Local Business Website",
        content: [
          "To convert passive local visitors into paying customers, your website must be designed with deliberate user-experience (UX) principles. It must not just look pretty—it must perform.",
          "Here is a table summarizing the vital elements every local business website needs to build trust and capture high-intent inquiries:"
        ],
        table: {
          headers: ["Key Feature", "Why It Matters", "Business Impact"],
          rows: [
            ["Mobile Responsive Website", "Over 85% of local searches in Raigarh are done on smartphones.", "Higher Google rankings, lower bounce rates."],
            ["Visible Call-To-Actions (CTAs)", "Tells visitors exactly what to do (e.g., 'Book Appointment' or 'Call Now').", "Directly increases leads and customer inquiries."],
            ["Google Maps & Address", "Shows Google and local customers your exact operating location.", "Builds instant local trust and drives in-store visits."],
            ["WhatsApp Ordering / Chat", "Enables direct, friction-free customer support.", "Saves time and closes deals within minutes."]
          ]
        }
      },
      {
        heading: "The Power of Local SEO and Google Visibility",
        subheading: "Be the answer when clients search 'near me'",
        content: [
          "Search Engine Optimization (SEO) is the process of styling and structuring your website content so search engines understand your relevance. For businesses in Raigarh, local SEO is the holy grail. When your website is optimized with local keywords (like 'Website Designer in Raigarh' or 'SEO Services in Raigarh'), Google associates your business with the geographic region.",
          "By coupling website development with Google Business Profile optimization, you dominate the 'Local 3-Pack'—the map results that appear at the very top of Google searches. This delivers a continuous stream of organic, high-converting traffic without spending thousands on temporary newspaper advertisements or pamphlet distributions."
        ]
      },
      {
        heading: "Future-Proofing Your Business for AI Search Engines",
        subheading: "Gemini and ChatGPT are changing how information is found",
        content: [
          "As we move further into 2026, the rise of AI-powered search engines like Google Gemini, ChatGPT, and perplexity is reshaping search behavior. These systems do not scrape social media feeds or unverified local listings to answer queries. Instead, they fetch answers from structured, schema-compliant, fast websites.",
          "If your business lacks a professional website with structured metadata, you will remain completely invisible to the next generation of AI-driven consumers. Website development with correct semantic HTML is no longer an optional upgrade—it is a critical requirement for business survival."
        ]
      }
    ],
    faqs: [
      {
        q: "What is the cost of website development in Raigarh?",
        a: "At Harsh Digital Studios, we offer transparent pricing starting from basic single-page landing pages to complete, multi-page business websites with custom AI & WhatsApp integrations. Contact us for a free personalized quote."
      },
      {
        q: "How long does it take to design and launch a local business website?",
        a: "A typical high-performance business website takes between 2 to 4 weeks depending on the complexity of features, content structure, and customized integrations."
      },
      {
        q: "Do I need a website if I already have 10k+ followers on Instagram?",
        a: "Yes. Instagram followers do not equal ownership. A website enables you to capture email lists, run highly-targeted search engine optimization campaigns, secure your brand's digital presence, and build deep credibility that social channels cannot match."
      },
      {
        q: "Will my website look good on mobile screens?",
        a: "Absolutely. All websites engineered by Harsh Digital Studios are mobile-first, ensuring smooth layouts, optimized speeds, and responsive elements on every device."
      }
    ],
    conclusion: "In 2026, a professional website is not just a digital business card; it is the heartbeat of your digital presence. For businesses in Raigarh, Chhattisgarh, investing in professional website development and local SEO is the fastest way to build credibility, rank high on Google search results, and secure consistent customer enquiries. Don't let your competitors capture your local market.",
    waText: "Hello Harsh Digital Studios, I read your article about why local businesses in Raigarh need websites. Let's discuss a custom solution for my business!"
  },
  {
    id: "google-business-profile-optimization-guide-2026",
    title: "Google Business Profile Optimization: The Complete Guide for Local Businesses",
    category: "SEO",
    tag: "Local SEO & GMB",
    readTime: "14 min read",
    date: "July 8, 2026",
    author: "Harsh Patel",
    snippet: "Discover how to optimize your Google Business Profile (formerly GMB) to dominate Google Maps, attract local customers, build credibility, and generate phone calls and store visits in Raigarh.",
    introduction: "If you run a physical showroom, clinic, salon, restaurant, or service business in Raigarh, Chhattisgarh, there is one free tool that can generate more leads than almost any other: Google Business Profile (GBP). Formerly known as Google My Business, a fully optimized profile is the foundation of local SEO. When people look for services in their immediate vicinity, Google rewards verified and fully optimized business listings in the Map section. This absolute blueprint guide outlines the steps to claim, optimize, and dominate Google Maps searches in Raigarh using natural authority, local keywords, and customer trust signals.",
    sections: [
      {
        heading: "What is Google Business Profile and Why is It Critical?",
        subheading: "The gateway to local map searches",
        content: [
          "When a user searches for 'best jewelry store near me' or 'physiotherapy clinic in Raigarh', Google displays a map showing three local businesses right below the search bar. This is called the 'Google Map Pack' or 'Local 3-Pack'. More than 60% of all clicks go directly to these three listings.",
          "Your Google Business Profile is the source of truth that feeds these map results. If your listing is inactive, lacks reviews, has incorrect contact information, or isn't optimized for local SEO, you are actively giving away hot leads to your direct competitors.",
          "Optimizing your profile is the fastest, most cost-effective way to get phone calls, driving directions, and direct website visits from buyers ready to transact immediately."
        ]
      },
      {
        heading: "The Essential Optimization Checklist for Google Maps Dominance",
        subheading: "Simple adjustments that yield massive ranking shifts",
        content: [
          "To outrank competitors who have been listed for years, you must pay attention to details that Google's algorithm loves. Many businesses make the mistake of simply creating a profile and leaving it untouched.",
          "Here are the absolute primary optimization pillars you must execute to elevate your search engine visibility:"
        ],
        listItems: [
          "1. Claim and Verify Your Profile: Ensure your business is 100% verified via video or postcard to establish ownership.",
          "2. Exact Business Name: Use your real business name. Avoid stuffing random spam keywords into the title, as Google's algorithm penalizes keyword stuffing. Focus on professional authority.",
          "3. Select Precise Primary & Secondary Categories: If you are a dental clinic, set 'Dentist' as your primary category. Add related secondary categories like 'Dental Clinic' or 'Cosmetic Dentist'. This is a massive ranking factor.",
          "4. Match Contact Details Perfectly: Your address, phone number, and website URL must match perfectly across the internet (this is called NAP consistency).",
          "5. Write a Strategic, Natural Description: Utilize up to 750 characters to describe your business history, specialized services, and location (e.g. serving Raigarh, Chhattisgarh) naturally.",
          "6. Geo-Targeted High-Quality Photos: Regularly upload high-resolution photos of your storefront, products, and team. Photos with local EXIF metadata tell Google's algorithm your business is highly active in the area."
        ]
      },
      {
        heading: "Unlocking the Reviews Engine",
        subheading: "How authentic customer feedback builds trust and ranking power",
        content: [
          "Reviews are not just social proof; they are one of the most powerful ranking signals in local SEO. Google wants to recommend businesses that are highly rated and active. Profiles with frequent, high-quality 5-star reviews naturally outrank those with zero activity.",
          "To build an authentic reviews engine, make it incredibly easy for your customers to leave feedback. Generate a short 'Review Link' from your GBP dashboard and share it with happy clients via WhatsApp after a successful service.",
          "Always respond to every review—both positive and negative. It shows Google that you care about client engagement, and it shows prospective searchers that you run a responsive, professional business in Raigarh."
        ]
      },
      {
        heading: "The GBP Optimization Matrix",
        content: [
          "Let's look at how optimization factors stack up and directly translate to real-world business opportunities:"
        ],
        table: {
          headers: ["Ranking Factor", "What to Do", "Consumer Response"],
          rows: [
            ["Primary Category Match", "Select the absolute closest category to your core business.", "Shows up when users search for your industry."],
            ["Review Frequency & Rating", "Encourage weekly authentic reviews and reply to them promptly.", "Creates trust and encourages high conversion."],
            ["Visual Engagement", "Upload photos of your real office, showroom, or products weekly.", "Users stay longer and request directions."],
            ["Regular Google Updates", "Post local offers, blog updates, and events directly to your profile.", "Tells Google the business is fully active and current."]
          ]
        }
      }
    ],
    faqs: [
      {
        q: "Is Google Business Profile completely free?",
        a: "Yes. Google Business Profile is a completely free tool provided by Google to help local businesses connect with searchers in their city."
      },
      {
        q: "How do I rank #1 on Google Maps in Raigarh?",
        a: "Dominating local map search requires perfect profile completion, consistent local citation optimization, regular photo uploads, active customer review generation, and having a mobile responsive, SEO-ready website linked to your profile."
      },
      {
        q: "Can I manage my profile if I don't have a physical showroom?",
        a: "Yes. If you operate a service-based business (like a home repair or freelance agency), you can set your profile as a 'Service Area Business' and hide your home address while specifying the cities you serve."
      },
      {
        q: "What should I do if my profile gets suspended?",
        a: "Suspensions usually occur due to name spamming, changing addresses too frequently, or violating guidelines. Ensure your NAP details are accurate, keep your business name clean, and submit a reinstatement request with physical proof of business registration."
      }
    ],
    conclusion: "Optimizing your Google Business Profile is the absolute lowest-hanging fruit in local search engine optimization. When done correctly alongside a fast, professional website, it creates a robust marketing ecosystem that keeps your phone ringing with local customer enquiries. Take control of your local search presence today.",
    waText: "Hello Harsh Digital Studios, I want to optimize my Google Business Profile and local SEO rankings. Let's discuss how you can help my business grow!"
  },
  {
    id: "website-vs-instagram-for-local-business-2026",
    title: "Website vs Instagram: Which One Actually Brings More Customers?",
    category: "Digital Marketing",
    tag: "Marketing Strategy",
    readTime: "11 min read",
    date: "July 5, 2026",
    author: "Harsh Patel",
    snippet: "Compare social media marketing with a custom business website. Learn why high-intent Google search traffic delivers far better conversions, and how to combine both for maximum business growth.",
    introduction: "In 2026, when local business owners in Raigarh look to establish an online digital presence, they often find themselves at a crossroads: Should they put all their effort into building an Instagram page, or should they invest in professional website development? With social media platforms promising instant visual reach and websites requiring a professional layout, it's easy to get confused. This data-backed comparative analysis explores the conversion rates, user behavior, and long-term search engine value of both assets, explaining why search-intent beats passive impulse scrolling every single time, and how you should build a hybrid marketing funnel to win Chhattisgarh's local market.",
    sections: [
      {
        heading: "The Battle of Intent: Search vs Scrolling",
        subheading: "Understanding the buyer's psychology",
        content: [
          "The core difference between a custom website and an Instagram feed lies in the psychology of the user. When someone is browsing Instagram, they are in passive consumer mode. They are looking at friends' vacation photos, memes, or trending video reels. If they see your post about premium salon packages or local clinic services, it is an interruption. This is called 'disruptive marketing'.",
          "On the other hand, when a consumer opens Google and types 'best dental doctor in Raigarh' or 'website development agency near me', they are in active buyer mode. They are experiencing a direct problem and are actively searching for a professional solution. This is called 'high-intent inbound traffic'.",
          "Because of this fundamental difference in psychology, traffic originating from search engines and arriving on a professional business website converts into paying leads at a rate 5x to 10x higher than social media link clicks."
        ]
      },
      {
        heading: "Comparative Matrix: Social Media vs. Owned Website",
        content: [
          "Let's compare the key attributes of both marketing models to understand where your time and budget are best spent:"
        ],
        table: {
          headers: ["Attribute", "Instagram / Social Media", "Custom Professional Website"],
          rows: [
            ["Ownership & Control", "Zero. You rent space on Meta's servers. Algorithms dictate reach.", "100%. You own the domain, layout, and data entirely."],
            ["Content Durability", "Extremely short. Posts lose engagement after 24 to 48 hours.", "Infinite. SEO articles and service pages drive traffic for years."],
            ["Search Visibility", "Virtually none. Social posts are not indexed by search engines.", "Excellent. Fully indexed on Google and ready for AI search engines."],
            ["Lead Optimization", "Limited. Only a single bio link is allowed; no custom forms.", "Limitless. Custom appointment schedulers, CRM sync, WhatsApp integrations."]
          ]
        }
      },
      {
        heading: "The Algorithm Trap",
        subheading: "Why organic social media reach is steadily declining",
        content: [
          "For years, social media platforms allowed local businesses to enjoy free, organic reach to connect with local fans. However, as these networks matured, they shifted to a pay-to-play model. Today, the organic reach of an Instagram business post is less than 3% of your total follower base.",
          "This means if you have 5,000 local followers, less than 150 of them will actually see your new posts unless you pay for sponsored Meta Ads. You are trapped in a cycle of constant content creation just to maintain minimal visibility.",
          "A custom, mobile responsive website with strong local SEO value is a permanent asset. Once a high-quality service page ranks on the first page of Google, it brings in high-intent visitors week after week, month after month, with absolutely zero ad spend required."
        ]
      },
      {
        heading: "The Hybrid Winning Strategy for Raigarh Businesses",
        subheading: "Combine the visual spark with the conversion engine",
        content: [
          "Does this mean you should delete your Instagram account? Absolutely not. The most successful local brands in Raigarh, Chhattisgarh use a powerful hybrid funnel:",
          "Use Instagram to build top-of-funnel awareness. Capture casual local attention with short reels showcasing your shop, team, or happy clients. But, instead of trying to close sales in the chaotic DMs, funnel those users directly to your highly optimized website.",
          "By linking your Instagram bio to a clean, professional landing page featuring custom trust badges, a detailed portfolio, and automated booking forms, you turn raw, curious traffic into verified customers."
        ]
      }
    ],
    faqs: [
      {
        q: "Should a new local business start with a website or Instagram?",
        a: "If you have a limited budget, start with a highly-optimized Google Business Profile and a fast, single-page professional website to capture active searchers. This generates immediate revenue which can then be reinvested into creative social media content."
      },
      {
        q: "Why do website leads convert better than Instagram DMs?",
        a: "Website visitors are actively searching for a service and encounter structured trust markers (testimonials, clear pricing, service details, FAQs) in a dedicated environment without social media distractions."
      },
      {
        q: "Can I build my own website using free builders?",
        a: "While DIY builders exist, they often produce bloated, slow-loading pages that fail Google's Core Web Vitals and lack proper Local SEO structures. Professional website development ensures custom speed optimization, clean code, and premium conversion design."
      }
    ],
    conclusion: "Relying solely on Instagram leaves your business vulnerable to algorithm shifts and limits your visibility to passive browsers. A custom professional website acts as your permanent, high-converting digital headquarters on Google. When paired with active social media profiles, you create a dominant marketing system that captures all corners of the digital market in Raigarh.",
    waText: "Hello Harsh Digital Studios, I read your comparative analysis of Websites vs Instagram. I want to build a high-converting website funnel for my local business!"
  },
  {
    id: "how-ai-helps-local-businesses-scale-2026",
    title: "How AI Is Helping Local Businesses Save Time and Generate More Leads",
    category: "AI Automation",
    tag: "Business Automation",
    readTime: "13 min read",
    date: "July 2, 2026",
    author: "Harsh Patel",
    snippet: "Demystify AI for local commerce. Explore how intelligent WhatsApp automation, automated appointment booking, and smart customer support tools scale local businesses in Raigarh while saving hours.",
    introduction: "There is a massive misconception among local business owners in Raigarh that Artificial Intelligence (AI) and automation are only reserved for multi-million dollar tech corporations in Silicon Valley. The truth is, in 2026, AI has become the ultimate equalizer. For local clinics, retail shops, salons, and manufacturers in Chhattisgarh, incorporating simple AI-powered integrations and custom automation can completely replace tedious admin work, secure customer inquiries instantly, and provide customer support 24/7. This absolute guide breaks down practical ways local enterprises are scaling operations, saving valuable hours, and dramatically multiplying leads using modern AI and WhatsApp solutions.",
    sections: [
      {
        heading: "What Does AI Automation Look Like for a Local Business?",
        subheading: "Moving past the tech jargon to real business impact",
        content: [
          "AI for a local store doesn't mean humanoid robots; it means setting up smart, responsive software workflows that run in the background of your digital presence.",
          "Think about how many customer inquiries you miss because a client messages your business at 10 PM on a Sunday asking about service availability or booking slots. By the time you open the message on Monday morning, that lead has already contacted three other competitors and booked elsewhere.",
          "AI automation solves this by acting as your digital receptionist. A smart web portal or automated messaging script can greet customers, answer precise questions about your services, display pricing sheets, and automatically schedule bookings—completely hands-free while you sleep."
        ]
      },
      {
        heading: "The Power of WhatsApp Business Automation",
        subheading: "Meet your customers on India's most popular communication app",
        content: [
          "In India, WhatsApp is more than a messaging app; it is the primary communication ecosystem. Over 95% of internet users in Raigarh utilize WhatsApp daily. By integrating your business website with intelligent WhatsApp automation, you create a direct line of communication that is incredibly responsive.",
          "When a prospect clicks 'Explore Solution' or 'Contact' on your mobile responsive website, they are instantly redirected to WhatsApp with a pre-filled, targeted text. From there, an automated responder can offer instant support, direct them to your digital menu/catalog, or trigger an automated appointment scheduler.",
          "This reduces booking friction to absolute zero. No login screens, no email confirmation delays—just instant, high-trust conversation that drives transactions."
        ]
      },
      {
        heading: "3 Ways to Deploy AI to Save 15+ Hours Every Week",
        content: [
          "Local business owners are busy managing inventory, staff, and physical services. Automating administrative tasks allows you to focus on what you do best.",
          "Here is how you can deploy simple, practical AI automations today:"
        ],
        listItems: [
          "1. Smart Appointment Booking: Integrate calendar tools that automatically sync with your phone. Let clients choose open slots, make payments, and receive automated reminders. This completely eliminates manual back-and-forth calling.",
          "2. Automated FAQ Handlers: Feed your website's chatbot or WhatsApp responder with your top 20 customer questions (e.g., pricing, opening hours, location directions). Let AI answer these instantly and only escalate high-value custom requests to your personal phone.",
          "3. Instant Lead Qualification: When a prospective B2B client requests a quote, let an automated form immediately analyze their business profile and score the lead, allowing you to prioritize high-value projects."
        ]
      },
      {
        heading: "The Real ROI of Automated Customer Support",
        content: [
          "Let's look at the direct performance and lead comparison of traditional operations vs. an automated business flow:"
        ],
        table: {
          headers: ["Operational Metric", "Manual Customer Support", "AI-Powered Automation Flow"],
          rows: [
            ["Response Time", "Average of 2 to 4 hours depending on working hours.", "Instant. 24/7 responsiveness within 5 seconds."],
            ["Lead Leakage", "High. Up to 40% of late-night inquiries go completely unanswered.", "0%. Every inquiry is immediately captured and greeted."],
            ["Admin Time Spent", "10-15 hours per week of manual calling & scheduling.", "Less than 1 hour per week. Fully self-running system."],
            ["Customer Experience", "Frustrating. Customers wait for basic info like opening times.", "Exceptional. Immediate access to menus, maps, and schedules."]
          ]
        }
      }
    ],
    faqs: [
      {
        q: "Do I need complex technical knowledge to use AI automation?",
        a: "No. At Harsh Digital Studios, we build and deploy all AI-powered solutions and WhatsApp integrations for you. You only receive the completed, qualified bookings and customer conversations on your existing phone."
      },
      {
        q: "Will an automated system frustrate my local customers?",
        a: "Not at all. When designed correctly, customers appreciate immediate answers to their urgent questions (like location directions or slot availability). We keep the conversation humble, natural, and helpful, with an easy option to talk to a human at any point."
      },
      {
        q: "What tools are used for WhatsApp automation?",
        a: "We build integrations using the official WhatsApp Cloud API alongside custom webhook nodes, ensuring your business profile remains highly professional and secure."
      }
    ],
    conclusion: "Embracing AI-powered automation is the single most effective way to multiply your local business's reach and simplify daily operations in Raigarh. By implementing intelligent website integrations and WhatsApp solutions, you guarantee that no lead is ever left behind, while recovering hours of admin time every single week. Work smarter, not harder.",
    waText: "Hello Harsh Digital Studios, I'm interested in implementing smart AI and WhatsApp automation workflows for my local business in Raigarh!"
  }
];

export default function Blog() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [readingProgress, setReadingProgress] = useState(0);

  // Update reading progress bar on scroll inside detail view
  useEffect(() => {
    if (!selectedArticleId) {
      setReadingProgress(0);
      return;
    }
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedArticleId]);

  // Categories list
  const categories = ['All', 'Web Design', 'SEO', 'Digital Marketing', 'AI Automation'];

  // Filter articles based on search query and category
  const filteredArticles = blogArticles.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedArticle = blogArticles.find(a => a.id === selectedArticleId);

  // Smooth scroll back to top of page when opening or closing an article
  const handleArticleSelect = (id: string | null) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      {/* Dynamic SEO Reading Progress Bar */}
      {selectedArticleId && (
        <div 
          className="fixed top-0 left-0 h-1 bg-[#00F0FF] z-50 transition-all duration-100 origin-left"
          style={{ width: `${readingProgress * 100}%` }}
        />
      )}

      {/* Main Container */}
      <div className="min-h-screen bg-transparent relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ==================== ARTICLE LIST VIEW ==================== */}
          {!selectedArticleId ? (
            <div>
              {/* Header */}
              <div className="text-center md:text-left mb-16 max-w-4xl">
                <span className="inline-flex items-center space-x-1.5 bg-[#00F0FF]/10 text-[#00F0FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <span>Learn Digital Growth</span>
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 text-white tracking-tight">
                  Our Insights & Guides
                </h1>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
                  Practical digital marketing advice, Google visibility strategies, and website development guides crafted specifically for businesses in <span className="text-white font-semibold">Raigarh, Chhattisgarh</span>.
                </p>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..." 
                    className="pl-11 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] w-full text-sm text-white transition-all"
                  />
                </div>

                {/* Category Tags */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                        activeCategory === cat 
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-lg shadow-[#00F0FF]/10' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles Grid (4 Columns Desktop, 2 Tablet, 1 Mobile) */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {filteredArticles.map((article) => (
                    <article 
                      key={article.id}
                      className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between hover:border-[#00F0FF] hover:-translate-y-1.5 transition-all duration-300 group backdrop-blur-md shadow-sm h-full"
                    >
                      <div>
                        {/* Meta Category & Read Time */}
                        <div className="flex items-center justify-between mb-6">
                          <span className="px-3 py-1 bg-[#00F0FF]/10 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center">
                            <Tag className="w-3 h-3 mr-1" /> {article.category}
                          </span>
                          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {article.readTime}
                          </span>
                        </div>

                        {/* Article Title */}
                        <h3 className="text-xl md:text-2xl font-bold font-heading mb-4 text-white leading-snug group-hover:text-[#00F0FF] transition-colors">
                          {article.title}
                        </h3>

                        {/* Snippet Description */}
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                          {article.snippet}
                        </p>
                      </div>

                      {/* Author & Read More Button */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center font-mono font-bold text-xs">
                            HP
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{article.author}</p>
                            <p className="text-[10px] text-gray-500">{article.date}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleArticleSelect(article.id)}
                          className="inline-flex items-center text-xs font-bold text-[#00F0FF] group-hover:underline gap-1 cursor-pointer"
                        >
                          Read Article
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/[0.01] border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
                  <p className="text-gray-400 font-sans mb-4">No insights or articles matching your query.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/10"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            
            // ==================== SINGLE ARTICLE DETAIL VIEW ====================
            <div className="max-w-4xl mx-auto">
              
              {/* Back Button */}
              <button 
                onClick={() => handleArticleSelect(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#00F0FF]/10 text-white hover:text-[#00F0FF] rounded-xl text-xs font-bold mb-12 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Insights
              </button>

              {/* Article Frame */}
              {selectedArticle && (
                <article className="bg-white/[0.01] border border-white/10 rounded-[40px] p-6 md:p-12 backdrop-blur-md">
                  
                  {/* Category, Author, Published Date Metadata */}
                  <header className="mb-10 text-center border-b border-white/5 pb-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="px-3.5 py-1 bg-[#00F0FF]/10 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center">
                        <Tag className="w-3.5 h-3.5 mr-1" /> {selectedArticle.tag}
                      </span>
                    </div>
                    
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 text-white leading-tight">
                      {selectedArticle.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#00F0FF]" /> 
                        <span>Written by <span className="text-white font-semibold">{selectedArticle.author}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#00F0FF]" /> 
                        <span>Published on <span className="text-white font-semibold">{selectedArticle.date}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#00F0FF]" /> 
                        <span className="text-[#00F0FF] font-semibold">{selectedArticle.readTime}</span>
                      </div>
                    </div>
                  </header>

                  {/* Introduction */}
                  <div className="text-gray-300 text-sm md:text-base leading-relaxed font-sans mb-12 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl italic">
                    {selectedArticle.introduction}
                  </div>

                  {/* Dynamic Table of Contents */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-12">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#00F0FF] mb-4">Table of Contents</h4>
                    <ul className="space-y-2.5">
                      {selectedArticle.sections.map((section, sIdx) => (
                        <li key={sIdx}>
                          <a 
                            href={`#section-${sIdx}`}
                            className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                          >
                            <span className="text-xs text-[#00F0FF] font-mono mr-2">0{sIdx + 1}.</span>
                            <span>{section.heading}</span>
                          </a>
                        </li>
                      ))}
                      <li>
                        <a href="#article-faqs" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                          <span className="text-xs text-[#00F0FF] font-mono mr-2">0{selectedArticle.sections.length + 1}.</span>
                          <span>Frequently Asked Questions</span>
                        </a>
                      </li>
                      <li>
                        <a href="#article-conclusion" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                          <span className="text-xs text-[#00F0FF] font-mono mr-2">0{selectedArticle.sections.length + 2}.</span>
                          <span>Conclusion</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Sections Body */}
                  <div className="space-y-12">
                    {selectedArticle.sections.map((section, sIdx) => (
                      <section key={sIdx} id={`section-${sIdx}`} className="scroll-mt-24 border-b border-white/5 pb-10">
                        {/* Section Header */}
                        <div className="mb-6">
                          <span className="text-xs font-mono font-bold text-accent mb-1 block">CHAPTER 0{sIdx + 1}</span>
                          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-white">
                            {section.heading}
                          </h2>
                          {section.subheading && (
                            <p className="text-sm text-[#00F0FF] font-medium mt-1">
                              {section.subheading}
                            </p>
                          )}
                        </div>

                        {/* Content Paragraphs */}
                        <div className="space-y-4">
                          {section.content.map((p, pIdx) => (
                            <p key={pIdx} className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
                              {p}
                            </p>
                          ))}
                        </div>

                        {/* Bullet Items if defined */}
                        {section.listItems && (
                          <div className="mt-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                            <ul className="space-y-3.5">
                              {section.listItems.map((item, lIdx) => (
                                <li key={lIdx} className="text-xs md:text-sm text-gray-300 leading-relaxed flex items-start">
                                  <CheckCircle2 className="w-4 h-4 text-[#00F0FF] mr-2.5 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Responsive Data Table if defined */}
                        {section.table && (
                          <div className="mt-8 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10">
                                  <tr>
                                    {section.table.headers.map((hdr, hIdx) => (
                                      <th key={hIdx} className="px-4 md:px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-white">
                                        {hdr}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {section.table.rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-400 leading-relaxed font-sans">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </section>
                    ))}

                    {/* FAQ Area */}
                    <section id="article-faqs" className="scroll-mt-24 border-b border-white/5 pb-10">
                      <div className="mb-6">
                        <span className="text-xs font-mono font-bold text-accent mb-1 block">FAQ KNOWLEDGE BASE</span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-white">
                          Frequently Asked Questions
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {selectedArticle.faqs.map((faq, fIdx) => (
                          <div key={fIdx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm md:text-base font-bold text-[#00F0FF] mb-2 flex items-start gap-2">
                              <span>❓</span>
                              <span>{faq.q}</span>
                            </h3>
                            <p className="text-xs md:text-sm text-gray-400 leading-relaxed pl-7">
                              {faq.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Conclusion */}
                    <section id="article-conclusion" className="scroll-mt-24 pb-4">
                      <div className="mb-6">
                        <span className="text-xs font-mono font-bold text-accent mb-1 block">SUMMATION</span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-white">
                          Conclusion
                        </h2>
                      </div>
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
                        {selectedArticle.conclusion}
                      </p>
                    </section>

                  </div>

                  {/* Author Box Signature */}
                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left bg-white/[0.01] p-8 rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-secondary flex items-center justify-center font-bold text-black text-xl font-heading shadow-md">
                      HP
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">About the Author: {selectedArticle.author}</h4>
                      <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                        Harsh Patel is the founder of Harsh Digital Studios, specializing in high-performance website engineering, semantic SEO search patterns, and custom automation templates for local growth campaigns.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Article CTA Box */}
                  <div className="mt-12 text-center bg-white/[0.02] border border-[#00F0FF]/20 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#00F0FF]/5 rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-bold font-heading mb-3 text-white">
                        Let's Turn These Insights Into Real Growth
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto mb-8 leading-relaxed font-sans">
                        Stop missing potential customer calls. Connect with Harsh Digital Studios to design a premium business platform optimized to rank first on Google and capture every inquiry.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                          to="/contact" 
                          className="w-full sm:w-auto px-6 py-3.5 bg-accent text-black font-bold rounded-xl text-xs hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10"
                        >
                          Book Free Consultation
                        </Link>
                        
                        <a 
                          href={`https://wa.me/917067363208?text=${encodeURIComponent(selectedArticle.waText)}`} 
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

                </article>
              )}

              {/* Back to top footer in article */}
              <div className="text-center mt-12">
                <button 
                  onClick={() => handleArticleSelect(null)}
                  className="text-xs text-[#00F0FF] hover:underline font-bold"
                >
                  ← Back to all guides & articles
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
