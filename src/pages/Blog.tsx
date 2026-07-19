import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, User, Clock, Calendar, ArrowLeft, Tag, CheckCircle2, ChevronRight, 
  MessageSquare, ArrowRight, BookOpen, ChevronLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { supabaseService } from '../services/supabaseService';
import { BlogPost } from '../types/supabase';

// Structured Article interface for backward compatibility
interface StructuredArticle {
  id: string;
  title: string;
  category: string;
  tag: string;
  readTime: string;
  date: string;
  author: string;
  snippet: string;
  introduction: string;
  sections: {
    heading: string;
    subheading?: string;
    content: string[];
    listItems?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  conclusion: string;
  waText: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [readingProgress, setReadingProgress] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 4;

  // Load published blog posts on mount
  useEffect(() => {
    async function loadPublishedBlogs() {
      setLoading(true);
      try {
        const data = await supabaseService.getBlogPosts();
        setArticles(data || []);
      } catch (err) {
        console.error('Failed to load published blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPublishedBlogs();
  }, []);

  // Update reading progress bar on scroll inside detail view
  useEffect(() => {
    if (!selectedArticleId) {
      setReadingProgress(0);
      return;
    }
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedArticleId]);

  // Categories list
  const categories = ['All', 'Web Design', 'SEO', 'Digital Marketing', 'AI Automation', 'Business Strategy'];

  // Filter articles based on search query and category
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / POSTS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const selectedArticle = articles.find(a => a.id === selectedArticleId || a.slug === selectedArticleId);

  // Related articles (matching category, excluding current)
  const relatedArticles = selectedArticle 
    ? articles
        .filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category)
        .slice(0, 3)
    : [];

  // Smooth scroll back to top of page when opening or closing an article
  const handleArticleSelect = (id: string | null) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom JSX Renderer for Markdown copy
  const renderMarkdownToJSX = (text: string) => {
    if (!text) return null;
    const blocks = text.split('\n\n');
    return (
      <div className="space-y-8 font-sans">
        {blocks.map((block, idx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Header 3
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl md:text-2xl font-bold font-heading text-white pt-4 pb-2 border-b border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00F0FF] rounded-full inline-block" />
                <span>{trimmed.replace('### ', '')}</span>
              </h3>
            );
          }

          // Header 2
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl md:text-3xl font-bold font-heading text-[#00F0FF] pt-6 pb-2 border-b border-white/10">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }

          // Bullet list
          if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n');
            return (
              <ul key={idx} className="space-y-3.5 pl-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                {items.map((item, lIdx) => (
                  <li key={lIdx} className="text-xs md:text-sm text-gray-300 leading-relaxed flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] mr-2.5 shrink-0 mt-0.5" />
                    <span>{item.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                  </li>
                ))}
              </ul>
            );
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-[#00F0FF] pl-5 italic text-gray-400 my-6 bg-white/[0.02] py-4 pr-4 rounded-r-2xl font-serif">
                {trimmed.replace(/^>\s*/, '')}
              </blockquote>
            );
          }

          // Standard Paragraph with basic inline bold parsing
          const parts = trimmed.split('**');
          return (
            <p key={idx} className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
              {parts.map((part, pIdx) => {
                if (pIdx % 2 === 1) {
                  return <strong key={pIdx} className="text-white font-semibold">{part}</strong>;
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <PageTransition>
      {/* Dynamic SEO Reading Progress Bar */}
      {selectedArticleId && (
        <div 
          className="fixed top-0 left-0 h-1 bg-[#00F0FF] z-50 transition-all duration-100 origin-left"
          style={{ width: `${readingProgress * 100}%` }}
        />
      )}

      {/* Main Container */}
      <div className="min-h-screen bg-transparent relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ==================== ARTICLE LIST VIEW ==================== */}
          {!selectedArticleId ? (
            <div>
              {/* Header */}
              <div className="text-center md:text-left mb-16 max-w-4xl">
                <span className="inline-flex items-center space-x-1.5 bg-[#00F0FF]/10 text-[#00F0FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <span>Learn Digital Growth</span>
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 text-white tracking-tight">
                  Our Insights & Guides
                </h1>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
                  Practical digital marketing advice, Google visibility strategies, and website development guides crafted specifically for businesses in <span className="text-white font-semibold">Raigarh, Chhattisgarh</span>.
                </p>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..." 
                    className="pl-11 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] w-full text-sm text-white transition-all"
                  />
                </div>

                {/* Category Tags */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                        activeCategory === cat 
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-lg shadow-[#00F0FF]/10' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Articles Rendering */}
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-t-[#00F0FF] border-white/20 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-500 font-mono">Loading insights engine...</p>
                </div>
              ) : paginatedArticles.length > 0 ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedArticles.map((article) => (
                      <article 
                        key={article.id}
                        className="bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 rounded-[32px] overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group backdrop-blur-md shadow-sm h-full"
                      >
                        {/* Thumbnail overlay */}
                        <div className="h-52 bg-neutral-900 relative overflow-hidden">
                          <img 
                            src={article.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg flex items-center border border-[#00F0FF]/20 backdrop-blur-md">
                              <Tag className="w-3 h-3 mr-1" /> {article.category}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="px-2.5 py-1 bg-black/60 text-gray-300 text-[9px] font-mono rounded-md flex items-center gap-1 backdrop-blur-sm border border-white/10">
                              <Clock className="w-3 h-3 text-[#00F0FF]" /> {article.reading_time || '5 min'}
                            </span>
                          </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Article Title */}
                            <h3 className="text-xl md:text-2xl font-bold font-heading mb-4 text-white leading-snug group-hover:text-[#00F0FF] transition-colors line-clamp-2">
                              {article.title}
                            </h3>

                            {/* Snippet Description */}
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                              {article.excerpt || 'Read this helpful guide from Harsh Digital Studios to optimize your local marketing assets.'}
                            </p>
                          </div>

                          {/* Author & Read More Button */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center font-mono font-bold text-xs border border-[#00F0FF]/20">
                                HP
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white">{article.author || 'Harsh Patel'}</p>
                                <p className="text-[10px] text-gray-500">{article.publish_date || 'July 2026'}</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleArticleSelect(article.slug || article.id)}
                              className="inline-flex items-center text-xs font-bold text-[#00F0FF] group-hover:underline gap-1 cursor-pointer"
                            >
                              Read Article
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination control */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-white/5">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-40 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all border ${
                            currentPage === idx + 1
                              ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-40 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/[0.01] border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
                  <p className="text-gray-400 font-sans mb-4">No insights or articles matching your query.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="px-4 py-2 bg-[#00F0FF] text-black font-extrabold uppercase tracking-wider text-[10px] rounded-xl hover:opacity-90"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            
            // ==================== SINGLE ARTICLE DETAIL VIEW ====================
            <div className="max-w-4xl mx-auto">
              
              {/* Back Button */}
              <button 
                onClick={() => handleArticleSelect(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#00F0FF]/10 text-white hover:text-[#00F0FF] rounded-xl text-xs font-bold mb-12 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Insights
              </button>

              {/* Article Frame */}
              {selectedArticle && (
                <article className="bg-white/[0.01] border border-white/10 rounded-[40px] p-6 md:p-12 backdrop-blur-md overflow-hidden relative">
                  
                  {/* Category, Author, Published Date Metadata */}
                  <header className="mb-10 text-center border-b border-white/5 pb-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="px-3.5 py-1 bg-[#00F0FF]/10 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center border border-[#00F0FF]/20">
                        <Tag className="w-3.5 h-3.5 mr-1" /> {selectedArticle.category}
                      </span>
                    </div>
                    
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 text-white leading-tight">
                      {selectedArticle.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#00F0FF]" /> 
                        <span>Written by <span className="text-white font-semibold">{selectedArticle.author || 'Harsh Patel'}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#00F0FF]" /> 
                        <span>Published on <span className="text-white font-semibold">{selectedArticle.publish_date || 'July 2026'}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#00F0FF]" /> 
                        <span className="text-[#00F0FF] font-semibold">{selectedArticle.reading_time || '5 min'}</span>
                      </div>
                    </div>
                  </header>

                  {/* Thumbnail Banner */}
                  {selectedArticle.thumbnail && (
                    <div className="rounded-[24px] overflow-hidden mb-10 h-72 md:h-[400px]">
                      <img 
                        src={selectedArticle.thumbnail} 
                        alt={selectedArticle.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Body Content Rendering (Dynamic Markdown compiled text or original backward compatible layout) */}
                  <div className="space-y-6">
                    {/* Render dynamic markdown directly */}
                    {renderMarkdownToJSX(selectedArticle.content)}
                  </div>

                  {/* Author Box Signature */}
                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left bg-white/[0.01] p-8 rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-secondary flex items-center justify-center font-bold text-black text-xl font-heading shadow-md">
                      HP
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">About the Author: {selectedArticle.author || 'Harsh Patel'}</h4>
                      <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                        Harsh Patel is the founder of Harsh Digital Studios, specializing in high-performance website engineering, semantic SEO search patterns, and custom automation templates for local growth campaigns.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Related Articles Panel */}
                  {relatedArticles.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-white/5 space-y-6">
                      <h3 className="text-lg md:text-xl font-bold font-heading text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#00F0FF]" />
                        <span>Related Guides & Articles</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {relatedArticles.map(rel => (
                          <div 
                            key={rel.id}
                            onClick={() => handleArticleSelect(rel.slug || rel.id)}
                            className="bg-white/[0.01] border border-white/5 hover:border-[#00F0FF]/30 p-5 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all duration-300 group"
                          >
                            <span className="text-[9px] font-mono text-[#00F0FF] uppercase block mb-1">{rel.category}</span>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#00F0FF] line-clamp-2 leading-snug">{rel.title}</h4>
                            <span className="text-[9px] text-gray-500 font-mono mt-3 block">{rel.reading_time || '5 min'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Article CTA Box */}
                  <div className="mt-12 text-center bg-white/[0.02] border border-[#00F0FF]/20 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#00F0FF]/5 rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-bold font-heading mb-3 text-white">
                        Let's Turn These Insights Into Real Growth
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto mb-8 leading-relaxed font-sans">
                        Stop missing potential customer calls. Connect with Harsh Digital Studios to design a premium business platform optimized to rank first on Google and capture every inquiry.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                          to="/contact" 
                          className="w-full sm:w-auto px-6 py-3.5 bg-accent text-black font-bold rounded-xl text-xs hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10"
                        >
                          Book Free Consultation
                        </Link>
                        
                        <a 
                          href={`https://wa.me/917067363208?text=${encodeURIComponent("Hello Harsh Digital Studios, I read your article on " + selectedArticle.title + " and would love to build a premium website!")}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-xl text-xs hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/10 inline-flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4 fill-current" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                </article>
              )}

              {/* Back to top footer in article */}
              <div className="text-center mt-12">
                <button 
                  onClick={() => handleArticleSelect(null)}
                  className="text-xs text-[#00F0FF] hover:underline font-bold"
                >
                  ← Back to all guides & articles
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
