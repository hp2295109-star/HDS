import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // 1. Dynamic Meta Configuration depending on the current page path
    let title = "Harsh Digital Studios | Website Development & SEO in Raigarh, Chhattisgarh";
    let desc = "Harsh Digital Studios is a premium digital agency in Raigarh, Chhattisgarh. We design high-performance websites, local SEO, Google Business Profile optimization, and AI automation.";
    let keywords = "website development in raigarh, website designer in raigarh, seo services in raigarh, digital marketing agency in raigarh, google business profile optimization, ai automation services in raigarh, meta ads agency in raigarh, business website development, landing page design, responsive website development";
    const canonical = `https://harshdigitalstudios.com${path}`;
    
    // Map specific page paths
    if (path === '/') {
      title = "Harsh Digital Studios | Website Development & SEO in Raigarh, Chhattisgarh";
      desc = "Looking for website development in Raigarh, Chhattisgarh? We build fast, mobile responsive websites, boost Google visibility with Local SEO, and automate workflows with AI.";
    } else if (path === '/about') {
      title = "About Us | Harsh Digital Studios - Digital Marketing in Raigarh";
      desc = "Meet the founder Harsh and learn how Harsh Digital Studios helps local businesses in Raigarh, Chhattisgarh build trust and credibility with premium digital solutions.";
    } else if (path === '/services') {
      title = "Our Services | Website Design, SEO & Google Profile Optimization Raigarh";
      desc = "Explore our premium services: high-performance business website development, landing page design, search engine optimization (SEO), and AI automated messaging.";
    } else if (path === '/pricing') {
      title = "Transparent Pricing | Web Design & Marketing Services in Raigarh";
      desc = "Check out our affordable, transparent website development and SEO pricing models. Perfect for local shops, clinics, gyms, salons, and cafés in Raigarh.";
    } else if (path === '/portfolio') {
      title = "Our Portfolio | Best Web Designing & Business Websites in Raigarh";
      desc = "See how we help businesses in Raigarh grow. Browse our premium design, local SEO case studies, and fast mobile responsive website portfolio.";
    } else if (path === '/blog') {
      title = "Insights & Learning | Harsh Digital Studios - Local Business Growth Blog";
      desc = "Read our practical guides on Google Business Profile optimization, website development in Raigarh, SEO tactics, and how AI can scale your local business.";
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

    // 2. Set Page Title & Meta Tags
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
    setMetaTag('property', 'og:site_name', 'Harsh Digital Studios');
    setMetaTag('property', 'og:image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');

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

    // Build multi-layered JSON-LD schemas
    const schemas: any[] = [
      // WebSite Schema
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Harsh Digital Studios",
        "url": "https://harshdigitalstudios.com",
        "description": "Premium Web Design and SEO Agency in Raigarh, Chhattisgarh.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://harshdigitalstudios.com/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      // LocalBusiness & Organization Schema
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Harsh Digital Studios",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "@id": "https://harshdigitalstudios.com/#localbusiness",
        "url": "https://harshdigitalstudios.com",
        "telephone": "+917067363208",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Raigarh City Center",
          "addressLocality": "Raigarh",
          "addressRegion": "Chhattisgarh",
          "postalCode": "496001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 21.8974,
          "longitude": 83.3950
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "10:00",
          "closes": "19:00"
        },
        "sameAs": [
          "https://www.instagram.com/harshdigitalstudios",
          "https://wa.me/917067363208"
        ]
      },
      // Services Schema
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Website Development",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Harsh Digital Studios",
          "url": "https://harshdigitalstudios.com"
        },
        "areaServed": {
          "@type": "State",
          "name": "Chhattisgarh"
        },
        "description": "Responsive website development, landing page design, and bespoke digital solution portals for small and medium enterprises."
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Local SEO & Google Business Profile Optimization",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Harsh Digital Studios",
          "url": "https://harshdigitalstudios.com"
        },
        "areaServed": {
          "@type": "City",
          "name": "Raigarh"
        },
        "description": "Local search engine optimization (SEO) designed to help businesses appear on the top of Google Maps and regional search outputs."
      }
    ];

    // Breadcrumb Schema
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const itemListElement = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://harshdigitalstudios.com"
        }
      ];
      
      pathSegments.forEach((segment, index) => {
        const itemUrl = `https://harshdigitalstudios.com/${pathSegments.slice(0, index + 1).join('/')}`;
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

    schemaScript.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(schemaScript);

  }, [location]);

  return null;
}
