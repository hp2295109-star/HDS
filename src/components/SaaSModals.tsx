import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Phone, Mail, Globe, Briefcase, DollarSign, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useSupabaseForm } from '../hooks/useSupabaseForm';
import { supabaseService } from '../services/supabaseService';

export type ModalType = 'audit' | 'booking' | 'lead' | 'newsletter' | null;

interface ModalState {
  type: ModalType;
  service?: string;
  source?: string;
}

// Global functions to open modals from anywhere in the application
export const openSaaSModal = (type: ModalType, service?: string, source?: string) => {
  window.dispatchEvent(new CustomEvent('hds-saas-modal', {
    detail: { type, service, source }
  }));
};

export default function SaaSModals() {
  const [state, setState] = useState<ModalState>({ type: null });

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<ModalState>;
      if (customEvent.detail) {
        setState({
          type: customEvent.detail.type,
          service: customEvent.detail.service,
          source: customEvent.detail.source || window.location.pathname
        });
      }
    };

    window.addEventListener('hds-saas-modal', handleOpenModal);
    return () => window.removeEventListener('hds-saas-modal', handleOpenModal);
  }, []);

  const closeModal = () => {
    setState({ type: null });
  };

  return (
    <AnimatePresence>
      {state.type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-[#0B0F19] border border-white/10 rounded-[32px] w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-grow">
              {state.type === 'audit' && (
                <WebsiteAuditForm service={state.service} source={state.source} onClose={closeModal} />
              )}
              {state.type === 'booking' && (
                <BookConsultationForm service={state.service} source={state.source} onClose={closeModal} />
              )}
              {state.type === 'lead' && (
                <LeadCaptureForm service={state.service} source={state.source} onClose={closeModal} />
              )}
              {state.type === 'newsletter' && (
                <NewsletterForm onClose={closeModal} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 1. WEBSITE AUDIT FORM
// ============================================================================
function WebsiteAuditForm({ service, source, onClose }: { service?: string; source?: string; onClose: () => void }) {
  const {
    values,
    errors,
    isLoading,
    isSuccess,
    isError,
    statusMessage,
    handleChange,
    handleSubmit,
    resetForm
  } = useSupabaseForm({
    formKey: 'website-audit',
    initialValues: {
      website: '',
      business_name: '',
      name: '',
      phone: '',
      email: '',
      notes: ''
    },
    validateFields: ['website', 'business_name', 'name', 'phone', 'email'],
    submitFn: async (formValues) => {
      return supabaseService.submitWebsiteAudit({
        ...formValues,
        status: 'New'
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        onClose();
      }, 3500);
    }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4">
          <Globe className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-white">Free Website Audit</h3>
        <p className="text-gray-400 text-sm mt-1">Get a complete conversion & SEO checklist for your website.</p>
      </div>

      {isSuccess ? (
        <SuccessView message="Audit request successfully received! We will examine your website and reach out shortly." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <ErrorAlert message={statusMessage} />}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Website URL</label>
            <div className="relative">
              <Globe className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
              <input
                type="text"
                name="website"
                value={values.website}
                onChange={handleChange}
                placeholder="e.g. www.yourbusiness.com"
                className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.website ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
            </div>
            {errors.website && <p className="text-xs text-red-400 mt-1">{errors.website}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Business Name</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
              <input
                type="text"
                name="business_name"
                value={values.business_name}
                onChange={handleChange}
                placeholder="e.g. Wellness Spa & Salon"
                className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.business_name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
            </div>
            {errors.business_name && <p className="text-xs text-red-400 mt-1">{errors.business_name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Contact Name</label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.phone ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="e.g. you@example.com"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
              }`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Additional Notes (Optional)</label>
            <textarea
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={3}
              placeholder="What are your main concerns with your current website?"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 premium-button flex items-center justify-center py-4 bg-gradient-to-r from-accent to-secondary text-black font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
                Processing request...
              </>
            ) : (
              <>
                Submit Audit Request
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// ============================================================================
// 2. BOOK CONSULTATION FORM
// ============================================================================
function BookConsultationForm({ service, source, onClose }: { service?: string; source?: string; onClose: () => void }) {
  const {
    values,
    errors,
    isLoading,
    isSuccess,
    isError,
    statusMessage,
    handleChange,
    handleSubmit
  } = useSupabaseForm({
    formKey: 'book-call',
    initialValues: {
      name: '',
      email: '',
      phone: '',
      meeting_date: '',
      meeting_time: '',
      service: service || 'Website Development',
      notes: ''
    },
    validateFields: ['name', 'email', 'phone', 'meeting_date', 'meeting_time'],
    submitFn: async (formValues) => {
      return supabaseService.submitBookedCall(formValues);
    },
    onSuccess: () => {
      setTimeout(() => {
        onClose();
      }, 3500);
    }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-white">Book Free Strategy Call</h3>
        <p className="text-gray-400 text-sm mt-1">Select a convenient date and time to discuss your growth roadmap.</p>
      </div>

      {isSuccess ? (
        <SuccessView message="Consultation successfully scheduled! We will send you an invite email and WhatsApp confirmation shortly." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <ErrorAlert message={statusMessage} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.phone ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
              }`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="date"
                  name="meeting_date"
                  value={values.meeting_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all text-gray-300 ${
                    errors.meeting_date ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                  }`}
                />
              </div>
              {errors.meeting_date && <p className="text-xs text-red-400 mt-1">{errors.meeting_date}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Preferred Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                <select
                  name="meeting_time"
                  value={values.meeting_time}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-[#0B0F19] border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all text-gray-300 appearance-none ${
                    errors.meeting_time ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                  }`}
                >
                  <option value="">Select Time Slot</option>
                  <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                  <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="03:30 PM">03:30 PM - 04:30 PM</option>
                  <option value="05:00 PM">05:00 PM - 06:00 PM</option>
                  <option value="06:30 PM">06:30 PM - 07:30 PM</option>
                </select>
              </div>
              {errors.meeting_time && <p className="text-xs text-red-400 mt-1">{errors.meeting_time}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Interested Service</label>
            <select
              name="service"
              value={values.service}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-gray-300 appearance-none"
            >
              <option value="Website Development">Website Development</option>
              <option value="SEO Optimization">SEO Optimization</option>
              <option value="Meta Ads & Marketing">Meta Ads & Marketing</option>
              <option value="AI Automation">AI Automation</option>
              <option value="Custom CRM/SaaS Design">Custom CRM/SaaS Design</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Additional Notes (Optional)</label>
            <textarea
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Tell us a bit about your business or goals..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 premium-button flex items-center justify-center py-4 bg-gradient-to-r from-accent to-secondary text-black font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
                Booking your call...
              </>
            ) : (
              <>
                Book Strategy Consultation
                <Calendar className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// ============================================================================
// 3. LEAD CAPTURE FORM
// ============================================================================
function LeadCaptureForm({ service = 'Website Development', source, onClose }: { service?: string; source?: string; onClose: () => void }) {
  const {
    values,
    errors,
    isLoading,
    isSuccess,
    isError,
    statusMessage,
    handleChange,
    handleSubmit
  } = useSupabaseForm({
    formKey: 'leads',
    initialValues: {
      name: '',
      email: '',
      phone: '',
      business_name: '',
      service: service,
      budget: '',
      message: ''
    },
    validateFields: ['name', 'email', 'phone', 'business_name', 'budget', 'message'],
    submitFn: async (formValues) => {
      return supabaseService.submitLead({
        ...formValues,
        source: source,
        status: 'New'
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        onClose();
      }, 3500);
    }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4">
          <Briefcase className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-white">Start Digital Project</h3>
        <p className="text-gray-400 text-sm mt-1">Tell us what you're building, and receive a customized quote.</p>
      </div>

      {isSuccess ? (
        <SuccessView message="Project request submitted! Our lead solutions architect will review your files and contact you shortly." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <ErrorAlert message={statusMessage} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.phone ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Business Name</label>
              <input
                type="text"
                name="business_name"
                value={values.business_name}
                onChange={handleChange}
                placeholder="Business Name"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.business_name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              />
              {errors.business_name && <p className="text-xs text-red-400 mt-1">{errors.business_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Service Needed</label>
              <select
                name="service"
                value={values.service}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-gray-300 appearance-none"
              >
                <option value="Website Development">Website Development</option>
                <option value="SEO Optimization">SEO Optimization</option>
                <option value="Meta Ads">Meta Ads & Paid Campaigns</option>
                <option value="AI Automation">AI Automation</option>
                <option value="Other Project">Other Custom Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Project Budget</label>
              <select
                name="budget"
                value={values.budget}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#0B0F19] border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all text-gray-300 appearance-none ${
                  errors.budget ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
                }`}
              >
                <option value="">Select budget range</option>
                <option value="Under ₹10k">Under ₹10,000</option>
                <option value="₹10k - ₹25k">₹10,000 - ₹25,000</option>
                <option value="₹25k - ₹50k">₹25,000 - ₹50,000</option>
                <option value="Above ₹50k">Above ₹50,000</option>
              </select>
              {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Brief Message</label>
            <textarea
              name="message"
              value={values.message}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us what you want to achieve with this project..."
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none focus:ring-1 transition-all resize-none ${
                errors.message ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
              }`}
            />
            {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 premium-button flex items-center justify-center py-4 bg-gradient-to-r from-accent to-secondary text-black font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
                Submitting project info...
              </>
            ) : (
              <>
                Request Customized Proposal
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// ============================================================================
// 4. NEWSLETTER FORM (IN MODAL)
// ============================================================================
function NewsletterForm({ onClose }: { onClose: () => void }) {
  const {
    values,
    errors,
    isLoading,
    isSuccess,
    isError,
    statusMessage,
    handleChange,
    handleSubmit
  } = useSupabaseForm({
    formKey: 'newsletter-modal',
    initialValues: {
      email: ''
    },
    validateFields: ['email'],
    submitFn: async (formValues) => {
      return supabaseService.submitNewsletter(formValues);
    },
    onSuccess: () => {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  });

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-white">Subscribe to Newsletter</h3>
        <p className="text-gray-400 text-sm mt-1">Join 5,000+ local operators receiving growth advice weekly.</p>
      </div>

      {isSuccess ? (
        <SuccessView message="Subscription verified! Welcome to the Harsh Digital Studios growth circle." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <ErrorAlert message={statusMessage} />}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 text-center">Your Email Address</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="e.g. business-owner@gmail.com"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-center focus:outline-none focus:ring-1 transition-all ${
                errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-accent focus:ring-accent/50'
              }`}
            />
            {errors.email && <p className="text-xs text-red-400 text-center mt-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full premium-button flex items-center justify-center py-4 bg-gradient-to-r from-accent to-secondary text-black font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
                Joining list...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// ============================================================================
// HELPER SUBCOMPONENTS
// ============================================================================
function SuccessView({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-8"
    >
      <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>
      <h4 className="text-xl font-bold font-heading text-white mb-2">Submission Successful!</h4>
      <p className="text-gray-400 text-sm max-w-sm leading-relaxed">{message}</p>
    </motion.div>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400">
      <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
      <span className="text-xs font-medium leading-relaxed">{message}</span>
    </div>
  );
}
