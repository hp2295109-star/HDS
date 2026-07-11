import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INTENTS, FALLBACK_RESPONSES, Intent } from '../data/chatbotIntents';

interface ChatButton {
  label: string;
  href?: string;
  to?: string;
  isExternal?: boolean;
  variant?: 'whatsapp' | 'primary' | 'secondary';
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actionButtons?: boolean;
  buttons?: ChatButton[];
}

const DEFAULT_SUGGESTIONS = [
  '💻 Website Pricing',
  '🚀 SEO Services',
  '📈 Meta Ads',
  '🤖 AI Automation'
];

const FALLBACK_SUGGESTIONS = [
  'Website',
  'SEO',
  'Ads',
  'Automation',
  'Book Consultation'
];

const LEAD_INTENTS = [
  'pricing', 'timeline', 'website_dev', 'website_redesign', 
  'seo', 'ai_automation', 'consultation', 'lead_generation'
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello 👋 Welcome to Harsh Digital Studios. How can I help you today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastResponsesRef = useRef<Record<string, number>>({});
  const leadIntentCountRef = useRef(0);
  const fallbackCountRef = useRef(0);
  const lastUserMessagesRef = useRef<string[]>([]);
  const discussedIntentsRef = useRef<Set<string>>(new Set());
  const hasPitchedConsultationRef = useRef(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowPopup(true);
      }
    }, 5000);

    // Hide popup after 15 seconds (10 seconds after showing)
    const hideTimer = setTimeout(() => {
      setShowPopup(false);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const matchIntent = (text: string): Intent | null => {
    const cleanInput = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
    const words = cleanInput.split(/\s+/).filter(Boolean);
    if (words.length === 0) return null;

    let bestMatch: Intent | null = null;
    let maxScore = 0;

    for (const intent of INTENTS) {
      let score = 0;
      for (const keyword of intent.keywords) {
        const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
        
        // Exact match gets highest score
        if (cleanInput === cleanKeyword) {
          score += 100;
        } 
        // Phrase match
        else if (cleanInput.includes(cleanKeyword)) {
          score += cleanKeyword.length * 4;
        } 
        // Word match
        else {
          const kwWords = cleanKeyword.split(/\s+/);
          const matchedWords = kwWords.filter(w => words.includes(w));
          if (matchedWords.length === kwWords.length) {
            score += cleanKeyword.length * 1.5;
          }
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = intent;
      }
    }
    
    // Minimum matching threshold
    return maxScore > 2 ? bestMatch : null;
  };

  const getRandomResponse = (responses: string[], intentId: string) => {
    const lastIndex = lastResponsesRef.current[intentId];
    let newIndex = Math.floor(Math.random() * responses.length);
    
    // Ensure we don't repeat the exact same response twice in a row
    if (responses.length > 1 && newIndex === lastIndex) {
      newIndex = (newIndex + 1) % responses.length;
    }
    
    lastResponsesRef.current[intentId] = newIndex;
    return responses[newIndex];
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    setShowPopup(false);
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Track user message history (last 3 messages)
    lastUserMessagesRef.current = [...lastUserMessagesRef.current, text].slice(-3);

    // Process AI response with random delay (600 - 1200ms)
    const typingDelay = Math.floor(Math.random() * (1200 - 600 + 1) + 600);

    setTimeout(() => {
      let aiText = '';
      let actionButtons = false;
      let msgButtons: ChatButton[] | undefined = undefined;
      let nextSuggestions = DEFAULT_SUGGESTIONS;
      
      // Check if user has already talked about Website
      const alreadyDiscussedWebsite = discussedIntentsRef.current.has('website_dev') || 
                                     discussedIntentsRef.current.has('landing_page') || 
                                     discussedIntentsRef.current.has('website_redesign');

      // Check for exact word repetition to avoid looping
      const isRepetitive = lastUserMessagesRef.current.length >= 2 && 
        lastUserMessagesRef.current[lastUserMessagesRef.current.length - 1].toLowerCase().trim() === 
        lastUserMessagesRef.current[lastUserMessagesRef.current.length - 2].toLowerCase().trim();

      const intent = matchIntent(text);

      if (isRepetitive) {
        // Handle message repetition beautifully
        aiText = "I see we're looking at that topic again! Let's get you set up with a expert from our team to discuss this directly, or feel free to ask something else.";
        msgButtons = [
          { label: 'Book Consultation', to: '/contact', variant: 'primary' },
          { label: 'Chat on WhatsApp', href: 'https://wa.me/917067363208', isExternal: true, variant: 'whatsapp' }
        ];
        nextSuggestions = ['🚀 SEO Services', '📈 Meta Ads', '🤖 AI Automation'];
      } else if (intent) {
        fallbackCountRef.current = 0; // reset fallback counter
        
        // Save current intent ID to discussed history
        discussedIntentsRef.current.add(intent.id);

        aiText = getRandomResponse(intent.responses, intent.id);
        nextSuggestions = intent.suggestions.length > 0 ? intent.suggestions : DEFAULT_SUGGESTIONS;

        // "If user already selected Website, don't ask again. Continue naturally."
        if (alreadyDiscussedWebsite && (intent.id === 'website_dev' || intent.id === 'landing_page')) {
          aiText = "As we already explored your interest in website options, we could also enhance your search rankings with SEO or start getting clients immediately with social media ads. Which of these sounds best?";
          nextSuggestions = ['🚀 SEO Services', '📈 Meta Ads', '🤖 AI Automation'];
        }

        // Contextual Button Logic
        if (intent.id === 'pricing') {
          msgButtons = [
            { label: 'Get Custom Quote', to: '/contact', variant: 'primary' },
            { label: 'Book Consultation', to: '/contact', variant: 'secondary' }
          ];
        } else if (intent.id === 'seo' || intent.id === 'local_seo' || intent.id === 'gmb') {
          msgButtons = [
            { label: 'Request SEO Audit', to: '/contact', variant: 'primary' },
            { label: 'Book Strategy Call', to: '/contact', variant: 'secondary' }
          ];
        } else if (intent.id === 'meta_ads' || intent.id === 'google_ads' || intent.id === 'lead_generation') {
          msgButtons = [
            { label: 'Launch Ad Campaigns', to: '/contact', variant: 'primary' },
            { label: 'Book Strategy Call', to: '/contact', variant: 'secondary' }
          ];
        } else if (intent.id === 'ai_automation' || intent.id === 'whatsapp_automation' || intent.id === 'crm_automation') {
          msgButtons = [
            { label: 'Automate My Business', to: '/contact', variant: 'primary' },
            { label: 'Book Free Consultation', to: '/contact', variant: 'secondary' }
          ];
        } else if (intent.id === 'growth_calculator') {
          msgButtons = [
            { label: 'Start Calculator', to: '/calculator', variant: 'primary' },
            { label: 'Get Free Audit', to: '/contact', variant: 'secondary' }
          ];
        } else if (intent.id === 'contact' || intent.id === 'consultation') {
          msgButtons = [
            { label: 'Book Meeting', to: '/contact', variant: 'primary' },
            { label: 'Chat on WhatsApp', href: 'https://wa.me/917067363208', isExternal: true, variant: 'whatsapp' }
          ];
        } else if (intent.id === 'portfolio') {
          msgButtons = [
            { label: 'View Full Portfolio', to: '/portfolio', variant: 'primary' },
            { label: 'Book Strategy Call', to: '/contact', variant: 'secondary' }
          ];
        }

        // Track Lead Intent turns
        if (LEAD_INTENTS.includes(intent.id)) {
          leadIntentCountRef.current += 1;
        }

        // After 2 lead-related queries, trigger the lead capture consultation pitch
        if (leadIntentCountRef.current >= 2) {
          if (!hasPitchedConsultationRef.current) {
            aiText += "\n\nWould you like a free consultation to discuss this in detail and map out a step-by-step strategy for your business?";
            msgButtons = [
              { label: 'Book Meeting', to: '/contact', variant: 'primary' },
              { label: 'Chat on WhatsApp', href: 'https://wa.me/917067363208', isExternal: true, variant: 'whatsapp' }
            ];
            hasPitchedConsultationRef.current = true;
          }
          leadIntentCountRef.current = 0; 
        }

        if (intent.actionButtons && !msgButtons) {
          actionButtons = true;
        }

      } else {
        // Fallback
        fallbackCountRef.current += 1;
        aiText = getRandomResponse(FALLBACK_RESPONSES, 'fallback');
        nextSuggestions = FALLBACK_SUGGESTIONS;
        
        if (fallbackCountRef.current >= 2) {
          aiText = "I think it would be best to speak directly with our team of specialists. Would you like to connect on WhatsApp or book a consultation call?";
          msgButtons = [
            { label: 'Book Consultation', to: '/contact', variant: 'primary' },
            { label: 'Chat on WhatsApp', href: 'https://wa.me/917067363208', isExternal: true, variant: 'whatsapp' }
          ];
          fallbackCountRef.current = 0;
        }
      }

      // Filter out website suggestions if the user has already talked about websites
      if (alreadyDiscussedWebsite || discussedIntentsRef.current.has('website_dev') || discussedIntentsRef.current.has('landing_page')) {
        nextSuggestions = nextSuggestions.filter(s => 
          !s.toLowerCase().includes('website') && 
          !s.toLowerCase().includes('landing')
        );
        if (nextSuggestions.length === 0) {
          nextSuggestions = ['🚀 SEO Services', '📈 Meta Ads', '🤖 AI Automation', '📅 Book Meeting'];
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        actionButtons: actionButtons && !msgButtons,
        buttons: msgButtons
      };

      setMessages(prev => [...prev, aiMsg]);
      setSuggestions(nextSuggestions);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleChipClick = (question: string) => {
    // Remove emoji from question for processing
    const cleanQuestion = question.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\s]+/u, '').trim();
    handleSendMessage(cleanQuestion);
  };
  
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button & Popup */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end lg:bottom-10 lg:right-10">
        
        {/* Popup Message */}
        <AnimatePresence>
          {showPopup && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-4 bg-surface/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl max-w-[240px] relative origin-bottom-right cursor-pointer group"
              onClick={() => { setIsOpen(true); setShowPopup(false); }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Dismiss message"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="text-sm text-gray-200 leading-relaxed pr-4">
                <span className="block mb-1">👋 Hi there!</span>
                <span className="block mb-1">I'm the HDS AI Assistant.</span>
                <span className="block">How may I help you today?</span>
              </div>
              <div className="mt-3 text-accent text-xs font-bold flex items-center group-hover:underline">
                Ask a Question
              </div>
              
              {/* Chat bubble tail */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-surface/90 border-b border-r border-white/10 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -8, 0] }}
            transition={{ 
              scale: { type: 'spring', damping: 20, stiffness: 100, delay: 1 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
          >
            <button
              onClick={() => { setIsOpen(true); setShowPopup(false); }}
              className="w-14 h-14 bg-gradient-to-tr from-accent to-secondary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all group relative focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Open AI Assistant"
            >
              <div className="absolute inset-0 rounded-full bg-accent/30 animate-pulse"></div>
              <div className="relative flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-50" />
                <Sparkles className="w-6 h-6 text-white absolute opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
              </div>
            </button>
          </motion.div>
        )}
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[600px] max-h-[calc(100vh-80px)] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center relative shadow-inner">
                  <Sparkles className="w-5 h-5 text-white" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0A]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">HDS AI Assistant</h3>
                  <p className="text-[11px] text-gray-400 flex items-center mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 opacity-80"></span>
                    Usually replies instantly
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-tr from-accent to-secondary text-white rounded-tr-sm shadow-sm' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                    
                    {msg.buttons && msg.buttons.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {msg.buttons.map((btn, idx) => {
                          const className = btn.variant === 'whatsapp' 
                            ? "block w-full text-center py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-xs hover:bg-[#20bd5a] transition-colors shadow-sm"
                            : btn.variant === 'primary'
                            ? "block w-full text-center py-2.5 bg-accent text-white rounded-xl font-bold text-xs hover:bg-accent/80 transition-colors shadow-sm"
                            : "block w-full text-center py-2.5 bg-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/20 transition-colors";
                          
                          if (btn.isExternal && btn.href) {
                            return (
                              <a 
                                key={idx}
                                href={btn.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={className}
                              >
                                {btn.label}
                              </a>
                            );
                          } else if (btn.to) {
                            return (
                              <Link 
                                key={idx}
                                to={btn.to} 
                                onClick={() => setIsOpen(false)} 
                                className={className}
                              >
                                {btn.label}
                              </Link>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    {msg.actionButtons && !msg.buttons && (
                      <div className="mt-4 space-y-2">
                        <a href="https://wa.me/917067363208" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-xs hover:bg-[#20bd5a] transition-colors shadow-sm">
                          Chat on WhatsApp
                        </a>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block w-full text-center py-2.5 bg-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/20 transition-colors">
                          Book Meeting
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-[20px] rounded-tl-sm px-4 py-4 flex space-x-1.5 shadow-sm">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
              {/* Suggested Questions */}
              {messages[messages.length - 1]?.sender === 'ai' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestions.map((q, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleChipClick(q)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors shadow-inner placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 w-9 h-9 flex items-center justify-center rounded-lg bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
