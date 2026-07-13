import { motion } from 'motion/react';
import { Instagram, Mail, MapPin, MessageCircle, Phone, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useSupabaseForm } from '../hooks/useSupabaseForm';
import { supabaseService } from '../services/supabaseService';

export default function Contact() {
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
    formKey: 'contact-page',
    initialValues: {
      name: '',
      email: '',
      phone: '',
      business_name: '',
      website: '',
      message: ''
    },
    validateFields: ['name', 'email', 'phone', 'business_name', 'message'],
    submitFn: async (formValues) => {
      return supabaseService.submitWebsiteAudit({
        website: formValues.website || 'No website yet',
        business_name: formValues.business_name,
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
        notes: formValues.message,
        status: 'New'
      });
    }
  });

  return (
    <PageTransition>
      <section className="pt-24 pb-16 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to build a premium website for your local business? Let's discuss your project.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold font-heading mb-8">Contact Information</h2>
              
              <div className="space-y-6 mb-12">
                <a 
                  href="tel:+917067363208"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-surface/5 text-white rounded-xl flex items-center justify-center mr-6 group-hover:bg-surface group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Call Us Directly</p>
                    <p className="text-lg font-bold font-heading text-white">+91 70673 63208</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/917067363208"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-[#25D366]/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center mr-6 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Chat on WhatsApp</p>
                    <p className="text-lg font-bold font-heading text-white">+91 70673 63208</p>
                  </div>
                </a>

                <a 
                  href="mailto:harshpatelyt1060@gmail.com"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-surface/5 text-white rounded-xl flex items-center justify-center mr-6 group-hover:bg-surface group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Send Email</p>
                    <p className="text-lg font-bold font-heading text-white">harshpatelyt1060@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/harshdigitalstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-6 bg-transparent rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:border-pink-500/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mr-6 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Follow on Instagram</p>
                    <p className="text-lg font-bold font-heading text-white">@harshdigitalstudios</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form / Map area */}
            <div className="glass-card h-full flex flex-col">
              <h3 className="text-2xl font-bold font-heading mb-6">Book Your Free Audit</h3>
              <p className="text-gray-400 mb-8">Fill out the form below or message us directly on WhatsApp to get started with your free website audit.</p>
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12 flex-grow">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold font-heading text-white mb-2">Audit Requested!</h4>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    Thank you! We have received your website audit request. Our team will review it and get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form className="space-y-4 flex-grow flex flex-col" onSubmit={handleSubmit}>
                  {isError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400 text-xs">
                      <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                      <span>{statusMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-surface border rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors ${
                          errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:border-accent focus:ring-accent'
                        }`}
                        placeholder="John Doe"
                        disabled={isLoading}
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="business" className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
                      <input
                        type="text"
                        id="business"
                        name="business_name"
                        value={values.business_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-surface border rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors ${
                          errors.business_name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:border-accent focus:ring-accent'
                        }`}
                        placeholder="Your Business Ltd."
                        disabled={isLoading}
                      />
                      {errors.business_name && <p className="text-xs text-red-400 mt-1">{errors.business_name}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-surface border rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors ${
                          errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:border-accent focus:ring-accent'
                        }`}
                        placeholder="you@example.com"
                        disabled={isLoading}
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-surface border rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors ${
                          errors.phone ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:border-accent focus:ring-accent'
                        }`}
                        placeholder="+91 98765 43210"
                        disabled={isLoading}
                      />
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Website URL (Optional)</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={values.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface border border-white/20 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      placeholder="e.g. yourbusiness.com (if you have one)"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">How can we help?</label>
                    <textarea
                      id="message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-3 bg-surface border rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${
                        errors.message ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:border-accent focus:ring-accent'
                      }`}
                      placeholder="I need a website for my new salon..."
                      disabled={isLoading}
                    />
                    {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                  </div>

                  <div className="pt-4 mt-auto">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-surface rounded-xl hover:bg-white/10 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Send Message / Request Audit
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* Map Placeholder */}
          <div className="mt-16 glass-card !p-0 h-96 relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/10 flex flex-col items-center justify-center text-gray-400">
                <MapPin className="w-12 h-12 mb-4 text-gray-300 group-hover:text-accent transition-colors group-hover:scale-110 duration-500" />
                <p className="font-medium">Interactive Map Placeholder</p>
                <p className="text-sm">Connect with Google Maps API</p>
             </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
