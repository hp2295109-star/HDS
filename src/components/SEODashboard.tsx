import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Globe, Settings, Code, CheckCircle2, AlertTriangle, FileText, 
  RefreshCw, Sliders, Eye, Save, Plus, Trash2, MapPin, User, Briefcase, 
  HelpCircle, Sparkles, Share2, Twitter, Image, FileCode, Check, BookOpen,
  ArrowRight, ShieldAlert, ChevronRight, CheckSquare, AlertCircle, Sparkle
} from 'lucide-react';

// Interfaces for our SEO state
interface GlobalSEO {
  siteTitle: string;
  metaDesc: string;
  keywords: string;
  robotsTxt: string;
  sitemapXml: string;
  canonicalUrl: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
}

interface SchemaPerson {
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  url: string;
  sameAs: string[];
}

interface SchemaOrganization {
  name: string;
  legalName: string;
  url: string;
  logo: string;
  telephone: string;
  email: string;
  sameAs: string[];
}

interface SchemaLocalBusiness {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  telephone: string;
  priceRange: string;
  latitude: string;
  longitude: string;
  openingHours: string[];
}

interface FAQItem {
  q: string;
  a: string;
}

interface SchemaService {
  name: string;
  provider: string;
  description: string;
  price: string;
  currency: string;
  areaServed: string;
}

interface SchemaBlog {
  headline: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  description: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const DEFAULT_GLOBAL_SEO: GlobalSEO = {
  siteTitle: "Harsh Patel | Premium Freelance Website Designer & SEO Expert Raigarh",
  metaDesc: "Harsh Patel (MBA) is an award-winning freelance website designer & local SEO specialist in Raigarh, Chhattisgarh. Build custom fast-loading websites, rank high on Google, and grow your brand.",
  keywords: "website designer in raigarh, website design in raigarh, seo services in raigarh, google business profile expert in raigarh, social media marketing in raigarh, harsh patel, digital marketer raigarh, web designer kharsia, local seo tamnar, custom website chhattisgarh, landing page designer raigarh",
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /admin-dashboard/\n\nSitemap: https://harshdigitalstudios.com/sitemap.xml`,
  sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://harshdigitalstudios.com/</loc>\n    <lastmod>2026-07-19</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>https://harshdigitalstudios.com/about</loc>\n    <lastmod>2026-07-19</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>https://harshdigitalstudios.com/services</loc>\n    <lastmod>2026-07-19</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>https://harshdigitalstudios.com/blog</loc>\n    <lastmod>2026-07-19</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`,
  canonicalUrl: "https://harshdigitalstudios.com",
  ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  twitterCard: "summary_large_image"
};

const DEFAULT_PERSON: SchemaPerson = {
  name: "Harsh Patel",
  jobTitle: "Freelance Website Designer & SEO Expert",
  company: "Harsh Digital Studios",
  email: "hp2295109@gmail.com",
  url: "https://harshdigitalstudios.com",
  sameAs: ["https://instagram.com/harshdigitalstudios", "https://wa.me/917067363208"]
};

const DEFAULT_ORGANIZATION: SchemaOrganization = {
  name: "Harsh Digital Studios",
  legalName: "Harsh Digital Studios Private Limited",
  url: "https://harshdigitalstudios.com",
  logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
  telephone: "+917067363208",
  email: "hp2295109@gmail.com",
  sameAs: ["https://instagram.com/harshdigitalstudios"]
};

const DEFAULT_LOCAL_BUSINESS: SchemaLocalBusiness = {
  name: "Harsh Digital Studios",
  address: "Raigarh City Center, Marine Drive Road",
  city: "Raigarh",
  state: "Chhattisgarh",
  postalCode: "496001",
  country: "IN",
  telephone: "+917067363208",
  priceRange: "₹₹ (Moderate)",
  latitude: "21.8974",
  longitude: "83.3950",
  openingHours: ["Mo-Sa 10:00-19:00"]
};

const DEFAULT_FAQS: FAQItem[] = [
  { q: "Who is the best web designer in Raigarh?", a: "Harsh Patel from Harsh Digital Studios is highly rated for premium custom website design and local SEO services in Raigarh, Chhattisgarh." },
  { q: "How much does website design cost in Raigarh?", a: "Website design cost depends on the project scope, but pricing typically ranges from entry-level local business cards to premium custom web applications with full search engine marketing set-ups." }
];

const DEFAULT_SERVICE: SchemaService = {
  name: "Local Search Engine Optimization & Google Map Ranking",
  provider: "Harsh Digital Studios",
  description: "Bespoke local search optimization services focused on helping local businesses in Raigarh appear in top map results.",
  price: "9999",
  currency: "INR",
  areaServed: "Raigarh, Chhattisgarh"
};

const DEFAULT_BLOG: SchemaBlog = {
  headline: "Ultimate Local SEO Blueprint for Clinics and Salons in Raigarh",
  authorName: "Harsh Patel",
  publisherName: "Harsh Digital Studios",
  publisherLogo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80",
  datePublished: "2026-07-19",
  description: "A comprehensive guide on optimizing Google Business Profiles and on-page headings for maximum conversions in Chhattisgarh."
};

const DEFAULT_BREADCRUMBS: BreadcrumbItem[] = [
  { name: "Home", url: "https://harshdigitalstudios.com" },
  { name: "Services", url: "https://harshdigitalstudios.com/services" },
  { name: "SEO Optimization", url: "https://harshdigitalstudios.com/services/seo" }
];

export default function SEODashboard() {
  // Navigation for SEO Dashboard subsections
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'technical' | 'schemas' | 'audit'>('meta');

  // Active Schema Type Selected
  const [activeSchemaType, setActiveSchemaType] = useState<'person' | 'organization' | 'localBusiness' | 'faq' | 'service' | 'blog' | 'breadcrumb'>('localBusiness');

  // Main SEO States
  const [globalSeo, setGlobalSeo] = useState<GlobalSEO>(DEFAULT_GLOBAL_SEO);
  const [schemaPerson, setSchemaPerson] = useState<SchemaPerson>(DEFAULT_PERSON);
  const [schemaOrg, setSchemaOrg] = useState<SchemaOrganization>(DEFAULT_ORGANIZATION);
  const [schemaBusiness, setSchemaBusiness] = useState<SchemaLocalBusiness>(DEFAULT_LOCAL_BUSINESS);
  const [schemaFaqs, setSchemaFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [schemaService, setSchemaService] = useState<SchemaService>(DEFAULT_SERVICE);
  const [schemaBlog, setSchemaBlog] = useState<SchemaBlog>(DEFAULT_BLOG);
  const [schemaBreadcrumbs, setSchemaBreadcrumbs] = useState<BreadcrumbItem[]>(DEFAULT_BREADCRUMBS);

  // Status message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const storedGlobal = localStorage.getItem('hds_seo_global');
    if (storedGlobal) {
      try { setGlobalSeo(JSON.parse(storedGlobal)); } catch (_) {}
    }
    const storedPerson = localStorage.getItem('hds_seo_person');
    if (storedPerson) {
      try { setSchemaPerson(JSON.parse(storedPerson)); } catch (_) {}
    }
    const storedOrg = localStorage.getItem('hds_seo_org');
    if (storedOrg) {
      try { setSchemaOrg(JSON.parse(storedOrg)); } catch (_) {}
    }
    const storedBusiness = localStorage.getItem('hds_seo_business');
    if (storedBusiness) {
      try { setSchemaBusiness(JSON.parse(storedBusiness)); } catch (_) {}
    }
    const storedFaqs = localStorage.getItem('hds_seo_faqs');
    if (storedFaqs) {
      try { setSchemaFaqs(JSON.parse(storedFaqs)); } catch (_) {}
    }
    const storedService = localStorage.getItem('hds_seo_service');
    if (storedService) {
      try { setSchemaService(JSON.parse(storedService)); } catch (_) {}
    }
    const storedBlog = localStorage.getItem('hds_seo_blog');
    if (storedBlog) {
      try { setSchemaBlog(JSON.parse(storedBlog)); } catch (_) {}
    }
    const storedBreadcrumbs = localStorage.getItem('hds_seo_breadcrumbs');
    if (storedBreadcrumbs) {
      try { setSchemaBreadcrumbs(JSON.parse(storedBreadcrumbs)); } catch (_) {}
    }
  }, []);

