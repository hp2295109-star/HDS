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
  }
};
