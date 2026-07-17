import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lead, ContactMessage, Newsletter, WebsiteAudit, BookedCall, Testimonial, BlogPost } from '../types/supabase';

// Helper to simulate network latency for fallback mode
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Service to handle all interactions with the Supabase backend.
 * Operates with automated simulated fallback when VITE_SUPABASE_URL is not set.
 */
export const supabaseService = {
  /**
   * 1. Save a new lead
   */
  async submitLead(lead: Lead): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured) {
      console.log('SIMULATION: Submitting Lead to Supabase', lead);
      await sleep(1000);
      return { success: true, data: { id: 'simulated-lead-id', ...lead } };
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            business_name: lead.business_name,
            service: lead.service,
            budget: lead.budget,
            message: lead.message,
            status: lead.status || 'New',
            source: lead.source || window.location.pathname,
            ip_address: lead.ip_address || 'client-side-submission',
            device: lead.device || (window.navigator?.userAgent || 'unknown'),
            city: lead.city || ''
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in submitLead:', err);
      return { success: false, error: err.message || 'Failed to submit lead' };
    }
  },

  /**
   * 2. Save a contact message
   */
  async submitContactMessage(msg: ContactMessage): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured) {
      console.log('SIMULATION: Submitting Contact Message to Supabase', msg);
      await sleep(1000);
      return { success: true, data: { id: 'simulated-message-id', ...msg } };
    }

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: msg.name,
            email: msg.email,
            phone: msg.phone || '',
            subject: msg.subject || 'General Enquiry',
            message: msg.message,
            status: msg.status || 'New'
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in submitContactMessage:', err);
      return { success: false, error: err.message || 'Failed to submit contact message' };
    }
  },

  /**
   * 3. Subscribe to the newsletter
   */
  async submitNewsletter(newsletter: Newsletter): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured) {
      console.log('SIMULATION: Submitting Newsletter to Supabase', newsletter);
      await sleep(1000);
      return { success: true, data: { id: 'simulated-newsletter-id', ...newsletter } };
    }

    try {
      const { data, error } = await supabase
        .from('newsletter')
        .insert([
          {
            email: newsletter.email
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in submitNewsletter:', err);
      return { success: false, error: err.message || 'Failed to subscribe' };
    }
  },

  /**
   * 4. Request a website audit
   */
  async submitWebsiteAudit(audit: WebsiteAudit): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured) {
      console.log('SIMULATION: Submitting Website Audit to Supabase', audit);
      await sleep(1000);
      return { success: true, data: { id: 'simulated-audit-id', ...audit } };
    }

    try {
      const { data, error } = await supabase
        .from('website_audit')
        .insert([
          {
            website: audit.website,
            business_name: audit.business_name,
            name: audit.name,
            phone: audit.phone,
            email: audit.email,
            notes: audit.notes || '',
            status: audit.status || 'New'
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in submitWebsiteAudit:', err);
      return { success: false, error: err.message || 'Failed to submit website audit' };
    }
  },

  /**
   * 5. Book a consultation call
   */
  async submitBookedCall(call: BookedCall): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured) {
      console.log('SIMULATION: Submitting Booked Call to Supabase', call);
      await sleep(1000);
      return { success: true, data: { id: 'simulated-booking-id', ...call } };
    }

    try {
      const { data, error } = await supabase
        .from('booked_calls')
        .insert([
          {
            name: call.name,
            email: call.email,
            phone: call.phone,
            meeting_date: call.meeting_date,
            meeting_time: call.meeting_time,
            service: call.service,
            notes: call.notes || ''
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in submitBookedCall:', err);
      return { success: false, error: err.message || 'Failed to book consultation call' };
    }
  },

  /**
   * 6. Fetch published testimonials
   */
  async getTestimonials(): Promise<Testimonial[]> {
    if (!isSupabaseConfigured) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('published', true);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error in getTestimonials:', err);
      return [];
    }
  },

  /**
   * 7. Fetch published blog posts
   */
  async getBlogPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error in getBlogPosts:', err);
      return [];
    }
  },

  // ==========================================
  // ADMIN DASHBOARD CRM CAPABILITIES
  // ==========================================

  /**
   * Get initial mock items for CRM when Supabase is not active
   */
  getMockCRMData() {
    const defaultLeads = [
      {
        id: 'lead-1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Arjun Sharma',
        email: 'arjun@sharmasalon.in',
        phone: '+91 98271 23456',
        business_name: 'Sharma Luxury Salon',
        service: 'Business Website Design',
        budget: '₹25,000 - ₹50,000',
        message: 'Looking for a high-end website for my salon in Raigarh. Needs WhatsApp booking integration and pricing tables.',
        status: 'New',
        source: '/services',
        city: 'Raigarh',
        notes: ''
      },
      {
        id: 'lead-2',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Priya Patel',
        email: 'priya@tamnarlogistics.com',
        phone: '+91 70001 98765',
        business_name: 'Tamnar Transport Co.',
        service: 'Local SEO',
        budget: '₹15,000 - ₹25,000',
        message: 'We want to rank on Google Maps for local searches around Tamnar and Raigarh. Let us know your monthly packages.',
        status: 'Contacted',
        source: '/business-growth-calculator',
        city: 'Tamnar',
        notes: 'Called Priya on Wednesday. She is very interested in ranking higher on Google Maps.'
      },
      {
        id: 'lead-3',
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Rajesh Dewangan',
        email: 'rajesh@kharsiaceramics.com',
        phone: '+91 94252 54321',
        business_name: 'Dewangan Tiles & Ceramics',
        service: 'Website Redesign',
        budget: '₹50,000+',
        message: 'Existing WordPress website is slow and doesn\'t load on mobile. Need a modern custom design to rank locally in Kharsia and Raigarh.',
        status: 'Converted',
        source: '/',
        city: 'Kharsia',
        notes: 'Deposit received! Project kicked off. Mockup review scheduled.'
      }
    ];

    const defaultAudits = [
      {
        id: 'audit-1',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        website: 'www.raigarhfitness.com',
        business_name: 'Raigarh Power Gym',
        name: 'Sanjay Singh',
        phone: '+91 88899 11223',
        email: 'sanjay@raigarhfitness.com',
        notes: 'My website takes 6 seconds to open. Please audit and help me speed it up.',
        status: 'New'
      },
      {
        id: 'audit-2',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        website: 'www.chhattisgarhhotels.in',
        business_name: 'Hotel Shanti Heritage',
        name: 'Vikas Gupta',
        phone: '+91 91112 33445',
        email: 'info@shantiheritage.com',
        notes: 'Our booking rate has dropped. Need conversion optimization.',
        status: 'Audited'
      }
    ];

    const defaultMessages = [
      {
        id: 'msg-1',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Anjali Verma',
        email: 'anjali@vermaclinic.com',
        phone: '+91 77712 34567',
        subject: 'Google Business Profile Setup',
        message: 'Hello, do you offer GMB verification and setup services for medical clinics in Raigarh? Let me know your process.',
        status: 'New'
      }
    ];

    const defaultNewsletters = [
      { id: 'news-1', created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), email: 'amit.dubey@gmail.com' },
      { id: 'news-2', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), email: 'contact@raigarhbakeries.com' }
    ];

    const defaultCalls = [
      {
        id: 'call-1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Devendra Sahu',
        email: 'devendra@sahubooks.com',
        phone: '+91 99988 77766',
        meeting_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        meeting_time: '11:30 AM',
        service: 'Google Business Profile Optimization',
        notes: 'Wants to optimize local search presence for his stationery store in Raigarh.'
      }
    ];

    if (!localStorage.getItem('hds_leads')) {
      localStorage.setItem('hds_leads', JSON.stringify(defaultLeads));
    }
    if (!localStorage.getItem('hds_audits')) {
      localStorage.setItem('hds_audits', JSON.stringify(defaultAudits));
    }
    if (!localStorage.getItem('hds_messages')) {
      localStorage.setItem('hds_messages', JSON.stringify(defaultMessages));
    }
    if (!localStorage.getItem('hds_newsletters')) {
      localStorage.setItem('hds_newsletters', JSON.stringify(defaultNewsletters));
    }
    if (!localStorage.getItem('hds_calls')) {
      localStorage.setItem('hds_calls', JSON.stringify(defaultCalls));
    }
  },

  async getAllLeads(): Promise<Lead[]> {
    this.getMockCRMData();
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('hds_leads') || '[]');
    }
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching leads:', err);
      return JSON.parse(localStorage.getItem('hds_leads') || '[]');
    }
  },

  async updateLeadStatus(id: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const leads = JSON.parse(localStorage.getItem('hds_leads') || '[]');
      const idx = leads.findIndex((l: any) => l.id === id);
      if (idx !== -1) {
        leads[idx].status = status;
        localStorage.setItem('hds_leads', JSON.stringify(leads));
        return true;
      }
      return false;
    }
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating lead status:', err);
      return false;
    }
  },

  async updateLeadNotes(id: string, notes: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const leads = JSON.parse(localStorage.getItem('hds_leads') || '[]');
      const idx = leads.findIndex((l: any) => l.id === id);
      if (idx !== -1) {
        leads[idx].notes = notes;
        localStorage.setItem('hds_leads', JSON.stringify(leads));
        return true;
      }
      return false;
    }
    try {
      const { error } = await supabase.from('leads').update({ message: notes }).eq('id', id); // message acts as notes/description or custom notes col
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating lead notes:', err);
      return false;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const leads = JSON.parse(localStorage.getItem('hds_leads') || '[]');
      const filtered = leads.filter((l: any) => l.id !== id);
      localStorage.setItem('hds_leads', JSON.stringify(filtered));
      return true;
    }
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting lead:', err);
      return false;
    }
  },

  async getAllAudits(): Promise<WebsiteAudit[]> {
    this.getMockCRMData();
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('hds_audits') || '[]');
    }
    try {
      const { data, error } = await supabase.from('website_audit').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching audits:', err);
      return JSON.parse(localStorage.getItem('hds_audits') || '[]');
    }
  },

  async updateAuditStatus(id: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const audits = JSON.parse(localStorage.getItem('hds_audits') || '[]');
      const idx = audits.findIndex((a: any) => a.id === id);
      if (idx !== -1) {
        audits[idx].status = status;
        localStorage.setItem('hds_audits', JSON.stringify(audits));
        return true;
      }
      return false;
    }
    try {
      const { error } = await supabase.from('website_audit').update({ status }).eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating audit status:', err);
      return false;
    }
  },

  async deleteAudit(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const audits = JSON.parse(localStorage.getItem('hds_audits') || '[]');
      const filtered = audits.filter((a: any) => a.id !== id);
      localStorage.setItem('hds_audits', JSON.stringify(filtered));
      return true;
    }
    try {
      const { error } = await supabase.from('website_audit').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting audit:', err);
      return false;
    }
  },

  async getAllMessages(): Promise<ContactMessage[]> {
    this.getMockCRMData();
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('hds_messages') || '[]');
    }
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching messages:', err);
      return JSON.parse(localStorage.getItem('hds_messages') || '[]');
    }
  },

  async updateMessageStatus(id: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const msgs = JSON.parse(localStorage.getItem('hds_messages') || '[]');
      const idx = msgs.findIndex((m: any) => m.id === id);
      if (idx !== -1) {
        msgs[idx].status = status;
        localStorage.setItem('hds_messages', JSON.stringify(msgs));
        return true;
      }
      return false;
    }
    try {
      const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating message status:', err);
      return false;
    }
  },

  async deleteMessage(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const msgs = JSON.parse(localStorage.getItem('hds_messages') || '[]');
      const filtered = msgs.filter((m: any) => m.id !== id);
      localStorage.setItem('hds_messages', JSON.stringify(filtered));
      return true;
    }
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      return false;
    }
  },

  async getAllNewsletterSubscribers(): Promise<Newsletter[]> {
    this.getMockCRMData();
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('hds_newsletters') || '[]');
    }
    try {
      const { data, error } = await supabase.from('newsletter').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching newsletters:', err);
      return JSON.parse(localStorage.getItem('hds_newsletters') || '[]');
    }
  },

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const letters = JSON.parse(localStorage.getItem('hds_newsletters') || '[]');
      const filtered = letters.filter((l: any) => l.id !== id);
      localStorage.setItem('hds_newsletters', JSON.stringify(filtered));
      return true;
    }
    try {
      const { error } = await supabase.from('newsletter').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting newsletter subscriber:', err);
      return false;
    }
  },

  async getAllBookedCalls(): Promise<BookedCall[]> {
    this.getMockCRMData();
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('hds_calls') || '[]');
    }
    try {
      const { data, error } = await supabase.from('booked_calls').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching booked calls:', err);
      return JSON.parse(localStorage.getItem('hds_calls') || '[]');
    }
  },

  async deleteBookedCall(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const calls = JSON.parse(localStorage.getItem('hds_calls') || '[]');
      const filtered = calls.filter((c: any) => c.id !== id);
      localStorage.setItem('hds_calls', JSON.stringify(filtered));
      return true;
    }
    try {
      const { error } = await supabase.from('booked_calls').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting booked call:', err);
      return false;
    }
  }
};