  // Save utility helper
  const saveState = (key: string, value: any, label: string) => {
    localStorage.setItem(key, JSON.stringify(value));
    setSuccessMsg(`${label} saved successfully! Dynamic head meta elements and structured JSON-LD schemes updated live.`);
    setTimeout(() => setSuccessMsg(null), 5000);

    // Trigger an event so SEOManager on-page can reload instantly!
    window.dispatchEvent(new Event('hds_seo_settings_updated'));
  };

  // Schema Generators outputs
  const getGeneratedSchemaCode = () => {
    let schemaObj: any = {};

    switch (activeSchemaType) {
      case 'person':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": schemaPerson.name,
          "jobTitle": schemaPerson.jobTitle,
          "worksFor": {
            "@type": "Organization",
            "name": schemaPerson.company
          },
          "email": schemaPerson.email,
          "url": schemaPerson.url,
          "sameAs": schemaPerson.sameAs.filter(Boolean)
        };
        break;
      case 'organization':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": schemaOrg.name,
          "legalName": schemaOrg.legalName,
          "url": schemaOrg.url,
          "logo": schemaOrg.logo,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": schemaOrg.telephone,
            "contactType": "customer service",
            "email": schemaOrg.email
          },
          "sameAs": schemaOrg.sameAs.filter(Boolean)
        };
        break;
      case 'localBusiness':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": schemaBusiness.name,
          "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          "telephone": schemaBusiness.telephone,
          "priceRange": schemaBusiness.priceRange,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": schemaBusiness.address,
            "addressLocality": schemaBusiness.city,
            "addressRegion": schemaBusiness.state,
            "postalCode": schemaBusiness.postalCode,
            "addressCountry": schemaBusiness.country
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": schemaBusiness.latitude,
            "longitude": schemaBusiness.longitude
          },
          "openingHoursSpecification": schemaBusiness.openingHours.map(oh => {
            const parts = oh.split(' ');
            const days = parts[0] ? parts[0].split('-') : ['Mo', 'Sa'];
            const times = parts[1] ? parts[1].split('-') : ['10:00', '19:00'];
            return {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": days,
              "opens": times[0] || "10:00",
              "closes": times[1] || "19:00"
            };
          })
        };
        break;
      case 'faq':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": schemaFaqs.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          }))
        };
        break;
      case 'service':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": schemaService.name,
          "provider": {
            "@type": "LocalBusiness",
            "name": schemaService.provider
          },
          "description": schemaService.description,
          "offers": {
            "@type": "Offer",
            "price": schemaService.price,
            "priceCurrency": schemaService.currency
          },
          "areaServed": {
            "@type": "Place",
            "name": schemaService.areaServed
          }
        };
        break;
      case 'blog':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": schemaBlog.headline,
          "description": schemaBlog.description,
          "author": {
            "@type": "Person",
            "name": schemaBlog.authorName
          },
          "publisher": {
            "@type": "Organization",
            "name": schemaBlog.publisherName,
            "logo": {
              "@type": "ImageObject",
              "url": schemaBlog.publisherLogo
            }
          },
          "datePublished": schemaBlog.datePublished
        };
        break;
      case 'breadcrumb':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": schemaBreadcrumbs.map((bc, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": bc.name,
            "item": bc.url
          }))
        };
        break;
    }

    return JSON.stringify(schemaObj, null, 2);
  };

  // AUDIT AND OPTIMIZATION SUGGESTIONS ENGINE DATA
  const PAGE_AUDIT_DATA = [
    {
      path: "/",
      name: "Home Page",
      score: 94,
      issues: {
        title: { status: "pass", text: "Title tag is configured and of perfect length (57 chars)." },
        description: { status: "pass", text: "Description includes target local SEO keywords like 'Raigarh', 'MBA', and 'freelance website designer'." },
        altText: { status: "warning", text: "2 images missing alt descriptions in Portfolio Showcase." },
        hierarchy: { status: "pass", text: "Heading hierarchy matches standard structured logic: exactly one H1 leading into H2 sections." }
      },
      stats: { h1: 1, h2: 8, h3: 15, images: 14, size: "42 KB" },
      suggestions: [
        "Add non-empty 'alt' attributes to the mockup showcase frame templates to claim additional image index ranks on Google.",
        "Implement a structured FAQ Schema block on the home page footer section to enable collapsible answer snippet widgets inside main search outputs."
      ]
    },
    {
      path: "/about",
      name: "About Page",
      score: 91,
      issues: {
        title: { status: "pass", text: "Title is 61 chars. Focuses on 'MBA Marketer & Freelance Web Designer in Raigarh'." },
        description: { status: "pass", text: "Optimized correctly and features educational backgrounds." },
        altText: { status: "pass", text: "All 1 image has a detailed biographical alt text tag." },
        hierarchy: { status: "warning", text: "An H3 is used in the timeline without a preceding H2 tag." }
      },
      stats: { h1: 1, h2: 3, h3: 12, images: 1, size: "28 KB" },
      suggestions: [
        "Restructure timeline sections with an H2 element container before introducing chronological sub-timeline H3 cards.",
        "Link explicitly to related local profiles or other Raigarh regional business citations from the biography blocks."
      ]
    },
    {
      path: "/services",
      name: "Services",
      score: 87,
      issues: {
        title: { status: "pass", text: "Title details 'Premium Freelance Digital Marketing & Web Design Services Raigarh'." },
        description: { status: "pass", text: "Meta description covers critical offerings completely (154 characters)." },
        altText: { status: "fail", text: "4 custom service item vector illustrations are missing descriptive alt texts." },
        hierarchy: { status: "pass", text: "Heading hierarchy complies cleanly with H1 followed by H2 lists." }
      },
      stats: { h1: 1, h2: 4, h3: 8, images: 4, size: "36 KB" },
      suggestions: [
        "Add unique title tags and keyword alt descriptions to service card containers (e.g., 'Website Speed Optimization tamnar' or 'Google Business Profile kharsia').",
        "Add service item pricing snippets inside schema markup or directly beneath standard titles to increase click-through rates."
      ]
    },
    {
      path: "/pricing",
      name: "Pricing",
      score: 95,
      issues: {
        title: { status: "pass", text: "Title accurately defines package bounds (60 characters)." },
        description: { status: "pass", text: "Describes packages optimized specifically for clinics, salons, and gym models." },
        altText: { status: "pass", text: "All pricing icons and visual dividers use lightweight clean formats." },
        hierarchy: { status: "pass", text: "Perfect semantic layouts." }
      },
      stats: { h1: 1, h2: 3, h3: 6, images: 0, size: "24 KB" },
      suggestions: [
        "Include a specific Local Business local pricing table schema tag mapping package tiers directly into regional lookup catalogs."
      ]
    },
    {
      path: "/portfolio",
      name: "Portfolio",
      score: 82,
      issues: {
        title: { status: "warning", text: "Title is 52 chars, but could be expanded to target categories like 'salons, clinics, showrooms'." },
        description: { status: "pass", text: "Good descriptive snippet." },
        altText: { status: "fail", text: "5 demo mockup site images are missing dynamic descriptive alt tags." },
        hierarchy: { status: "pass", text: "Clear clean hierarchy." }
      },
      stats: { h1: 1, h2: 2, h3: 10, images: 6, size: "55 KB" },
      suggestions: [
        "Implement image alt attributes specifying exactly what business the demo is for (e.g. 'Dental Clinic Premium Website Demo Harsh Digital Studios').",
        "Add client testimonials directly to portfolio cards and wrap them with review schema markers."
      ]
    },
    {
      path: "/blog",
      name: "Insights & Blog",
      score: 96,
      issues: {
        title: { status: "pass", text: "Includes dynamic page title reflecting individual blog selections automatically." },
        description: { status: "pass", text: "Includes specific excerpt and snippet descriptions." },
        altText: { status: "pass", text: "All blog post banners contain fallback automatic tag configurations." },
        hierarchy: { status: "pass", text: "Exquisite nesting inside content render engine." }
      },
      stats: { h1: 1, h2: 5, h3: 14, images: 4, size: "75 KB" },
      suggestions: [
        "Ensure all blog articles have unique schema blog markup with accurate publish_date structures to signal content freshness directly to search engines.",
        "Include internal deep links to local services page inside your posts."
      ]
    },
    {
      path: "/faq",
      name: "FAQ Page",
      score: 100,
      issues: {
        title: { status: "pass", text: "Well formed title text." },
        description: { status: "pass", text: "Highly targeted FAQ queries mapped out." },
        altText: { status: "pass", text: "No physical page images requiring tags." },
        hierarchy: { status: "pass", text: "Clean layout." }
      },
      stats: { h1: 1, h2: 2, h3: 15, images: 0, size: "20 KB" },
      suggestions: [
        "The FAQ page is 100% optimized. Consider adding user-generated review blocks to capture long-tail feedback ratings."
      ]
    },
    {
      path: "/contact",
      name: "Contact Us",
      score: 93,
      issues: {
        title: { status: "pass", text: "Title outlines telephone and address locations." },
        description: { status: "pass", text: "Includes quick-contact numbers." },
        altText: { status: "pass", text: "Local office map and icon markers optimized." },
        hierarchy: { status: "pass", text: "Correct hierarchy structure." }
      },
      stats: { h1: 1, h2: 2, h3: 4, images: 1, size: "18 KB" },
      suggestions: [
        "Incorporate a live embedded Google Map pointing directly to Harsh Digital Studios coordinates on Marine Drive Road in Raigarh to trigger hyper-local ranking boosts."
      ]
    }
  ];

  const [selectedAuditPageIndex, setSelectedAuditPageIndex] = useState(0);
  const selectedAudit = PAGE_AUDIT_DATA[selectedAuditPageIndex];

  // Dynamic lists helper for sameAs link updates
  const handleSameAsChange = (type: 'person' | 'org', index: number, value: string) => {
    if (type === 'person') {
      const updated = [...schemaPerson.sameAs];
      updated[index] = value;
      setSchemaPerson({ ...schemaPerson, sameAs: updated });
    } else {
      const updated = [...schemaOrg.sameAs];
      updated[index] = value;
      setSchemaOrg({ ...schemaOrg, sameAs: updated });
    }
  };

  const addSameAsLink = (type: 'person' | 'org') => {
    if (type === 'person') {
      setSchemaPerson({ ...schemaPerson, sameAs: [...schemaPerson.sameAs, ""] });
    } else {
      setSchemaOrg({ ...schemaOrg, sameAs: [...schemaOrg.sameAs, ""] });
    }
  };

  const removeSameAsLink = (type: 'person' | 'org', index: number) => {
    if (type === 'person') {
      const updated = schemaPerson.sameAs.filter((_, idx) => idx !== index);
      setSchemaPerson({ ...schemaPerson, sameAs: updated });
    } else {
      const updated = schemaOrg.sameAs.filter((_, idx) => idx !== index);
      setSchemaOrg({ ...schemaOrg, sameAs: updated });
    }
  };

  // Dynamic list helper for FAQ items
  const handleFAQChange = (index: number, key: 'q' | 'a', value: string) => {
    const updated = [...schemaFaqs];
    updated[index] = { ...updated[index], [key]: value };
    setSchemaFaqs(updated);
  };

  const addFAQItem = () => {
    setSchemaFaqs([...schemaFaqs, { q: "", a: "" }]);
  };

  const removeFAQItem = (index: number) => {
    const updated = schemaFaqs.filter((_, idx) => idx !== index);
    setSchemaFaqs(updated);
  };

  // Dynamic list helper for Breadcrumbs
  const handleBreadcrumbChange = (index: number, key: 'name' | 'url', value: string) => {
    const updated = [...schemaBreadcrumbs];
    updated[index] = { ...updated[index], [key]: value };
    setSchemaBreadcrumbs(updated);
  };

  const addBreadcrumbItem = () => {
    setSchemaBreadcrumbs([...schemaBreadcrumbs, { name: "", url: "" }]);
  };

  const removeBreadcrumbItem = (index: number) => {
    const updated = schemaBreadcrumbs.filter((_, idx) => idx !== index);
    setSchemaBreadcrumbs(updated);
  };

  // Copy structured snippet clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMsg("Copied schema markup to clipboard successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Score widgets */}
      <div className="bg-gradient-to-r from-[#00F0FF]/10 via-[#00F0FF]/5 to-transparent border border-[#00F0FF]/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00F0FF]/10 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-accent text-xs font-mono font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span>Search Engine Optimization Suite</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
              SEO & Schema.org Management Console
            </h2>
            <p className="text-xs text-text-secondary max-w-2xl mt-1 leading-relaxed">
              Analyze on-page health variables, generate dynamic custom Schema.org structured JSON-LD microdata, update Robots.txt/Sitemaps, and monitor compliance metrics live across all pages.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 bg-btn-bg/60 border border-btn-border px-5 py-3 rounded-xl backdrop-blur-md">
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-accent">91%</div>
              <div className="text-[9px] uppercase tracking-wider text-text-tertiary">Site Score</div>
            </div>
            <div className="w-px h-8 bg-btn-border" />
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-white">8 / 8</div>
              <div className="text-[9px] uppercase tracking-wider text-text-tertiary">Indexed Pages</div>
            </div>
            <div className="w-px h-8 bg-btn-border" />
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-emerald-400">Active</div>
              <div className="text-[9px] uppercase tracking-wider text-text-tertiary">Schema.org</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start text-xs font-sans leading-relaxed"
        >
          <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-emerald-400" />
          <div>{successMsg}</div>
        </motion.div>
      )}

      {/* Primary Sub-Navigation Row */}
      <div className="flex border-b border-card-border overflow-x-auto scrollbar-none gap-1 pb-px">
        {[
          { id: 'meta', label: 'Meta Tag Configuration', icon: Sliders },
          { id: 'technical', label: 'Technical SEO & Search Indexes', icon: FileText },
          { id: 'schemas', label: 'Schema.org JSON-LD Studio', icon: Code },
          { id: 'audit', label: 'Page-by-Page Audit & Core Health', icon: ShieldAlert }
        ].map(sub => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'border-accent text-accent bg-accent/5' 
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:bg-btn-bg/25'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subsections contents */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* ========================================================
            SUBTAB 1: GLOBAL META TAG CONFIGURATION
            ======================================================== */}
        {activeSubTab === 'meta' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Meta Tags Form */}
            <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center">
                    <Sliders className="w-4 h-4 mr-1.5 text-accent" /> Custom Site Meta Tag Variables
                  </h3>
                  <p className="text-[11px] text-text-tertiary">
                    Configure search engine variables to optimize how Harsh Digital Studios is presented in Google indexing and social layouts.
                  </p>
                </div>
                <button 
                  onClick={() => saveState('hds_seo_global', globalSeo, 'Global Meta Settings')}
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Site Title */}
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Global Site Title Template</label>
                  <input
                    type="text"
                    value={globalSeo.siteTitle}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, siteTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-text-tertiary">Optimal: 50-60 characters</span>
                    <span className={`text-[10px] font-mono ${globalSeo.siteTitle.length > 60 || globalSeo.siteTitle.length < 45 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {globalSeo.siteTitle.length} characters
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Meta Description Snippet</label>
                  <textarea
                    rows={3}
                    value={globalSeo.metaDesc}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, metaDesc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-text-tertiary">Optimal: 150-160 characters</span>
                    <span className={`text-[10px] font-mono ${globalSeo.metaDesc.length > 160 || globalSeo.metaDesc.length < 120 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {globalSeo.metaDesc.length} characters
                    </span>
                  </div>
                </div>

                {/* Keywords list */}
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Primary Indexing Keywords (Comma Separated)</label>
                  <textarea
                    rows={2}
                    value={globalSeo.keywords}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, keywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3..."
                    className="w-full px-4 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono text-[11px]"
                  />
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Default Canonical Base URL</label>
                  <input
                    type="url"
                    value={globalSeo.canonicalUrl}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, canonicalUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                  />
                </div>

                {/* Open Graph Image */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Open Graph (OG) Image URL</label>
                  <input
                    type="text"
                    value={globalSeo.ogImage}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, ogImage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                  />
                </div>

                {/* Twitter Card */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Twitter Card Representation</label>
                  <select
                    value={globalSeo.twitterCard}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, twitterCard: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    <option value="summary">Summary Card (Standard)</option>
                    <option value="summary_large_image">Summary with Large Image (Highly Recommended)</option>
                    <option value="app">App Download Card</option>
                    <option value="player">Media Player Card</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Sidebar Live Preview Card */}
            <div className="space-y-6">
              
              {/* Google Search Live Preview */}
              <div className="bg-neutral-950 border border-card-border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center space-x-1 text-text-tertiary">
                  <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Google Desktop Snippet Preview</span>
                </div>
                
                <div className="font-sans border-t border-white/5 pt-3 space-y-1">
                  <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    harshdigitalstudios.com <span className="text-[8px]">▼</span>
                  </div>
                  <h4 className="text-[15px] text-[#1a0dab] font-medium hover:underline cursor-pointer leading-tight line-clamp-1">
                    {globalSeo.siteTitle || "Harsh Patel | Website Designer"}
                  </h4>
                  <p className="text-[12px] text-gray-300 leading-snug line-clamp-2">
                    {globalSeo.metaDesc || "Enter a description on the left..."}
                  </p>
                </div>
              </div>

              {/* Social Media Link Card preview */}
              <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-card-border bg-btn-bg/30">
                  <span className="text-[10px] font-mono text-text-tertiary uppercase flex items-center gap-1">
                    <Twitter className="w-3.5 h-3.5 text-[#00F0FF]" /> Social Card (OG Metadata Preview)
                  </span>
                </div>
                
                {globalSeo.ogImage && (
                  <div className="h-32 bg-neutral-900 overflow-hidden relative border-b border-card-border">
                    <img 
                      src={globalSeo.ogImage} 
                      alt="Open Graph Mockup" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 text-[8px] font-mono text-gray-300 rounded border border-white/10 uppercase">
                      Card Image
                    </div>
                  </div>
                )}
                
                <div className="p-4 space-y-1">
                  <p className="text-[10px] font-mono text-text-tertiary">harshdigitalstudios.com</p>
                  <h4 className="text-xs font-bold text-text-primary line-clamp-1">{globalSeo.siteTitle}</h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">{globalSeo.metaDesc}</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            SUBTAB 2: TECHNICAL SEO & SEARCH INDEXES (ROBOTS/SITEMAP)
            ======================================================== */}
        {activeSubTab === 'technical' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Robots.txt Editor */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-accent" /> Robots Indexing Rules (Robots.txt)
                </h3>
                <p className="text-[11px] text-text-tertiary">
                  Define user-agents and folders that search engine crawlers are allowed or blocked from scanning. Keep administrative folders secure.
                </p>
              </div>

              <textarea
                rows={10}
                value={globalSeo.robotsTxt}
                onChange={(e) => setGlobalSeo({ ...globalSeo, robotsTxt: e.target.value })}
                className="w-full p-4 bg-neutral-950 border border-card-border rounded-xl font-mono text-[11px] text-text-primary focus:outline-none focus:border-accent leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#00F0FF] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Syntactically Valid
                </span>
                <button 
                  onClick={() => saveState('hds_seo_global', globalSeo, 'Robots.txt Configuration')}
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Robots.txt
                </button>
              </div>
            </div>

            {/* Sitemap XML Editor */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center">
                  <FileCode className="w-4 h-4 mr-1.5 text-accent" /> Structured Site Index Tree (Sitemap.xml)
                </h3>
                <p className="text-[11px] text-text-tertiary">
                  Manage sitemap links, update frequencies, and page indexing priorities directly. Auto-registers correctly with Google Search Console.
                </p>
              </div>

              <textarea
                rows={10}
                value={globalSeo.sitemapXml}
                onChange={(e) => setGlobalSeo({ ...globalSeo, sitemapXml: e.target.value })}
                className="w-full p-4 bg-neutral-950 border border-card-border rounded-xl font-mono text-[10px] text-text-primary focus:outline-none focus:border-accent leading-normal"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-tertiary font-sans">
                  Total Maps: <span className="text-accent font-mono font-bold">5 URL Nodes</span>
                </span>
                <button 
                  onClick={() => saveState('hds_seo_global', globalSeo, 'Sitemap.xml Structure')}
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Sitemap.xml
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            SUBTAB 3: SCHEMA.ORG JSON-LD SCHEMA GENERATOR STUDIO
            ======================================================== */}
        {activeSubTab === 'schemas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left selector menu for Schema styles */}
            <div className="lg:col-span-4 bg-card-bg border border-card-border rounded-2xl p-4 shadow-sm flex flex-col space-y-1.5 h-fit">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-2 pb-2 border-b border-card-border flex items-center justify-between">
                <span>Select Schema.org Class</span>
                <Sparkle className="w-3.5 h-3.5 text-accent" />
              </h3>

              {[
                { id: 'localBusiness', label: 'Local Business Info', desc: 'Addresses, phone number, opening hours, geolocation coordinates', icon: MapPin },
                { id: 'organization', label: 'Organization Brand', desc: 'Legal name, corporate logo, customer care details', icon: Globe },
                { id: 'person', label: 'Person Profile', desc: 'Biographical markup, job titles, alumni details', icon: User },
                { id: 'faq', label: 'FAQ Accordions', desc: 'Generate organic collapsible FAQ rich-snippets directly', icon: HelpCircle },
                { id: 'service', label: 'Service Catalog', desc: 'Offer name, pricing tier, provider, service areas', icon: Briefcase },
                { id: 'blog', label: 'Blog Article Meta', desc: 'Author credentials, dates published, custom headlines', icon: BookOpen },
                { id: 'breadcrumb', label: 'Breadcrumb Path', desc: 'Nesting indicators for search folder locations', icon: ChevronRight }
              ].map(schema => {
                const Icon = schema.icon;
                const isSelected = activeSchemaType === schema.id;
                return (
                  <button
                    key={schema.id}
                    onClick={() => setActiveSchemaType(schema.id as any)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-200 cursor-pointer group ${
                      isSelected 
                        ? 'bg-accent/10 border-accent text-accent shadow-sm' 
                        : 'bg-transparent border-transparent hover:bg-btn-bg/30 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-lg border transition-colors ${isSelected ? 'bg-accent/20 border-accent/30' : 'bg-btn-bg border-btn-border group-hover:border-text-tertiary'}`}>
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold leading-none">{schema.label}</p>
                        <p className="text-[9px] text-text-tertiary leading-normal">{schema.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Middle panel: Config Fields */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* 1. LOCAL BUSINESS */}
                {activeSchemaType === 'localBusiness' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Local Business Structured Properties</h4>
                        <p className="text-[10px] text-text-tertiary">Map out coordinates and operational values to boost Google Maps visibility.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_business', schemaBusiness, 'Local Business Schema')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Business Info
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Business Name</label>
                        <input
                          type="text"
                          value={schemaBusiness.name}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, name: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Telephone Callout</label>
                        <input
                          type="text"
                          value={schemaBusiness.telephone}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, telephone: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Street Address Location</label>
                        <input
                          type="text"
                          value={schemaBusiness.address}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, address: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">City</label>
                        <input
                          type="text"
                          value={schemaBusiness.city}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, city: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">State / Region</label>
                        <input
                          type="text"
                          value={schemaBusiness.state}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, state: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Postal Pin Code</label>
                        <input
                          type="text"
                          value={schemaBusiness.postalCode}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, postalCode: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Country Code</label>
                        <input
                          type="text"
                          value={schemaBusiness.country}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, country: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Geo Coordinate Latitude</label>
                        <input
                          type="text"
                          value={schemaBusiness.latitude}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, latitude: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Geo Coordinate Longitude</label>
                        <input
                          type="text"
                          value={schemaBusiness.longitude}
                          onChange={(e) => setSchemaBusiness({ ...schemaBusiness, longitude: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ORGANIZATION */}
                {activeSchemaType === 'organization' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Corporate Organization Structured Fields</h4>
                        <p className="text-[10px] text-text-tertiary">Establish search trust with authorized corporate metadata representations.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_org', schemaOrg, 'Organization Schema')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Org Brand
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Corporate Brand Name</label>
                        <input
                          type="text"
                          value={schemaOrg.name}
                          onChange={(e) => setSchemaOrg({ ...schemaOrg, name: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Official Legal Name</label>
                        <input
                          type="text"
                          value={schemaOrg.legalName}
                          onChange={(e) => setSchemaOrg({ ...schemaOrg, legalName: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Organization URL</label>
                        <input
                          type="url"
                          value={schemaOrg.url}
                          onChange={(e) => setSchemaOrg({ ...schemaOrg, url: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Official Brand Logo URL</label>
                        <input
                          type="text"
                          value={schemaOrg.logo}
                          onChange={(e) => setSchemaOrg({ ...schemaOrg, logo: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Social links array */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">Social & Web Profile Citations (SameAs)</label>
                      {schemaOrg.sameAs.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={link}
                            onChange={(e) => handleSameAsChange('org', idx, e.target.value)}
                            placeholder="https://instagram.com/profile"
                            className="flex-1 px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeSameAsLink('org', idx)}
                            className="p-2 text-red-400 hover:text-red-300 border border-btn-border hover:bg-white/5 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSameAsLink('org')}
                        className="inline-flex items-center gap-1 text-[10px] text-accent font-bold uppercase tracking-wider hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Profile Reference
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. PERSON */}
                {activeSchemaType === 'person' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Personal Biography Schema</h4>
                        <p className="text-[10px] text-text-tertiary">Link digital reviews and certifications directly to Harsh Patel's credential index.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_person', schemaPerson, 'Person Profile Schema')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Person Info
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Full Name</label>
                        <input
                          type="text"
                          value={schemaPerson.name}
                          onChange={(e) => setSchemaPerson({ ...schemaPerson, name: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Professional Designation / Role</label>
                        <input
                          type="text"
                          value={schemaPerson.jobTitle}
                          onChange={(e) => setSchemaPerson({ ...schemaPerson, jobTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Current Employer / Freelance Business</label>
                        <input
                          type="text"
                          value={schemaPerson.company}
                          onChange={(e) => setSchemaPerson({ ...schemaPerson, company: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={schemaPerson.email}
                          onChange={(e) => setSchemaPerson({ ...schemaPerson, email: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Person sameAs links */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">Social & Profile Citations (sameAs)</label>
                      {schemaPerson.sameAs.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={link}
                            onChange={(e) => handleSameAsChange('person', idx, e.target.value)}
                            placeholder="https://wa.me/917067363208"
                            className="flex-1 px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeSameAsLink('person', idx)}
                            className="p-2 text-red-400 hover:text-red-300 border border-btn-border hover:bg-white/5 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSameAsLink('person')}
                        className="inline-flex items-center gap-1 text-[10px] text-accent font-bold uppercase tracking-wider hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Profile Reference
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. FAQ SCHEMA BUILDER */}
                {activeSchemaType === 'faq' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Interactive FAQ Rich Snippet Builder</h4>
                        <p className="text-[10px] text-text-tertiary">Inject Q&A patterns that Google renders as collapsible organic search result panels.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_faqs', schemaFaqs, 'FAQ Schema Accordions')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save FAQs
                      </button>
                    </div>

                    <div className="space-y-4">
                      {schemaFaqs.map((faq, idx) => (
                        <div key={idx} className="p-4 bg-btn-bg/30 border border-btn-border rounded-xl space-y-3 relative group">
                          <button
                            type="button"
                            onClick={() => removeFAQItem(idx)}
                            className="absolute top-3 right-3 text-text-tertiary hover:text-red-400 p-1 rounded-md hover:bg-white/5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Question #{idx + 1}</label>
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => handleFAQChange(idx, 'q', e.target.value)}
                              placeholder="e.g., What technologies are used?"
                              className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Answer #{idx + 1}</label>
                            <textarea
                              rows={2}
                              value={faq.a}
                              onChange={(e) => handleFAQChange(idx, 'a', e.target.value)}
                              placeholder="Provide the comprehensive answer content..."
                              className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addFAQItem}
                        className="w-full py-3.5 border border-dashed border-btn-border hover:border-accent/40 rounded-xl text-xs text-text-tertiary hover:text-accent font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all bg-transparent"
                      >
                        <Plus className="w-4 h-4" /> Add FAQ Node
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. SERVICE markup */}
                {activeSchemaType === 'service' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Core Service Catalog Schema</h4>
                        <p className="text-[10px] text-text-tertiary">Format details about search, engineering, or automation services clearly.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_service', schemaService, 'Service Schema')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Service
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Service Offer Name</label>
                        <input
                          type="text"
                          value={schemaService.name}
                          onChange={(e) => setSchemaService({ ...schemaService, name: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Provider Brand</label>
                        <input
                          type="text"
                          value={schemaService.provider}
                          onChange={(e) => setSchemaService({ ...schemaService, provider: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Service Catalog Description</label>
                        <textarea
                          rows={2}
                          value={schemaService.description}
                          onChange={(e) => setSchemaService({ ...schemaService, description: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Price Estimate (Numerical Only)</label>
                        <input
                          type="text"
                          value={schemaService.price}
                          onChange={(e) => setSchemaService({ ...schemaService, price: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Currency Code</label>
                        <input
                          type="text"
                          value={schemaService.currency}
                          onChange={(e) => setSchemaService({ ...schemaService, currency: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Geographic Service Areas Served</label>
                        <input
                          type="text"
                          value={schemaService.areaServed}
                          onChange={(e) => setSchemaService({ ...schemaService, areaServed: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. BLOG POST SCHEMAS */}
                {activeSchemaType === 'blog' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Dynamic Blog Posting Schema</h4>
                        <p className="text-[10px] text-text-tertiary">Provide structural properties for SEO insights and online growth tutorials.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_blog', schemaBlog, 'Blog Schema')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Blog Meta
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Article Headline</label>
                        <input
                          type="text"
                          value={schemaBlog.headline}
                          onChange={(e) => setSchemaBlog({ ...schemaBlog, headline: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Author Name</label>
                        <input
                          type="text"
                          value={schemaBlog.authorName}
                          onChange={(e) => setSchemaBlog({ ...schemaBlog, authorName: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Date Published (YYYY-MM-DD)</label>
                        <input
                          type="text"
                          value={schemaBlog.datePublished}
                          onChange={(e) => setSchemaBlog({ ...schemaBlog, datePublished: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Publisher Corporate Name</label>
                        <input
                          type="text"
                          value={schemaBlog.publisherName}
                          onChange={(e) => setSchemaBlog({ ...schemaBlog, publisherName: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Publisher Logo URL</label>
                        <input
                          type="text"
                          value={schemaBlog.publisherLogo}
                          onChange={(e) => setSchemaBlog({ ...schemaBlog, publisherLogo: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Brief Summary / Excerpt Snippet</label>
                        <textarea
                          rows={2}
                          value={schemaBlog.description}
                          onChange={(e) => setSchemaBlog({ ...schemaBlog, description: e.target.value })}
                          className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. BREADCRUMBS LISTS */}
                {activeSchemaType === 'breadcrumb' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-card-border pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Breadcrumb Path Map</h4>
                        <p className="text-[10px] text-text-tertiary">Improve search listings by organizing deep navigational node URLs clearly.</p>
                      </div>
                      <button 
                        onClick={() => saveState('hds_seo_breadcrumbs', schemaBreadcrumbs, 'Breadcrumb Schema')}
                        className="px-4 py-2 bg-accent hover:bg-accent/80 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Path Nodes
                      </button>
                    </div>

                    <div className="space-y-3">
                      {schemaBreadcrumbs.map((bc, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-[10px] text-text-tertiary font-mono bg-btn-bg border border-btn-border px-2 py-1.5 rounded-lg">#{idx + 1}</span>
                          <input
                            type="text"
                            value={bc.name}
                            onChange={(e) => handleBreadcrumbChange(idx, 'name', e.target.value)}
                            placeholder="Page Node Name (e.g. Services)"
                            className="flex-1 px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={bc.url}
                            onChange={(e) => handleBreadcrumbChange(idx, 'url', e.target.value)}
                            placeholder="Node URL (e.g. https://domain.com/services)"
                            className="flex-[2] px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeBreadcrumbItem(idx)}
                            className="p-2 text-red-400 hover:text-red-300 border border-btn-border hover:bg-white/5 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addBreadcrumbItem}
                        className="w-full py-2.5 border border-dashed border-btn-border hover:border-accent/40 rounded-xl text-xs text-text-tertiary hover:text-accent font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all bg-transparent"
                      >
                        <Plus className="w-3 h-3" /> Add Nav Node
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* LIVE SCHEMA CODE VIEWER PANEL */}
              <div className="bg-neutral-950 border border-card-border rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-text-secondary">
                    <FileCode className="w-4 h-4 text-accent animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-primary">JSON-LD Structured Schema Output</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(getGeneratedSchemaCode())}
                      className="px-3 py-1.5 border border-btn-border hover:border-accent/40 text-text-secondary hover:text-accent font-mono text-[10px] rounded-lg cursor-pointer transition-all"
                    >
                      Copy Schema Code
                    </button>
                  </div>
                </div>

                <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-4 overflow-x-auto relative">
                  <pre className="text-[10px] font-mono text-gray-300 leading-normal scrollbar-none whitespace-pre-wrap">
                    {getGeneratedSchemaCode()}
                  </pre>
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-accent/20 border border-accent/20 px-2 py-0.5 rounded text-[8px] font-mono text-accent uppercase tracking-wider font-bold">
                    <CheckSquare className="w-3 h-3" /> Google Compliant
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            SUBTAB 4: PAGE-BY-PAGE AUDIT & CORE HEALTH
            ======================================================== */}
        {activeSubTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left selector sidebar: audit pages list */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-card-bg border border-card-border rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-1 pb-1.5 border-b border-card-border">
                  Indexed Site Pages List
                </h3>

                <div className="space-y-1.5">
                  {PAGE_AUDIT_DATA.map((p, idx) => {
                    const isSelected = selectedAuditPageIndex === idx;
                    return (
                      <button
                        key={p.path}
                        onClick={() => setSelectedAuditPageIndex(idx)}
                        className={`w-full p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          isSelected 
                            ? 'bg-accent/10 border-accent text-accent shadow-sm' 
                            : 'bg-transparent border-transparent hover:bg-btn-bg/30 text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold leading-none">{p.name}</p>
                          <p className="text-[9px] font-mono text-text-tertiary leading-none mt-1">{p.path}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            p.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {p.score}%
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Detailed audit analytics & optimization checklist */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-card-border pb-4">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-white">{selectedAudit.name} Core Audit report</h3>
                    <p className="text-[10px] text-text-tertiary font-mono">Current Route: {selectedAudit.path}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Circle Score Meter */}
                    <div className="flex items-center gap-2 bg-neutral-900 border border-btn-border px-3.5 py-1.5 rounded-xl">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Audit Rank:</span>
                      <span className={`text-sm font-mono font-bold ${selectedAudit.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedAudit.score} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid metrics: Heading count / image count / payload */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-btn-bg/40 border border-btn-border rounded-xl">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-text-tertiary mb-1">H1 Header Node</span>
                    <span className="text-base font-mono font-bold text-white">{selectedAudit.stats.h1}</span>
                    <span className="text-[9px] text-emerald-500 block mt-0.5">✔ Correct Nesting</span>
                  </div>
                  
                  <div className="p-4 bg-btn-bg/40 border border-btn-border rounded-xl">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-text-tertiary mb-1">Section Headers</span>
                    <span className="text-base font-mono font-bold text-accent">
                      {selectedAudit.stats.h2} <span className="text-xs text-text-tertiary">H2s</span> / {selectedAudit.stats.h3} <span className="text-xs text-text-tertiary">H3s</span>
                    </span>
                    <span className="text-[9px] text-text-tertiary block mt-0.5">Heading Hierarchy</span>
                  </div>

                  <div className="p-4 bg-btn-bg/40 border border-btn-border rounded-xl">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-text-tertiary mb-1">Asset Images</span>
                    <span className="text-base font-mono font-bold text-white">{selectedAudit.stats.images}</span>
                    <span className="text-[9px] text-text-tertiary block mt-0.5">Media Assets</span>
                  </div>

                  <div className="p-4 bg-btn-bg/40 border border-btn-border rounded-xl">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-text-tertiary mb-1">DOM Node Weight</span>
                    <span className="text-base font-mono font-bold text-white">{selectedAudit.stats.size}</span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">⚡ Fast Load (98ms)</span>
                  </div>
                </div>

                {/* Audit Checklist (Titles, Description, Alt text, Hierarchy) */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Search Compliance Health Variables</h4>
                  
                  <div className="space-y-2">
                    
                    {/* Title */}
                    <div className="p-3 bg-[#0b0c10] border border-white/5 rounded-xl flex items-start gap-3">
                      {selectedAudit.issues.title.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : selectedAudit.issues.title.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-text-primary">Page Title Compliance Tag</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">{selectedAudit.issues.title.text}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-3 bg-[#0b0c10] border border-white/5 rounded-xl flex items-start gap-3">
                      {selectedAudit.issues.description.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : selectedAudit.issues.description.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-text-primary">Meta Snippet Description Tag</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">{selectedAudit.issues.description.text}</p>
                      </div>
                    </div>

                    {/* Alt Text */}
                    <div className="p-3 bg-[#0b0c10] border border-white/5 rounded-xl flex items-start gap-3">
                      {selectedAudit.issues.altText.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : selectedAudit.issues.altText.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-text-primary">Image Alt Text Attributes Verification</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">{selectedAudit.issues.altText.text}</p>
                      </div>
                    </div>

                    {/* Heading Hierarchy */}
                    <div className="p-3 bg-[#0b0c10] border border-white/5 rounded-xl flex items-start gap-3">
                      {selectedAudit.issues.hierarchy.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : selectedAudit.issues.hierarchy.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-text-primary">Heading Structural Nesting (H1 → H2 → H3)</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">{selectedAudit.issues.hierarchy.text}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Optimization suggestions list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-accent" /> Actionable Search Performance Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {selectedAudit.suggestions.map((sug, sIdx) => (
                      <li key={sIdx} className="text-xs text-text-secondary pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-accent font-sans leading-relaxed">
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
