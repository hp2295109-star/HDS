export interface Intent {
  id: string;
  keywords: string[];
  responses: string[];
  suggestions: string[];
  actionButtons?: boolean;
}

export const INTENTS: Intent[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'start'],
    responses: [
      "Hello 👋 Welcome to Harsh Digital Studios. How can I help you today?",
      "Hi there! How can I assist you with your digital presence?",
      "Greetings! Looking to grow your business online?",
      "Hello! I'm here to answer any questions about our digital services.",
      "Hi 👋 I'm the HDS AI Assistant. What can I do for you today?"
    ],
    suggestions: ['Website', 'SEO', 'Meta Ads', 'AI Automation']
  },
  {
    id: 'goodbye',
    keywords: ['bye', 'goodbye', 'see ya', 'exit', 'cya', 'have a good day'],
    responses: [
      "Goodbye! Feel free to reach out if you need anything else.",
      "See you later! Have a great day.",
      "Bye! Don't hesitate to come back if you have more questions.",
      "Take care! Looking forward to hearing from you again.",
      "Goodbye! We're always here if you want to grow your digital presence."
    ],
    suggestions: ['Portfolio', 'Contact Us']
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'appreciate', 'thx', 'tysm'],
    responses: [
      "You're very welcome! Anything else I can help with?",
      "Happy to help! Let me know if you need anything else.",
      "No problem at all! Feel free to ask more questions.",
      "My pleasure! Can I assist you with another topic?",
      "Glad I could help! Is there anything else on your mind?"
    ],
    suggestions: ['Book Consultation', 'Website Pricing']
  },
  {
    id: 'yes',
    keywords: ['yes', 'yeah', 'yep', 'sure', 'okay', 'yup', 'definitely', 'absolutely'],
    responses: [
      "Great! How would you like to proceed?",
      "Awesome. Let me know what you need next.",
      "Perfect! What's the next step you'd like to take?",
      "Excellent. I'm ready when you are.",
      "Sounds good! How can we help further?"
    ],
    suggestions: ['Book Meeting', 'Chat on WhatsApp']
  },
  {
    id: 'no',
    keywords: ['no', 'nope', 'nah', 'not now', 'not really'],
    responses: [
      "No problem. Let me know if you change your mind.",
      "Alright, that's completely fine. Anything else?",
      "Understood. Just let me know if you need any other info.",
      "Got it. I'm here if you have any other questions.",
      "No worries! Feel free to explore our site."
    ],
    suggestions: ['Portfolio', 'Services']
  },
  {
    id: 'website_dev',
    keywords: ['website', 'web design', 'build website', 'create website', 'need website', 'business website', 'develop website'],
    responses: [
      "We specialize in building premium, high-converting websites. Our focus is on modern design and fast load times.",
      "A professional website acts as your 24/7 salesperson. We build custom websites tailored to your brand's unique needs.",
      "Our website development process covers everything from UI/UX design to seamless development and deployment.",
      "Looking for a new website? We create responsive, visually stunning websites that drive real business results.",
      "We design and develop custom websites that not only look great but are optimized for conversions and search engines."
    ],
    suggestions: ['Website Pricing', 'Website Speed', 'Book Consultation']
  },
  {
    id: 'landing_page',
    keywords: ['landing page', 'sales page', 'squeeze page', 'promo page'],
    responses: [
      "Landing pages need to convert. We design high-converting pages with clear calls to action and persuasive layouts.",
      "If you're running ads, a dedicated landing page is essential. We build them for maximum lead generation.",
      "Our custom landing pages are optimized for speed, clarity, and conversion rate optimization (CRO).",
      "We can create targeted landing pages that match your ad campaigns perfectly, increasing your ROI.",
      "A great landing page focuses on one goal. We design them to turn your visitors into paying customers."
    ],
    suggestions: ['Meta Ads', 'Lead Generation', 'Website Pricing']
  },
  {
    id: 'website_redesign',
    keywords: ['redesign', 'update website', 'change website', 'revamp', 'makeover'],
    responses: [
      "Is your current website feeling outdated? We can completely revamp it with a modern, premium look.",
      "A website redesign can significantly improve user experience and conversion rates. We'd love to help.",
      "We analyze your current site's weaknesses and redesign it to better reflect your brand and goals.",
      "Upgrading your website's design and functionality is a great way to re-engage your audience.",
      "We handle seamless website redesigns, ensuring your SEO is preserved while giving you a fresh new digital presence."
    ],
    suggestions: ['Website Pricing', 'SEO Audit', 'Portfolio']
  },
  {
    id: 'website_speed',
    keywords: ['website speed', 'slow website', 'fast website', 'optimize website', 'core web vitals', 'loading time'],
    responses: [
      "Website speed is crucial for both SEO and user experience. We optimize for 90+ scores on Google PageSpeed Insights.",
      "A slow website loses customers. We build lightning-fast experiences using modern tech stacks like React and Tailwind.",
      "We can optimize your existing site's speed or build a new one from scratch that loads instantly.",
      "Fast loading times directly impact your conversion rates. We prioritize performance in all our builds.",
      "If your site is slow, we can run an audit and implement caching, image optimization, and code minification."
    ],
    suggestions: ['Website Development', 'SEO Audit', 'Consultation']
  },
  {
    id: 'seo',
    keywords: ['seo', 'search engine', 'ranking', 'google ranking', 'rank my website', 'organic traffic'],
    responses: [
      "Our SEO services focus on long-term organic growth. We handle technical SEO, on-page optimization, and content strategy.",
      "Want to rank higher on Google? We use data-driven SEO strategies to get your business in front of the right audience.",
      "SEO is an investment. We optimize your digital presence to ensure consistent, free traffic over time.",
      "We implement proven SEO techniques to improve your search visibility and outrank your local competitors.",
      "From keyword research to technical audits, we provide comprehensive SEO solutions for lasting results."
    ],
    suggestions: ['Local SEO', 'Google Business Profile', 'SEO Pricing']
  },
  {
    id: 'local_seo',
    keywords: ['local seo', 'rank locally', 'local ranking', 'search near me', 'local business'],
    responses: [
      "For local businesses, local SEO is essential. We optimize your online presence to capture 'near me' searches.",
      "We specialize in local SEO, helping physical businesses dominate their local market and Google Maps.",
      "Our local SEO strategy ensures your business shows up when local customers are actively searching for your services.",
      "We optimize local citations and local keywords so your community can easily find you.",
      "Want more foot traffic or local calls? Our local SEO services are designed exactly for that."
    ],
    suggestions: ['Google Business Profile', 'Lead Generation']
  },
  {
    id: 'gmb',
    keywords: ['gmb', 'google business profile', 'google my business', 'google map', 'map ranking'],
    responses: [
      "An optimized Google Business Profile is key to local success. We set it up and manage it to maximize visibility.",
      "We help you rank higher on Google Maps by fully optimizing your Google Business Profile with keywords and updates.",
      "Your Google Business Profile is often the first thing customers see. We ensure it makes a perfect first impression.",
      "We can help you gather more reviews and optimize your profile to stand out from local competitors.",
      "A well-maintained GMB profile drives direct calls and website visits. We handle the optimization for you."
    ],
    suggestions: ['Local SEO', 'Review Automation']
  },
  {
    id: 'meta_ads',
    keywords: ['meta ads', 'facebook ads', 'fb ads', 'instagram ads', 'ig ads', 'paid social'],
    responses: [
      "Meta ads (Facebook & Instagram) are incredible for generating immediate demand. We create highly targeted campaigns.",
      "We design ad creatives, write compelling copy, and manage your Meta ad campaigns for maximum ROI.",
      "Looking for quick leads? Our Meta ad strategies target your ideal audience with precision to drive conversions.",
      "We handle end-to-end Facebook and Instagram advertising, from setup and pixel tracking to scaling winning ads.",
      "Meta ads build brand awareness while generating leads. We optimize campaigns daily to ensure cost-effective results."
    ],
    suggestions: ['Lead Generation', 'Google Ads', 'Ad Pricing']
  },
  {
    id: 'google_ads',
    keywords: ['google ads', 'adwords', 'ppc', 'search ads', 'pay per click'],
    responses: [
      "Google Ads capture high-intent customers who are actively searching for your services. We manage campaigns for peak efficiency.",
      "We set up and optimize Google Search campaigns to ensure you appear exactly when your customers need you.",
      "Our Google Ads management focuses on lowering your cost-per-click while increasing lead quality.",
      "Want immediate traffic from Google? We build targeted PPC campaigns that deliver measurable ROI.",
      "We handle keyword research, ad copywriting, and continuous optimization for your Google Ads account."
    ],
    suggestions: ['Meta Ads', 'Landing Pages']
  },
  {
    id: 'social_media',
    keywords: ['social media', 'smm', 'social media management', 'manage social', 'content creation'],
    responses: [
      "We offer social media management to keep your brand active and engaging across all major platforms.",
      "Consistent social media presence builds trust. We handle content creation, posting, and community engagement.",
      "Our team creates high-quality, branded content tailored for your specific social media audience.",
      "We can help grow your following and engage your audience with a strategic social media content plan.",
      "Need a hands-off social media solution? We manage everything from graphics to captions and scheduling."
    ],
    suggestions: ['Instagram Marketing', 'Brand Identity']
  },
  {
    id: 'instagram_marketing',
    keywords: ['instagram marketing', 'grow instagram', 'ig growth', 'reels', 'instagram strategy'],
    responses: [
      "Instagram is highly visual. We focus on aesthetic grids, engaging Reels, and stories that convert followers to clients.",
      "We can help you grow your Instagram presence organically with high-quality content and strategic engagement.",
      "Our Instagram marketing strategies are designed to build a loyal community around your brand.",
      "We specialize in Instagram content creation, including short-form video (Reels) to maximize your reach.",
      "Want to leverage Instagram for business? We create tailored strategies that align with your brand goals."
    ],
    suggestions: ['Social Media', 'Meta Ads']
  },
  {
    id: 'facebook_marketing',
    keywords: ['facebook marketing', 'fb marketing', 'facebook page', 'facebook group'],
    responses: [
      "We manage Facebook business pages to foster community and share valuable updates with your audience.",
      "Facebook remains a powerful tool for local businesses. We create content that resonates with your local demographic.",
      "Our Facebook marketing involves regular posting, engaging with comments, and sharing your brand's story.",
      "We can optimize your Facebook page and ensure it acts as a strong secondary storefront for your business.",
      "From setting up the page correctly to managing daily content, we handle your Facebook presence completely."
    ],
    suggestions: ['Meta Ads', 'Social Media']
  },
  {
    id: 'brand_identity',
    keywords: ['brand identity', 'branding', 'brand guidelines', 'brand style', 'rebrand'],
    responses: [
      "A strong brand identity sets you apart. We create cohesive visual systems including colors, typography, and logos.",
      "We craft premium brand identities that communicate your business's unique value and resonate with your audience.",
      "Our branding services include everything from initial concept to a complete brand guidelines document.",
      "Looking to rebrand? We can modernize your visual identity while retaining your core business essence.",
      "We build brands that look professional and trustworthy across all digital and physical touchpoints."
    ],
    suggestions: ['Logo Design', 'Website Development']
  },
  {
    id: 'logo_design',
    keywords: ['logo', 'logo design', 'create logo', 'make a logo'],
    responses: [
      "Your logo is your primary identifier. We design memorable, versatile logos that represent your brand perfectly.",
      "We offer custom logo design services, focusing on modern, clean, and impactful aesthetics.",
      "Our logo design process involves multiple concepts and revisions to ensure you get exactly what you envision.",
      "A professional logo builds instant credibility. We craft logos that look great on websites, social media, and print.",
      "Need a new logo? Our designers create bespoke logos that align with your overall brand strategy."
    ],
    suggestions: ['Brand Identity', 'Website Development']
  },
  {
    id: 'ai_automation',
    keywords: ['ai', 'automation', 'artificial intelligence', 'automate', 'workflows'],
    responses: [
      "We implement smart AI workflows to automate repetitive tasks, saving you hours of manual work every week.",
      "AI automation can handle lead qualification, appointment booking, and customer queries 24/7.",
      "We integrate AI solutions into your existing business processes to increase efficiency and reduce errors.",
      "From automated emails to smart chatbots, we build custom AI systems tailored to your business needs.",
      "Leverage the power of AI to scale your operations without needing to hire additional administrative staff."
    ],
    suggestions: ['WhatsApp Automation', 'CRM Automation', 'Consultation']
  },
  {
    id: 'whatsapp_automation',
    keywords: ['whatsapp', 'wa automation', 'whatsapp bot', 'whatsapp integration', 'whatsapp api'],
    responses: [
      "We build intelligent WhatsApp chatbots that can answer FAQs, capture leads, and book appointments automatically.",
      "WhatsApp automation ensures your customers get instant replies, even when you're asleep or busy.",
      "We integrate WhatsApp Business API with your website to streamline customer communication and sales.",
      "Imagine a system that automatically follows up with leads on WhatsApp. We build that for you.",
      "Our WhatsApp bots are designed to feel natural while handling routine customer inquiries efficiently."
    ],
    suggestions: ['AI Automation', 'Lead Generation']
  },
  {
    id: 'crm_automation',
    keywords: ['crm', 'customer relationship management', 'hubspot', 'salesforce', 'zoho', 'lead tracking'],
    responses: [
      "We set up and automate CRMs so you never lose track of a lead again. Everything is organized in one place.",
      "Our CRM automation ensures leads are automatically captured from your website and assigned to the right team member.",
      "We integrate your website with CRMs like HubSpot, automatically triggering welcome emails and follow-ups.",
      "A well-automated CRM saves time and increases close rates by ensuring consistent follow-up.",
      "We streamline your sales pipeline by automating data entry and lead nurturing within your CRM."
    ],
    suggestions: ['Lead Generation', 'AI Automation']
  },
  {
    id: 'lead_generation',
    keywords: ['lead generation', 'leads', 'get clients', 'more customers', 'lead gen', 'sales funnel'],
    responses: [
      "We build complete lead generation funnels, combining targeted ads with high-converting landing pages.",
      "Looking for more clients? We implement strategies that attract and capture high-quality leads for your business.",
      "Our lead generation approach focuses on ROI. We want to bring you customers, not just traffic.",
      "We use a mix of SEO, Meta Ads, and optimized web design to create a consistent flow of inbound leads.",
      "From offering lead magnets to optimizing contact forms, we maximize every opportunity to capture visitor info."
    ],
    suggestions: ['Meta Ads', 'Landing Pages', 'CRM Automation']
  },
  {
    id: 'pricing',
    keywords: ['cost', 'price', 'pricing', 'how much', 'quote', 'budget', 'expensive'],
    responses: [
      "Our pricing is project-based and depends entirely on your specific requirements, goals, and feature needs.",
      "We offer flexible packages tailored to provide maximum ROI. We'd need to discuss your needs to give an accurate quote.",
      "To give you an accurate price, we first need to understand the scope of your project. Let's have a quick chat!",
      "Our services are an investment in your growth. We customize our pricing based on the value and complexity of the work.",
      "We don't do one-size-fits-all pricing. Let's schedule a brief consultation to figure out the best solution for your budget."
    ],
    suggestions: ['Book Consultation', 'Chat on WhatsApp', 'Project Timeline']
  },
  {
    id: 'timeline',
    keywords: ['timeline', 'how long', 'duration', 'time', 'when', 'fast', 'quick'],
    responses: [
      "Most of our website projects take 2-4 weeks from start to finish, depending on complexity and revisions.",
      "For marketing campaigns and ads, we can typically get everything launched within 5-7 business days.",
      "The timeline depends on the project scope. A standard landing page might take a week, while a full ecommerce site takes longer.",
      "We work efficiently to meet deadlines. We'll provide a clear project roadmap and timeline before we begin.",
      "Once we have all the requirements and assets, our team moves quickly to design, develop, and launch."
    ],
    suggestions: ['Process', 'Pricing', 'Book Consultation']
  },
  {
    id: 'support',
    keywords: ['support', 'help', 'maintenance', 'issue', 'fix', 'broken', 'update'],
    responses: [
      "We provide ongoing maintenance and support to ensure your digital presence remains fast, secure, and up-to-date.",
      "Need help with an existing project? We offer dedicated support retainers for our clients.",
      "Our support team is always ready to assist with updates, security patches, or any technical issues.",
      "We don't just build and leave. We offer continuous support to help your business adapt and grow.",
      "Whether it's a minor text change or a major update, our maintenance packages have you covered."
    ],
    suggestions: ['Hosting', 'Contact Us']
  },
  {
    id: 'hosting',
    keywords: ['hosting', 'server', 'where to host', 'aws', 'vercel', 'netlify', 'deploy'],
    responses: [
      "We handle all the technical details of hosting. We typically use fast, modern platforms like Vercel or Netlify.",
      "Our hosting solutions guarantee high uptime, fast global delivery, and top-tier security.",
      "You don't need to worry about servers. We deploy your site on optimized cloud infrastructure.",
      "We recommend and set up the best hosting environment based on your website's traffic and technology.",
      "Included in our web packages is seamless deployment and configuration of your hosting environment."
    ],
    suggestions: ['Domain', 'Support']
  },
  {
    id: 'domain',
    keywords: ['domain', 'url', 'website name', '.com', 'buy domain'],
    responses: [
      "If you don't have a domain yet, we can help you select and purchase the perfect one for your brand.",
      "We handle all domain DNS configurations and connect it seamlessly to your new website.",
      "You retain full ownership of your domain. We just help with the technical setup and SSL configuration.",
      "We can assist in migrating your existing domain to point to your newly developed website.",
      "Your domain is your digital address. We'll ensure it's properly secured and configured."
    ],
    suggestions: ['Hosting', 'Website Development']
  },
  {
    id: 'portfolio',
    keywords: ['portfolio', 'past work', 'examples', 'case studies', 'show me', 'previous work'],
    responses: [
      "We have a diverse portfolio of successful projects. You can view them on our dedicated Portfolio page.",
      "We've helped numerous local businesses grow. Feel free to browse our recent case studies and live sites.",
      "Our work speaks for itself. Check out our portfolio to see the quality of design and development we deliver.",
      "From gyms to salons, we've built high-converting sites across industries. Take a look at our portfolio!",
      "We'd love to show you what we can do. You can find links to our live client projects in our portfolio section."
    ],
    suggestions: ['View Portfolio', 'Contact Us']
  },
  {
    id: 'process',
    keywords: ['how we work', 'process', 'steps', 'how it works', 'methodology'],
    responses: [
      "Our process is straightforward: 1. Discovery Call 2. Strategy & Design 3. Development 4. Launch & Optimize.",
      "We start by deeply understanding your business goals, then we design, build, and deploy with constant communication.",
      "We believe in transparency. You'll be involved in key review stages during design and development.",
      "It begins with a free strategy call. Once aligned, we handle the heavy lifting while keeping you updated.",
      "Our agile process ensures rapid delivery without compromising on premium quality or performance."
    ],
    suggestions: ['Project Timeline', 'Book Consultation']
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone', 'call', 'reach out', 'talk to human'],
    responses: [
      "You can reach us directly via WhatsApp, email, or by scheduling a video call.",
      "We'd love to hear from you! The fastest way to connect is through WhatsApp or booking a strategy session.",
      "Our team is ready to discuss your project. Feel free to use the contact form or message us directly.",
      "Want to talk details? Let's connect. You can book a free consultation or drop us a message on WhatsApp.",
      "We are always just a message away. Reach out to us via our Contact page or the floating WhatsApp button."
    ],
    suggestions: ['Book Meeting', 'Chat on WhatsApp']
  },
  {
    id: 'consultation',
    keywords: ['consultation', 'meeting', 'book', 'schedule', 'strategy call', 'audit'],
    responses: [
      "Our free strategy calls are designed to understand your goals and map out a digital growth plan.",
      "Let's get on a call! We offer a no-obligation consultation to discuss how we can help your business.",
      "Booking a consultation is the best first step. We'll audit your current presence and suggest improvements.",
      "Ready to grow? Schedule a free 30-minute strategy session with our team to explore the possibilities.",
      "During our free consultation, we provide actionable advice tailored to your specific business challenges."
    ],
    suggestions: ['Book Meeting', 'Chat on WhatsApp']
  },
  {
    id: 'growth_calculator',
    keywords: ['calculator', 'growth calculator', 'assessment', 'audit', 'score'],
    responses: [
      "Have you tried our Business Growth Calculator? It's a free AI tool that analyzes your digital presence.",
      "You can get a personalized digital growth report instantly by taking our free online assessment.",
      "Our Growth Calculator helps identify gaps in your marketing and provides a 90-day action plan.",
      "Take our free 2-minute assessment to discover your business's true online potential.",
      "Curious about your digital score? Try our AI-powered Business Growth Calculator for personalized insights."
    ],
    suggestions: ['Try Calculator', 'SEO Audit']
  }
];

export const FALLBACK_RESPONSES = [
  "I'm not completely sure I understood your question. Could you rephrase it or choose one of the options below?",
  "I might need a bit more context. Feel free to rephrase or select a topic from the suggestions.",
  "That's an interesting question, but I'm not entirely sure how to answer. Would you like to connect with our team directly?",
  "I'm still learning and might have misunderstood. Could you try asking in a different way or check our services?",
  "To give you the best answer, I think it's better if we chat directly. Would you like to book a quick call?"
];
