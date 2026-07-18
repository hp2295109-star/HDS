import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CMSHero {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaBookCall: string;
  ctaExploreDemos: string;
  stat1Value: string;
  stat1Label: string;
  stat1Desc: string;
  stat2Value: string;
  stat2Label: string;
  stat2Desc: string;
  stat3Value: string;
  stat3Label: string;
  stat3Desc: string;
  speedScore: string;
  speedLabel: string;
  speedDesc: string;
  mapRank: string;
  mapLabel: string;
  mapDesc: string;
  avatarName: string;
  avatarTitle: string;
  avatarDesc: string;
  avatarLetters: string;
}

export interface CMSTimelineItem {
  year: string;
  title: string;
  desc: string;
  image: string;
}

export interface CMSAbout {
  headerTitle: string;
  headerSubtitle: string;
  timeline: CMSTimelineItem[];
}

export interface CMSServicePillar {
  id: string;
  title: string;
  category: 'Design' | 'SEO' | 'Marketing' | 'Maintenance';
  price: string;
  desc: string;
  benefits: string[];
}

export interface CMSServices {
  heroTitle: string;
  heroSubtitle: string;
  pillars: CMSServicePillar[];
}

export interface CMSProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface CMSProcess {
  title: string;
  subtitle: string;
  steps: CMSProcessStep[];
}

export interface CMSFaqItem {
  q: string;
  a: string;
}

export interface CMSFaqs {
  title: string;
  subtitle: string;
  faqs: CMSFaqItem[];
}

export interface CMSBlogPost {
  id: string;
  title: string;
  tag: string;
  time: string;
  desc: string;
  image?: string;
  content?: string;
}

export interface CMSBlog {
  title: string;
  subtitle: string;
  posts: CMSBlogPost[];
}

export interface CMSFooter {
  description: string;
  rights: string;
}

export interface CMSContact {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  address: string;
  email: string;
  phone: string;
}

