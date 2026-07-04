import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Mail, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-heading font-bold text-white tracking-tight block mb-6">
              Harsh<span className="text-accent">Digital</span>Studios
            </Link>
            <p className="text-gray-300 mb-8 max-w-xs text-sm leading-relaxed">
              Building modern websites that help local businesses grow through premium design and AI automation.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center text-accent hover:text-white transition-colors font-medium text-sm group"
            >
              Book Free Website Audit
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Services', 'Portfolio', 'Pricing', 'Testimonials', 'Blog', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="text-gray-300 hover:text-accent transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+917067363208" className="flex items-center text-gray-300 hover:text-accent transition-colors text-sm group">
                  <Phone className="w-4 h-4 mr-3 text-gray-400 group-hover:text-accent transition-colors" />
                  +91 70673 63208
                </a>
              </li>
              <li>
                <a href="https://wa.me/917470822184" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-accent transition-colors text-sm group">
                  <MessageCircle className="w-4 h-4 mr-3 text-gray-400 group-hover:text-accent transition-colors" />
                  +91 74708 22184
                </a>
              </li>
              <li>
                <a href="mailto:harshpatelyt1060@gmail.com" className="flex items-center text-gray-300 hover:text-accent transition-colors text-sm group">
                  <Mail className="w-4 h-4 mr-3 text-gray-400 group-hover:text-accent transition-colors" />
                  harshpatelyt1060@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/harshdigitalstudios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-transparent/10 flex items-center justify-center hover:bg-accent transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://wa.me/917470822184" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-transparent/10 flex items-center justify-center hover:bg-accent transition-colors group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="mailto:harshpatelyt1060@gmail.com" 
                className="w-10 h-10 rounded-full bg-transparent/10 flex items-center justify-center hover:bg-accent transition-colors group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} HarshDigitalStudios. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
