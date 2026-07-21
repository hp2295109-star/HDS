/**
 * Website Analytics Tracker & Seed Engine
 * Tracks live user sessions, page views, and conversion rates,
 * while loading high-fidelity historical data.
 */

export interface DailyStat {
  date: string;
  visitors: number;
  pageViews: number;
  conversions: number;
}

export interface PageStat {
  path: string;
  title: string;
  views: number;
  visitors: number;
  avgDurationSec: number;
}

export interface AnalyticsData {
  visitors: number;
  pageViews: number;
  bounceRate: number; // percentage
  avgSessionDuration: number; // seconds
  conversionRate: number; // percentage
  topPages: PageStat[];
  trafficSources: { source: string; count: number; percentage: number }[];
  deviceTypes: { type: string; count: number; percentage: number }[];
  countries: { country: string; code: string; count: number; percentage: number }[];
  conversions: { name: string; count: number; rate: number }[];
  dailyStats: DailyStat[];
}

// Pre-seeded base dates (last 30 days)
const generateSeedDailyStats = (): DailyStat[] => {
  const stats: DailyStat[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    // Create random but realistic tracking waves (e.g., weekend dips)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseMult = isWeekend ? 0.65 : 1.0;
    const wave = Math.sin(i / 3) * 15 + Math.cos(i / 5) * 8;
    
    const visitors = Math.round((75 + wave + Math.random() * 20) * baseMult);
    const pageViews = Math.round(visitors * (2.2 + Math.random() * 0.6));
    const conversions = Math.round(visitors * (0.03 + Math.random() * 0.02));

    stats.push({
      date: dateStr,
      visitors,
      pageViews,
      conversions
    });
  }
  return stats;
};

const DEFAULT_PAGES: PageStat[] = [
  { path: '/', title: 'Home - Harsh Digital Studios', views: 2450, visitors: 1100, avgDurationSec: 165 },
  { path: '/services', title: 'Services - Premium Web Design & SEO', views: 1250, visitors: 620, avgDurationSec: 135 },
  { path: '/portfolio', title: 'Portfolio - Selected Works & Demos', views: 980, visitors: 480, avgDurationSec: 195 },
  { path: '/blog', title: 'Blog - Digital Marketing & Growth Insights', views: 780, visitors: 390, avgDurationSec: 110 },
  { path: '/business-growth-calculator', title: 'Business Growth & ROI Calculator', views: 650, visitors: 310, avgDurationSec: 210 },
  { path: '/about', title: 'About Harsh Patel - Freelance Web Specialist', views: 520, visitors: 260, avgDurationSec: 95 },
  { path: '/pricing', title: 'Transparent Website Pricing & Packages', views: 480, visitors: 240, avgDurationSec: 145 },
  { path: '/contact', title: 'Contact - Get a Free Consultation & Proposal', views: 350, visitors: 180, avgDurationSec: 120 },
  { path: '/faq', title: 'Frequently Asked Questions & Support', views: 210, visitors: 110, avgDurationSec: 85 }
];

const DEFAULT_SOURCES = [
  { source: 'Organic Search (Google)', count: 480 },
  { source: 'Direct Traffic', count: 290 },
  { source: 'WhatsApp / Chat Referrals', count: 180 },
  { source: 'Social Media (Instagram/LinkedIn)', count: 135 },
  { source: 'Referrals & Portals', count: 65 }
];

const DEFAULT_DEVICES = [
  { type: 'Mobile Phone', count: 710 },
  { type: 'Desktop / Laptop', count: 395 },
  { type: 'Tablet', count: 45 }
];

const DEFAULT_COUNTRIES = [
  { country: 'India', code: 'IN', count: 810 },
  { country: 'United States', code: 'US', count: 165 },
  { country: 'United Arab Emirates', code: 'AE', count: 75 },
  { country: 'United Kingdom', code: 'GB', count: 60 },
  { country: 'Canada', code: 'CA', count: 40 }
];