export interface CMSSocialLinks {
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface CMSVisibility {
  showHero: boolean;
  showAbout: boolean;
  showServices: boolean;
  showProcess: boolean;
  showFAQ: boolean;
  showBlog: boolean;
  showFooter: boolean;
  showContact: boolean;
  showSocials: boolean;
}

export interface CMSContent {
  hero: CMSHero;
  about: CMSAbout;
  services: CMSServices;
  process: CMSProcess;
  faqs: CMSFaqs;
  blog: CMSBlog;
  footer: CMSFooter;
  contact: CMSContact;
  socials: CMSSocialLinks;
  visibility: CMSVisibility;
}

export const defaultCMSContent: CMSContent = {
  hero: {
    badge: "MBA Marketer & Professional Web Designer",
    titleLine1: "Stop Posting.",
    titleLine2: "Start Building Your Local Brand.",
    subtitle: "I help business owners in Raigarh, Tamnar, and Kharsia double their customer bookings with premium website designs, local Google Maps ranking, and high-impact search strategies. Zero agency bloat. Pure results.",
    ctaBookCall: "Book Free Strategy Call",
    ctaExploreDemos: "Explore Demo Designs",
    stat1Value: "100%",
    stat1Label: "Speed Index",
    stat1Desc: "Lighthouse mobile optimization",
    stat2Value: "2.4x",
    stat2Label: "Lead Multiplier",
    stat2Desc: "Conversion-optimized design",
    stat3Value: "1-on-1",
    stat3Label: "Direct Access",
    stat3Desc: "Zero account-manager bloat",
    speedScore: "99+",
    speedLabel: "Lighthouse Score",
    speedDesc: "Lightweight clean code beats heavy templates.",
    mapRank: "#1 Pack",
    mapLabel: "Local Map Domination",
    mapDesc: "Be the answer when clients search \"near me\".",
    avatarName: "Harsh Patel, MBA Marketing",
    avatarTitle: "ABOUT THE FREELANCER",
    avatarDesc: "Combining deep strategic consumer psychology with clean, performance-optimized code files.",
    avatarLetters: "HP"
  },
  about: {
    headerTitle: "Meet Harsh",
    headerSubtitle: "Founder of Harsh Digital Studios — leading professional website designer and local SEO specialist empowering businesses across Raigarh, Chhattisgarh with high-performance digital marketing platforms.",
    timeline: [
      { 
        year: "The Mission", 
        title: "Empowering Local Commerce in Raigarh", 
        desc: "I observed that remarkable local showrooms, clinics, salons, and businesses across Chhattisgarh were losing local market share simply because their online presence didn't match the premium quality of their real-world service. Harsh Digital Studios was founded to bridge this gap with professional website development in Raigarh, raising the bar for local digital credibility.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "The Innovation", 
        title: "Premium Website Development & AI Systems", 
        desc: "A beautiful design is only half the battle. To turn searchers into long-term clients, your business needs a high-performance system. We engineer custom mobile-responsive web portals, landing page designs, and integrate intelligent automated WhatsApp messaging to make sure every visitor can connect with your brand instantly.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "The Local Impact", 
        title: "Dominating Google Business & Search Engines", 
        desc: "With the rise of local 'near me' searches, appearing on top of Google Maps and local search packs is the single most valuable source of high-intent buyers. We deliver complete local SEO services and Google Business Profile optimization to help local Raigarh enterprises win sustainable, long-term visibility without continuous high advertising fees.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  services: {
    heroTitle: "High-Performance Digital Services",
    heroSubtitle: "We offer comprehensive digital solutions to help businesses in Chhattisgarh establish a professional web presence and attract more customers.",
    pillars: [
      {
        id: "biz-web",
        title: "Business Website Design",
        category: "Design",
        price: "₹15,000+",
        desc: "Premium, ultra-fast business websites styled with high-contrast display typography. Engineered purely in lightweight code to load instantly and hook local B2B/B2C leads.",
        benefits: ["Mobile-first custom layout", "Lighthouse speed index >95", "Domain & Hostinger setup support", "WhatsApp & secure contact forms"]
      },
      {
        id: "landing",
        title: "Landing Page Design",
        category: "Design",
        price: "₹7,000+",
        desc: "High-converting single-screen sales funnels built for maximum conversions. Ideal for targeted advertising campaigns, product launches, or local promotions.",
        benefits: ["Clear psychological CTA path", "Speed-optimized layout assets", "Lead collection database", "Social testimonials grid"]
      },
      {
        id: "redesign",
        title: "Website Redesign",
        category: "Design",
        price: "₹12,000+",
        desc: "Transform outdated, slow WordPress websites or builders into next-generation, high-speed custom code. Retain your current SEO value while boosting performance.",
        benefits: ["Convert builders to pure code", "Eliminate bulky database lag", "Modernized responsive graphics", "Over 80% improvement in load times"]
      },
      {
        id: "seo-adv",
        title: "Search Engine Optimization (SEO)",
        category: "SEO",
        price: "₹8,000/mo+",
        desc: "Comprehensive on-page and technical search engine optimization. Dominate competitive industry keywords and appear right when high-intent buyers search on Google.",
        benefits: ["Semantic schema markup injects", "Speed & performance structural fixes", "High-relevance content creation", "Google Search Console audit"]
      },
      {
        id: "seo-local",
        title: "Local SEO Dominance",
        category: "SEO",
        price: "₹5,000/mo+",
        desc: "Targeted geographical search optimization to rank first in Raigarh, Tamnar, Kharsia, and neighboring regions. Command local queries directly.",
        benefits: ["Geotagged local content nodes", "NAP consistency verification", "Competitor gap blueprint", "Map pack rank tracking reports"]
      },
      {
        id: "gbp-opt",
        title: "Google Business Profile Optimization",
        category: "SEO",
        price: "₹3,000+",
        desc: "Full creation, verification, and technical configuration of your Google Maps listing (GMB). The absolute highest ROI local marketing channel.",
        benefits: ["Primary/Secondary category matching", "Review booster strategy booklet", "EXIF geo-optimized photos", "Spam competitor listing cleaning"]
      },
      {
        id: "meta-ads",
        title: "Meta Ads Campaigns",
        category: "Marketing",
        price: "₹6,000/mo+",
        desc: "Highly-targeted advertising on Facebook and Instagram. Focuses strictly on direct-response lead generation for local gyms, salons, clinics, or real estate.",
        benefits: ["Custom pixel & events tracking", "Lead-generation instant forms", "A/B copywriting experiments", "Weekly ROAS performance metrics"]
      },
      {
        id: "smm",
        title: "Social Media Management",
        category: "Marketing",
        price: "₹8,000/mo+",
        desc: "Build local authority with structured content grids and visual assets. We design high-converting reels concepts, carousel tips, and stories.",
        benefits: ["Consistent custom-branded grids", "Short-form video scripts & editing", "Engagement booster planning", "Canva asset toolkit handover"]
      },
      {
        id: "speed-opt",
        title: "Website Speed Optimization",
        category: "Maintenance",
        price: "₹4,000+",
        desc: "Struggling with slow loading speeds? We strip redundant codes, minify CSS, implement smart lazy loading, and compress heavy images to drop load times under 2 seconds.",
        benefits: ["Core Web Vitals alignment", "Cloudflare CDN configuration", "Image format conversion to WebP", "Caching setup and server tweak"]
      },
      {
        id: "maint",
        title: "Website Maintenance & Support",
        category: "Maintenance",
        price: "₹2,500/mo+",
        desc: "Ensure your digital asset remains online, updated, secure, and fast. Perfect for business owners wanting complete peace of mind.",
        benefits: ["Weekly code & DB backups", "Uptime & security monitoring", "Minor content & pricing updates", "Immediate emergency assistance"]
      },
      {
        id: "site-audit",
        title: "Free Website Audit",
        category: "SEO",
        price: "₹0 (Free)",
        desc: "Get an exhaustive technical audit of your existing website. We analyze your speed, mobile responsiveness, local rankings, schema setup, and provide actionable fixes.",
        benefits: ["Full Lighthouse reports", "Competitor local rank analysis", "UX friction checklist", "20-minute strategy walk-through"]
      },
      {
        id: "analytics",
        title: "Analytics & Reporting",
        category: "Maintenance",
        price: "₹3,000+",
        desc: "Implement advanced conversion monitoring on your website. Learn exactly where your traffic comes from and which buttons drive real cash.",
        benefits: ["Google Analytics 4 configuration", "Google Search Console connection", "Custom event & conversion goals", "Simple live metrics dashboard"]
      }
    ]
  },
  process: {
    title: "Our 4-Step Launch Process",
    subtitle: "From raw concept to front-page organic Google rankings, here is how we work with local Chhattisgarh businesses.",
    steps: [
      { step: "01", title: "Discovery & Strategy Plan", desc: "We analyze your top local competitors, audit your current brand presence, find local keyword gaps, and design a transparent project roadmap." },
      { step: "02", title: "Premium Visual UI Design", desc: "We build custom, modern page layouts. No boring templates. We craft tailored, brand-specific aesthetics, typography pairings, and clean assets." },
      { step: "03", title: "High-Speed & SEO Build", desc: "We write clean, lightweight code. We optimize Web Vitals, write semantic tags, configure schemas, and link Search Console dashboards." },
      { step: "04", title: "Launch, Training & Handover", desc: "We deploy the site to fast cloud servers, optimize your Google Maps listing, set up analytics, and hand over simple Canva/admin control panels." }
    ]
  },
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Answering everything about domain ownership, local rankings, pricing structures, and website maintenance.",
    faqs: [
      { q: "Who is Harsh Patel and why should I choose a freelancer over a digital agency?", a: "Harsh Patel is a professional freelance developer, digital marketing specialist, and local business growth consultant based in Raigarh, Chhattisgarh. Holding a Bachelor of Commerce (B.Com) and an MBA in Marketing, Harsh blends technical full-stack code with real-world business psychology. Unlike large agencies that charge hefty overheads and pass your project to junior interns, Harsh works with you directly. You get transparent pricing, direct WhatsApp communication, faster launch speeds, and 1-on-1 accountability." },
      { q: "Which areas in Chhattisgarh do you specialize in serving?", a: "While we design for clients nationwide, we offer highly optimized local SEO and website development solutions specifically tailored for local business owners in Raigarh, Tamnar, Kharsia, Gharghoda, Sarangarh, and surrounding industrial zones. We understand local customer search psychology, the local competitor landscapes, and geographical ranking strategies in Chhattisgarh." },
      { q: "How much does a basic business website cost?", a: "Our premium landing pages and single-page sales funnels start at ₹7,000. Full multi-page business websites with complete Local SEO and WhatsApp lead automation typically range from ₹15,000 to ₹35,000 depending on features, copy length, and integrations. We provide flat upfront quotes with absolutely zero hidden annual charges." },
      { q: "Do you build on WordPress, or do you write custom code?", a: "We specialize in writing high-performance, custom-coded websites (using React, HTML5, Vite, Tailwind CSS) because custom code loads up to 10x faster than bloated WordPress sites, has zero vulnerable database plugins, and provides far superior SEO rankings. However, if you explicitly require a WordPress site for easy blog editing, we can build custom, speed-optimized Elementor or Gutenberg sites." },
      { q: "How long does it take to design and launch a business website?", a: "A single-page landing page is typically designed and launched in 4 to 7 days. A comprehensive multi-page business website takes between 2 to 4 weeks, depending on content availability, design reviews, and customized form requirements." },
      { q: "Will my website rank #1 on Google for my local keywords?", a: "We build every single website with proper SEO hygiene—including clean semantic HTML tags, Google Search Console linkage, correct robots.txt, fast load speeds, and local schema markups. While nobody can 'guarantee' a permanent #1 Google rank overnight, combining our Local SEO services with Google Business Profile optimization typically gets local businesses into the high-converting Google Maps 'Top 3 Pack' within 60 to 90 days." },
      { q: "What is Google Business Profile (GBP) optimization and why do I need it?", a: "Google Business Profile (formerly Google My Business) is the free map listing that appears when customers search for local terms (e.g., 'best dental clinic in Raigarh'). Optimizing this listing with geotagged photos, proper category matching, name-cleaning, and direct reviews ensures your business shows up on top of Google Maps, driving high-intent phone calls and store visits daily." },
      { q: "How do your Meta Ads services generate leads for local businesses?", a: "We set up professional Facebook and Instagram ad campaigns targeted strictly at users in Raigarh, Tamnar, or Kharsia. Instead of clicking 'boost post' (which wastes ad budget on likes), we create custom lead-capture forms, eye-catching visual creatives, and compelling offers (like 'Get 20% off on your first salon visit') that deliver actual names, phone numbers, and requirements directly to your CRM." },
      { q: "Do you provide web domain names and hosting?", a: "We help you select, secure, and set up your personal domain name (e.g., yourbusiness.com) and purchase highly reliable, fast local cloud hosting (such as Hostinger or Cloudflare). All assets are registered under your own name, ensuring you have 100% full ownership of your digital property." },
      { q: "Is a custom website secure against hacking and virus issues?", a: "Yes. Bloated plugins make platforms like WordPress major targets for local hackers. Because we write lightweight custom frontend code and utilize secure, cloud-hosted backends (like Supabase or Google Cloud), your website is virtually unhackable, requiring zero regular anti-virus overheads." },
      { q: "Can we track how many customers actually visit the website?", a: "Absolutely. We link every project with Google Analytics 4 (GA4) and Google Search Console. You will get access to a simplified, live dashboard showing exactly how many people visited your site, which city they came from, and which buttons (like 'WhatsApp Chat' or 'Call Now') they clicked." },
      { q: "Can you redesign my existing slow website?", a: "Yes. Many of our clients come to us with slow, outdated websites that load in 8+ seconds and fail to bring in any business. We rebuild these sluggish platforms from scratch into premium, responsive, under-2-seconds masterpieces while carefully redirecting your old links to preserve all existing Google rankings." },
      { q: "What happens after the website is launched? Do you offer support?", a: "We don't just launch and disappear. We provide ongoing Website Maintenance packages starting from ₹2,500/mo. This covers weekly secure backups, uptime monitoring, minor text/price updates, and emergency recovery so you can focus entirely on running your physical business." },
      { q: "How can I start? What is the booking process?", a: "It's extremely simple. You can fill out our embedded Lead Capture Form below, or click 'Chat on WhatsApp' to message Harsh Patel directly. We will schedule a free 20-minute digital strategy consultation, audit your existing online presence, show you custom wireframe mockups, and draw a 90-day action plan for your business." }
    ]
  },
  blog: {
    title: "Latest Growth Insights",
    subtitle: "Practical, actionable advice written specifically for local Chhattisgarh business owners on web design and SEO.",
    posts: [
      {
        id: "raigarh-local-business-website-2026",
        title: "Why Every Local Business in Raigarh Needs a Professional Website in 2026",
        tag: "Web Design",
        time: "12 min read",
        desc: "Explore how a premium, SEO-optimized business website drives high-intent client inquiries 24/7. Stop renting social spaces and secure your brand.",
        content: "## Establishing Local Authority\nIn today's digital era, a local showroom or clinic without a high-performance website is losing substantial market share to competitors who invest in digital discovery. Relying solely on Facebook pages or Instagram feeds is renting space on lands you do not own.\n\n## Why Speed and SEO Matter\nWhen local buyers search for products or professional services, they want answers in seconds. Fast websites coded with pristine frameworks load in under 2 seconds and rank far higher on search engines than bloated template frameworks. Building your own digital asset is the key to double your incoming lead flows."
      },
      {
        id: "google-business-profile-optimization-guide-2026",
        title: "Google Business Profile Optimization: Complete Maps Dominance Blueprint",
        tag: "Local SEO & GBP",
        time: "14 min read",
        desc: "Discover how to optimize your Google Business Profile to rank #1 on Google Maps, generate direct calls, and attract local showroom traffic.",
        content: "## The Power of Google Maps\nFor local stores, dental clinics, or fitness gyms, the 'Google 3-Pack' on Maps is the single highest ROI marketing vector available. Over 65% of local searches click directly on map suggestions instead of organic text listings.\n\n## Steps to Dominate Local Search\n1. Ensure complete NAP (Name, Address, Phone) alignment across all platforms.\n2. Pick highly relevant primary and secondary service categories.\n3. Upload geo-optimized, EXIF-tagged high-resolution photography regularly.\n4. Secure high-velocity reviews with target industry keyword integrations."
      },
      {
        id: "website-vs-instagram-for-local-business-2026",
        title: "Website vs Instagram: Which One Actually Brings More Customers?",
        tag: "Marketing Strategy",
        time: "11 min read",
        desc: "Compare organic social feeds with custom website funnels. Learn why high-intent Google search traffic delivers far better conversions.",
        content: "## The Direct Intent Advantage\nOrganic social posts on Instagram or Facebook rely on interruption marketing. Users browse to consume entertaining content, not necessarily to book an aesthetic clinic or purchase jewelry. On the contrary, Google search represents active, high-intent interest.\n\n## Building Predictable Pipelines\nWhen someone actively queries 'best salon in Raigarh' on Google, they are looking to book a service *immediately*. A dedicated, speed-optimized website funnel guides these hot prospects directly to a WhatsApp checkout, converting visitors into active leads at a 5x higher rate than social posts."
      }
    ]
  },
  footer: {
    description: "Empowering local businesses in Raigarh, Chhattisgarh with premium digital solutions.",
    rights: "All rights reserved."
  },
  contact: {
    badge: "Free Digital Growth Audit",
    heroTitle: "Let's Fuel Your Local Business",
    heroSubtitle: "Fill out our secure CRM form below. Harsh Patel will manually analyze your online presence and call/WhatsApp you with a tailored 90-day expansion blueprint.",
    address: "Raigarh, Chhattisgarh, India",
    email: "harsh@harshdigitalstudios.com",
    phone: "+91 70673 63208"
  },
  socials: {
    whatsapp: "https://wa.me/917067363208?text=Hello%20Harsh%20Patel%2C%20let's%20discuss%20a%20project%20for%20my%20business%21",
    facebook: "https://facebook.com/harshdigitalstudios",
    instagram: "https://instagram.com/harshdigitalstudios",
    linkedin: "https://linkedin.com/in/harshpatel",
    youtube: "https://youtube.com/harshdigitalstudios"
  },
  visibility: {
    showHero: true,
    showAbout: true,
    showServices: true,
    showProcess: true,
    showFAQ: true,
    showBlog: true,
    showFooter: true,
    showContact: true,
    showSocials: true
  }
};

export const cmsService = {
  // Helper to load content
  async getCMSContent(status: 'published' | 'draft' = 'published'): Promise<CMSContent> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(`hds_cms_${status}`);
      if (stored) {
        try {
          return { ...defaultCMSContent, ...JSON.parse(stored) };
        } catch (e) {
          return defaultCMSContent;
        }
      }
      return defaultCMSContent;
    }

    try {
      const { data, error } = await supabase
        .from('website_cms')
        .select('content')
        .eq('id', status)
        .single();

      if (error || !data) {
        // Fallback to localStorage if table is empty
        const stored = localStorage.getItem(`hds_cms_${status}`);
        if (stored) {
          try {
            return { ...defaultCMSContent, ...JSON.parse(stored) };
          } catch (e) {
            return defaultCMSContent;
          }
        }
        return defaultCMSContent;
      }

      return { ...defaultCMSContent, ...data.content };
    } catch (err) {
      console.error(`Error loading CMS ${status} from Supabase:`, err);
      const stored = localStorage.getItem(`hds_cms_${status}`);
      if (stored) {
        try {
          return { ...defaultCMSContent, ...JSON.parse(stored) };
        } catch (e) {
          return defaultCMSContent;
        }
      }
      return defaultCMSContent;
    }
  },

