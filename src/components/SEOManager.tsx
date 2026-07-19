import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEOManager() {
  const location = useLocation();
  const [updateTick, setUpdateTick] = useState(0);

  // Re-run whenever location changes or whenever user updates settings in the SEO Dashboard
  useEffect(() => {
    const handleUpdate = () => {
      setUpdateTick(prev => prev + 1);
    };
    window.addEventListener('hds_seo_settings_updated', handleUpdate);
    return () => window.removeEventListener('hds_seo_settings_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    
    // 1. Fetch customized values from localStorage if available, else use production defaults
    let customGlobal: any = null;
    let customPerson: any = null;
    let customOrg: any = null;
    let customBusiness: any = null;
    let customFaqs: any = null;
    let customService: any = null;
    let customBlog: any = null;
    let customBreadcrumbs: any = null;

    try {
      const g = localStorage.getItem('hds_seo_global');
      if (g) customGlobal = JSON.parse(g);
      const p = localStorage.getItem('hds_seo_person');
      if (p) customPerson = JSON.parse(p);
      const o = localStorage.getItem('hds_seo_org');
      if (o) customOrg = JSON.parse(o);
      const b = localStorage.getItem('hds_seo_business');
      if (b) customBusiness = JSON.parse(b);
      const f = localStorage.getItem('hds_seo_faqs');
      if (f) customFaqs = JSON.parse(f);
      const s = localStorage.getItem('hds_seo_service');
      if (s) customService = JSON.parse(s);
      const bl = localStorage.getItem('hds_seo_blog');
      if (bl) customBlog = JSON.parse(bl);
      const bc = localStorage.getItem('hds_seo_breadcrumbs');
      if (bc) customBreadcrumbs = JSON.parse(bc);
    } catch (err) {
      console.error("Failed to parse custom SEO settings:", err);
    }

    // Default configuration tags
    let title = customGlobal?.siteTitle || "Harsh Patel | Premium Freelance Website Designer & SEO Expert Raigarh";
    let desc = customGlobal?.metaDesc || "Harsh Patel (MBA) is an award-winning freelance website designer & local SEO specialist in Raigarh, Chhattisgarh. Build custom fast-loading websites, rank high on Google, and grow your brand.";
    let keywords = customGlobal?.keywords || "website designer in raigarh, website design in raigarh, seo services in raigarh, google business profile expert in raigarh, social media marketing in raigarh, harsh patel, digital marketer raigarh, web designer kharsia, local seo tamnar, custom website chhattisgarh, landing page designer raigarh";
    const canonicalBase = customGlobal?.canonicalUrl || "https://harshdigitalstudios.com";
    const canonical = `${canonicalBase}${path}`;
    const ogImage = customGlobal?.ogImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";
    const twitterCard = customGlobal?.twitterCard || "summary_large_image";

    // Dynamic mapping for specific views (incorporating user's custom base settings when appropriate)
    if (path === '/') {
      title = customGlobal?.siteTitle || "Harsh Patel | Premium Website Designer & SEO Specialist Raigarh";
      desc = customGlobal?.metaDesc || "Stop Posting. Start Building Your Brand. Premium custom websites and elite local SEO services in Raigarh, Tamnar, Kharsia, and Chhattisgarh by Harsh Patel (MBA). Book a free consultation.";
    } else if (path === '/about') {
      title = `About Harsh Patel | MBA Marketer & Freelance Web Designer in Raigarh`;
      desc = "Learn about Harsh Patel, an MBA-trained digital marketer, B.Com graduate, and founder of Harsh Digital Studios. Offering expert local SEO, GBP optimization, and website design in Chhattisgarh.";
    } else if (path === '/services') {
      title = "Premium Freelance Digital Marketing & Web Design Services Raigarh";
      desc = "Elite freelance services: custom business website design, landing pages, website speed optimization, local SEO, Google Business Profile management, and Meta Ads in Raigarh.";
    } else if (path === '/pricing') {
      title = "Web Design & Local SEO Packages | Harsh Patel Freelancer Raigarh";
      desc = "Transparent, performance-driven web design and local SEO packages optimized for businesses in Raigarh, Tamnar, and Kharsia. Perfect for clinics, salons, gyms, and retail stores.";
    } else if (path === '/portfolio') {
      title = "Premium Demo Website Designs & Client Portfolio | Raigarh SEO";
      desc = "Browse premium conversion-focused demo website designs built for local business categories (showrooms, clinics, salons). Custom built for maximum performance & search rank.";
    } else if (path === '/blog') {
      title = "Digital Growth Blog | Local SEO & Website Design Tips for Raigarh";
      desc = "Read free, high-impact guides on Google Business Profile rankings, local SEO, website performance, and digital marketing strategies by certified expert Harsh Patel.";
    } else if (path === '/faq') {
      title = "Frequently Asked Questions | Web Design & SEO Raigarh";
      desc = "Got questions about website development, domain hosting, local search rankings, or maintenance? Read our transparent FAQ for Raigarh businesses.";
    } else if (path === '/contact') {
      title = "Contact Us | Start Your Web Design Project in Raigarh";
      desc = "Contact Harsh Digital Studios at +91 70673 63208. Let's discuss your custom website, Google Business Profile rankings, or digital marketing campaigns today.";
    } else if (path === '/testimonials') {
      title = "Success Stories | Client Reviews for Web Developer in Raigarh";
      desc = "See real success stories and reviews from local clinics, gyms, showrooms, and retail stores in Chhattisgarh who upgraded their digital presence with us.";
    } else if (path === '/business-growth-calculator') {
      title = "Free Business Growth Potential Calculator | Harsh Digital Studios";
      desc = "Take our free 10-question AI assessment tool to check your local SEO ranking score, mobile compatibility, and get a custom 90-day growth roadmap.";
    }

    // 2. Inject Page Title & Meta Tags
    document.title = title;
    
    // Helper to find or create a meta tag
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    setMetaTag('name', 'description', desc);
    setMetaTag('name', 'keywords', keywords);
    
    // Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', customOrg?.name || 'Harsh Digital Studios');
    setMetaTag('property', 'og:image', ogImage);

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 3. Inject JSON-LD Dynamic Schema.org structured markup
    const existingSchemaScript = document.getElementById('jsonld-schema-seo');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'jsonld-schema-seo';

    // Build multi-layered JSON-LD schemas incorporating both default fallback AND custom generated fields from the SEO Dashboard!
    const schemas: any[] = [];

    // WebSite Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": customOrg?.name || "Harsh Digital Studios",
      "url": canonicalBase,
      "description": desc,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${canonicalBase}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    // LocalBusiness & Organization Schema
    const businessAddress = customBusiness 
      ? {
          "@type": "PostalAddress",
          "streetAddress": customBusiness.address,
          "addressLocality": customBusiness.city,
          "addressRegion": customBusiness.state,
          "postalCode": customBusiness.postalCode,
          "addressCountry": customBusiness.country
        }
      : {
          "@type": "PostalAddress",
          "streetAddress": "Raigarh City Center",
          "addressLocality": "Raigarh",
          "addressRegion": "Chhattisgarh",
          "postalCode": "496001",
          "addressCountry": "IN"
        };

    schemas.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": customBusiness?.name || customOrg?.name || "Harsh Digital Studios",
      "image": ogImage,
      "@id": `${canonicalBase}/#localbusiness`,
      "url": canonicalBase,
      "telephone": customBusiness?.telephone || customOrg?.telephone || "+917067363208",
      "priceRange": customBusiness?.priceRange || "$$",
      "address": businessAddress,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(customBusiness?.latitude || "21.8974"),
        "longitude": parseFloat(customBusiness?.longitude || "83.3950")
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "19:00"
      },
      "sameAs": customOrg?.sameAs || ["https://www.instagram.com/harshdigitalstudios", "https://wa.me/917067363208"]
    });

    // Services Schema
    if (customService) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": customService.name,
        "provider": {
          "@type": "LocalBusiness",
          "name": customService.provider
        },
        "description": customService.description,
        "offers": {
          "@type": "Offer",
          "price": customService.price,
          "priceCurrency": customService.currency
        },
        "areaServed": {
          "@type": "Place",
          "name": customService.areaServed
        }
      });
    } else {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Website Development",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Harsh Digital Studios"
        },
        "areaServed": {
          "@type": "State",
          "name": "Chhattisgarh"
        },
        "description": "Responsive website development, landing page design, and bespoke digital solution portals for small and medium enterprises."
      });
    }

    // Person Schema for Harsh Patel
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": customPerson?.name || "Harsh Patel",
      "url": canonicalBase,
      "jobTitle": customPerson?.jobTitle || "Premium Freelance Website Designer & Digital Marketing Expert",
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Master of Business Administration (MBA)"
      },
      "sameAs": customPerson?.sameAs || ["https://instagram.com/harshdigitalstudios", "https://wa.me/917067363208"]
    });

    // FAQs Schema
    if (customFaqs && customFaqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": customFaqs.map((item: any) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      });
    }

    // Blog Schema
    if (customBlog) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": customBlog.headline,
        "description": customBlog.description,
        "author": {
          "@type": "Person",
          "name": customBlog.authorName
        },
        "publisher": {
          "@type": "Organization",
          "name": customBlog.publisherName,
          "logo": {
            "@type": "ImageObject",
            "url": customBlog.publisherLogo
          }
        },
        "datePublished": customBlog.datePublished
      });
    }

    // Breadcrumbs list
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": customBreadcrumbs.map((bc: any, idx: number) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": bc.name,
          "item": bc.url
        }))
      });
    } else {
      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const itemListElement = [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": canonicalBase
          }
        ];
        
        pathSegments.forEach((segment, index) => {
          const itemUrl = `${canonicalBase}/${pathSegments.slice(0, index + 1).join('/')}`;
          const formattedName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          itemListElement.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": formattedName,
            "item": itemUrl
          });
        });

        schemas.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": itemListElement
        });
      }
    }

    schemaScript.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(schemaScript);

  }, [location, updateTick]);

  return null;
}