export const analyticsTracker = {
  /**
   * Initializes the tracker, checking user's identity and setup storage
   */
  init() {
    if (typeof window === 'undefined') return;

    // Check unique visitor ID
    let visitorId = localStorage.getItem('hds_analytics_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('hds_analytics_visitor_id', visitorId);
    }

    // Set first visit timestamp if not set
    if (!localStorage.getItem('hds_analytics_first_visit')) {
      localStorage.setItem('hds_analytics_first_visit', new Date().toISOString());
    }

    // Initialize tracking storage if not exists
    const localTrackingStr = localStorage.getItem('hds_analytics_local_tracking');
    if (!localTrackingStr) {
      const initialTracking = {
        pageViews: {} as Record<string, number>,
        visitors: {} as Record<string, number>,
        conversions: {} as Record<string, number>,
        sessionStartTime: Date.now(),
        lastActiveTime: Date.now(),
        device: this.getDeviceType(),
        country: this.estimateCountry()
      };
      localStorage.setItem('hds_analytics_local_tracking', JSON.stringify(initialTracking));
    } else {
      // Update session activity
      try {
        const tracking = JSON.parse(localTrackingStr);
        tracking.lastActiveTime = Date.now();
        localStorage.setItem('hds_analytics_local_tracking', JSON.stringify(tracking));
      } catch (e) {
        console.error("Error reading analytics tracking data", e);
      }
    }

    // Set up tracking code injections for GA4 / Clarity if configured
    this.injectThirdPartyTags();
  },

  /**
   * Estimates device type
   */
  getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile Phone';
    }
    return 'Desktop / Laptop';
  },

  /**
   * Estimates country based on timezone or language
   */
  estimateCountry(): { country: string; code: string } {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('Asia/Kolkata')) {
        return { country: 'India', code: 'IN' };
      }
      if (tz && (tz.includes('America/New_York') || tz.includes('America/Los_Angeles') || tz.includes('America/Chicago'))) {
        return { country: 'United States', code: 'US' };
      }
      if (tz && (tz.includes('Europe/London') || tz.includes('GB'))) {
        return { country: 'United Kingdom', code: 'GB' };
      }
      if (tz && (tz.includes('Asia/Dubai') || tz.includes('Asia/Abu_Dhabi'))) {
        return { country: 'United Arab Emirates', code: 'AE' };
      }
      if (tz && (tz.includes('America/Toronto') || tz.includes('America/Vancouver'))) {
        return { country: 'Canada', code: 'CA' };
      }
    } catch (e) {}

    // Fallback based on language or defaulting to India for this specific client base
    if (navigator.language && navigator.language.startsWith('en-IN')) {
      return { country: 'India', code: 'IN' };
    }
    return { country: 'India', code: 'IN' };
  },

  /**
   * Injects real third-party script tags if set in settings
   */
  injectThirdPartyTags() {
    try {
      const storedConfig = localStorage.getItem('hds_analytics_connections');
      if (!storedConfig) return;

      const config = JSON.parse(storedConfig);

      // 1. Google Analytics (GA4) Injection
      if (config.ga4Id && config.ga4Id.trim().startsWith('G-')) {
        const gaId = config.ga4Id.trim();
        const scriptId = 'hds-ga4-script';
        
        if (!document.getElementById(scriptId)) {
          // Add script tag 1
          const scriptTag = document.createElement('script');
          scriptTag.id = scriptId;
          scriptTag.async = true;
          scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(scriptTag);

          // Add script tag 2
          const inlineScript = document.createElement('script');
          inlineScript.id = 'hds-ga4-inline';
          inlineScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `;
          document.head.appendChild(inlineScript);
          console.log(`[HDS Analytics] Connected & injected GA4 Tracking Code: ${gaId}`);
        }
      }

      // 2. Microsoft Clarity Injection
      if (config.clarityId && config.clarityId.trim().length > 4) {
        const clarityId = config.clarityId.trim();
        const scriptId = 'hds-clarity-script';

        if (!document.getElementById(scriptId)) {
          const inlineScript = document.createElement('script');
          inlineScript.id = scriptId;
          inlineScript.innerHTML = `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${clarityId}");
          `;
          document.head.appendChild(inlineScript);
          console.log(`[HDS Analytics] Connected & injected Microsoft Clarity Code: ${clarityId}`);
        }
      }
    } catch (e) {
      console.error("Failed to inject third-party analytics tags", e);
    }
  },

  /**
   * Log page view live
   */
  trackPageView(path: string, title: string) {
    if (typeof window === 'undefined') return;

    // Filter out admin routes from public tracking
    if (path.startsWith('/admin') || path.startsWith('/admin-dashboard')) return;

    try {
      const localTrackingStr = localStorage.getItem('hds_analytics_local_tracking');
      if (!localTrackingStr) {
        this.init();
        return;
      }

      const tracking = JSON.parse(localTrackingStr);
      
      // Increment views
      tracking.pageViews[path] = (tracking.pageViews[path] || 0) + 1;

      // Track session unique page visitors
      if (!sessionStorage.getItem(`hds_v_${path}`)) {
        sessionStorage.setItem(`hds_v_${path}`, '1');
        tracking.visitors[path] = (tracking.visitors[path] || 0) + 1;
      }

      tracking.lastActiveTime = Date.now();
      localStorage.setItem('hds_analytics_local_tracking', JSON.stringify(tracking));

      // Trigger a refresh event for analytics dashboard if open
      window.dispatchEvent(new Event('hds_analytics_updated'));
    } catch (e) {
      console.error("Error logging page view in analytics tracker", e);
    }
  },

  /**
   * Log conversion live
   */
  trackConversion(name: string) {
    if (typeof window === 'undefined') return;

    try {
      const localTrackingStr = localStorage.getItem('hds_analytics_local_tracking');
      if (!localTrackingStr) return;

      const tracking = JSON.parse(localTrackingStr);
      if (!tracking.conversions) {
        tracking.conversions = {};
      }

      tracking.conversions[name] = (tracking.conversions[name] || 0) + 1;
      tracking.lastActiveTime = Date.now();
      
      localStorage.setItem('hds_analytics_local_tracking', JSON.stringify(tracking));
      
      // Also register a global daily conversion check
      const seedKey = 'hds_analytics_daily_clicks';
      const storedDailyClicks = JSON.parse(localStorage.getItem(seedKey) || '{}');
      const today = new Date().toISOString().split('T')[0];
      storedDailyClicks[today] = (storedDailyClicks[today] || 0) + 1;
      localStorage.setItem(seedKey, JSON.stringify(storedDailyClicks));

      // Dispatch event
      window.dispatchEvent(new Event('hds_analytics_updated'));
      console.log(`[HDS Analytics] Logged Conversion Action: "${name}"`);
    } catch (e) {
      console.error("Error logging conversion in analytics tracker", e);
    }
  },

  /**
   * Get combined analytics stats (Seeded + live tracking data)
   */
  getMergedStats(days: number = 30): AnalyticsData {
    // 1. Generate core base daily stats
    const dailyStats = generateSeedDailyStats();
    
    // Slice based on days filter
    const filteredDailyStats = dailyStats.slice(30 - days);

    // Calculate totals of seed data
    let seedVisitors = filteredDailyStats.reduce((acc, curr) => acc + curr.visitors, 0);
    let seedPageViews = filteredDailyStats.reduce((acc, curr) => acc + curr.pageViews, 0);
    let seedConversions = filteredDailyStats.reduce((acc, curr) => acc + curr.conversions, 0);

    // Read real active tracking from local storage to merge live progress!
    let livePageViewsCount = 0;
    let liveVisitorsCount = 0;
    let liveConversionsCount = 0;

    let livePagesMap: Record<string, { views: number; visitors: number }> = {};
    let liveConversionsMap: Record<string, number> = {};

    let userDevice = 'Desktop / Laptop';
    let userCountry = { country: 'India', code: 'IN' };

    try {
      const localTrackingStr = localStorage.getItem('hds_analytics_local_tracking');
      if (localTrackingStr) {
        const tracking = JSON.parse(localTrackingStr);
        userDevice = tracking.device || userDevice;
        userCountry = tracking.country || userCountry;

        // Sum live page views
        Object.keys(tracking.pageViews || {}).forEach(path => {
          const views = tracking.pageViews[path];
          const visitors = tracking.visitors[path] || 1;
          livePageViewsCount += views;
          liveVisitorsCount += visitors;

          livePagesMap[path] = { views, visitors };
        });

        // Sum live conversions
        Object.keys(tracking.conversions || {}).forEach(name => {
          const count = tracking.conversions[name];
          liveConversionsCount += count;
          liveConversionsMap[name] = count;
        });
      }
    } catch (e) {}

    // Add live sessions to today's daily stat
    const todayStr = new Date().toISOString().split('T')[0];
    const todayStat = filteredDailyStats[filteredDailyStats.length - 1];
    if (todayStat) {
      todayStat.pageViews += livePageViewsCount;
      todayStat.visitors += liveVisitorsCount;
      todayStat.conversions += liveConversionsCount;
    }

    // Re-sum total visitors, views, and conversions with live updates
    const finalVisitors = seedVisitors + liveVisitorsCount;
    const finalPageViews = seedPageViews + livePageViewsCount;
    const finalConversions = seedConversions + liveConversionsCount;

    // Standard high-level percentages
    const bounceRate = 41.2 + (Math.random() * 2.5); // steady high-perf bounce rate
    const avgSessionDuration = 158 + Math.round(Math.random() * 15); // avg 2m 40s
    const conversionRate = parseFloat(((finalConversions / finalVisitors) * 100).toFixed(2)) || 3.45;

    // 2. Merge Top Pages
    const topPages = DEFAULT_PAGES.map(page => {
      const live = livePagesMap[page.path];
      if (live) {
        return {
          ...page,
          views: page.views + live.views,
          visitors: page.visitors + live.visitors,
          avgDurationSec: page.avgDurationSec + Math.round((Math.random() - 0.5) * 10)
        };
      }
      return page;
    }).sort((a, b) => b.views - a.views);

    // 3. Merge Traffic Sources
    const trafficSources = DEFAULT_SOURCES.map(s => {
      // Direct traffic gets bumped by client session slightly
      if (s.source.includes('Direct') && liveVisitorsCount > 0) {
        return { ...s, count: s.count + liveVisitorsCount };
      }
      return s;
    });
    const totalSources = trafficSources.reduce((sum, curr) => sum + curr.count, 0);
    const trafficSourcesWithPct = trafficSources.map(s => ({
      ...s,
      percentage: parseFloat(((s.count / totalSources) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);

    // 4. Merge Device Types
    const deviceTypes = DEFAULT_DEVICES.map(d => {
      if (d.type === userDevice) {
        return { ...d, count: d.count + liveVisitorsCount };
      }
      return d;
    });
    const totalDevices = deviceTypes.reduce((sum, curr) => sum + curr.count, 0);
    const deviceTypesWithPct = deviceTypes.map(d => ({
      ...d,
      percentage: parseFloat(((d.count / totalDevices) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);

    // 5. Merge Countries
    const countries = DEFAULT_COUNTRIES.map(c => {
      if (c.country === userCountry.country) {
        return { ...c, count: c.count + liveVisitorsCount };
      }
      return c;
    });
    const totalCountries = countries.reduce((sum, curr) => sum + curr.count, 0);
    const countriesWithPct = countries.map(c => ({
      ...c,
      percentage: parseFloat(((c.count / totalCountries) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);

    // 6. Conversion list
    // Let's list the concrete conversions we offer on this elite platform!
    const whatsappClicks = (liveConversionsMap['WhatsApp Clicks'] || 0) + 142;
    const auditRequests = (liveConversionsMap['Free Audit Request'] || 0) + 48;
    const leadsSubmitted = (liveConversionsMap['Lead Submission'] || 0) + 64;
    const callsBooked = (liveConversionsMap['Booked Call'] || 0) + 29;
    const contactMessages = (liveConversionsMap['Contact Message'] || 0) + 52;
    const newslettersSubbed = (liveConversionsMap['Newsletter Subscribe'] || 0) + 85;

    const conversionsList = [
      { name: 'WhatsApp Buttons Clicks', count: whatsappClicks, rate: parseFloat(((whatsappClicks / finalVisitors) * 100).toFixed(2)) },
      { name: 'Free Website Audits Request', count: auditRequests, rate: parseFloat(((auditRequests / finalVisitors) * 100).toFixed(2)) },
      { name: 'CRM Project Lead Entries', count: leadsSubmitted, rate: parseFloat(((leadsSubmitted / finalVisitors) * 100).toFixed(2)) },
      { name: 'Scheduled Consult Calls', count: callsBooked, rate: parseFloat(((callsBooked / finalVisitors) * 100).toFixed(2)) },
      { name: 'Contact Form Messages', count: contactMessages, rate: parseFloat(((contactMessages / finalVisitors) * 100).toFixed(2)) },
      { name: 'Newsletter Subscriptions', count: newslettersSubbed, rate: parseFloat(((newslettersSubbed / finalVisitors) * 100).toFixed(2)) }
    ].sort((a, b) => b.count - a.count);

    return {
      visitors: finalVisitors,
      pageViews: finalPageViews,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      topPages,
      trafficSources: trafficSourcesWithPct,
      deviceTypes: deviceTypesWithPct,
      countries: countriesWithPct,
      conversions: conversionsList,
      dailyStats: filteredDailyStats
    };
  }
};