  // Helper to save draft
  async saveCMSDraft(content: CMSContent): Promise<boolean> {
    // Save in localStorage as fallback
    localStorage.setItem('hds_cms_draft', JSON.stringify(content));

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('website_cms')
        .upsert({ id: 'draft', content, updated_at: new Date().toISOString() });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error saving CMS draft to Supabase:', err);
      return true; // Still return true because we saved in localStorage successfully
    }
  },

  // Helper to publish CMS content
  async publishCMSContent(content: CMSContent): Promise<boolean> {
    // Save both published and draft to localStorage as fallback
    localStorage.setItem('hds_cms_published', JSON.stringify(content));
    localStorage.setItem('hds_cms_draft', JSON.stringify(content));

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const publishedPromise = supabase
        .from('website_cms')
        .upsert({ id: 'published', content, updated_at: new Date().toISOString() });

      const draftPromise = supabase
        .from('website_cms')
        .upsert({ id: 'draft', content, updated_at: new Date().toISOString() });

      const [pubRes, drfRes] = await Promise.all([publishedPromise, draftPromise]);

      if (pubRes.error) throw pubRes.error;
      if (drfRes.error) throw drfRes.error;

      return true;
    } catch (err) {
      console.error('Error publishing CMS content to Supabase:', err);
      return true; // Return true as localStorage fallback succeeded
    }
  },

  // Helper to revert draft to published
  async revertDraftToPublished(): Promise<CMSContent> {
    const published = await this.getCMSContent('published');
    await this.saveCMSDraft(published);
    return published;
  },

  // Helper to upload images with Base64 fallback
  async uploadImage(file: File): Promise<string> {
    if (!isSupabaseConfigured) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `cms-assets/${fileName}`;

      // Uploading to bucket called 'cms_assets' or falling back if it fails
      const { data, error } = await supabase.storage
        .from('cms_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn('Supabase storage upload error, falling back to base64:', error);
        // Fallback to base64 read
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cms_assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image to Supabase storage:', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
};
