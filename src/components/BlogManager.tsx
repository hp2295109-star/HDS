import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Globe, Calendar, FileText, Check, 
  Clock, Share2, FileCode, Link2, User, Tag, ChevronDown, Eye, CheckCircle2, 
  AlertCircle, Bold, Italic, List, Quote, Heading, Code, ArrowLeft, RefreshCw, Sparkles
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { BlogPost } from '../types/supabase';

interface BlogManagerProps {
  onBlogSaved?: () => void;
}

export default function BlogManager({ onBlogSaved }: BlogManagerProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Published, Scheduled, Draft
  
  // Editor View
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'seo' | 'generator'>('content');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [form, setForm] = useState<Partial<BlogPost>>({
    id: '',
    title: '',
    slug: '',
    thumbnail: '',
    content: '',
    excerpt: '',
    category: 'Web Design',
    published: false,
    publish_date: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    author: 'Harsh Patel',
    reading_time: '1 min read',
    is_draft: true
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load blogs on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getBlogPostsAdmin();
      setBlogs(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill reading time based on word count
  useEffect(() => {
    if (form.content) {
      const wordCount = form.content.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      setForm(prev => ({ ...prev, reading_time: `${minutes} min read` }));
    } else {
      setForm(prev => ({ ...prev, reading_time: '1 min read' }));
    }
  }, [form.content]);

  // Auto-fill slug and SEO fields based on Title
  const handleTitleChange = (title: string) => {
    const slugified = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    setForm(prev => ({
      ...prev,
      title,
      slug: slugified,
      meta_title: title.slice(0, 60),
      canonical_url: `https://harshdigitalstudios.com/blog/${slugified}`
    }));
  };

  // Helper to append formatting in Markdown editor
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const replacement = prefix + (selectedText || 'text') + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    
    setForm(prev => ({ ...prev, content: newContent }));
    
    // Reset cursor selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText || 'text').length);
    }, 50);
  };

  const handleSave = async (publishedState: boolean, isDraftState: boolean) => {
    if (!form.title || !form.slug || !form.content) {
      alert('Please fill in Title, Slug, and Content before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const postDate = form.publish_date || new Date().toISOString().split('T')[0];
      const payload: BlogPost = {
        id: form.id || '',
        title: form.title || '',
        slug: form.slug || '',
        thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        content: form.content || '',
        excerpt: form.excerpt || form.content.slice(0, 160).replace(/[#*`\n]/g, '') + '...',
        category: form.category || 'Web Design',
        published: publishedState,
        publish_date: postDate,
        tags: form.tags || '',
        meta_title: form.meta_title || form.title.slice(0, 60),
        meta_description: form.meta_description || form.excerpt || form.content.slice(0, 150).replace(/[#*`\n]/g, '') + '...',
        canonical_url: form.canonical_url || `https://harshdigitalstudios.com/blog/${form.slug}`,
        author: form.author || 'Harsh Patel',
        reading_time: form.reading_time || '5 min read',
        is_draft: isDraftState
      };

      const success = await supabaseService.saveBlogPost(payload);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsEditorOpen(false);
        loadBlogs();
        if (onBlogSaved) onBlogSaved();
      } else {
        alert('Failed to save blog post.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const success = await supabaseService.deleteBlogPost(id);
      if (success) {
        loadBlogs();
        if (onBlogSaved) onBlogSaved();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Search, categories, and status filters logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tags && blog.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' || blog.category === categoryFilter;
    
    const nowStr = new Date().toISOString().split('T')[0];
    const isScheduled = blog.published && blog.publish_date && blog.publish_date > nowStr;
    const isLive = blog.published && (!blog.publish_date || blog.publish_date <= nowStr);
    const isDraft = !blog.published || blog.is_draft;

    let matchesStatus = true;
    if (statusFilter === 'Published') matchesStatus = isLive;
    if (statusFilter === 'Scheduled') matchesStatus = !!isScheduled;
    if (statusFilter === 'Draft') matchesStatus = isDraft;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenEditor = (blog?: BlogPost) => {
    if (blog) {
      setForm({ ...blog });
    } else {
      setForm({
        id: '',
        title: '',
        slug: '',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        content: '',
        excerpt: '',
        category: 'Web Design',
        published: false,
        publish_date: new Date().toISOString().split('T')[0],
        tags: '',
        meta_title: '',
        meta_description: '',
        canonical_url: '',
        author: 'Harsh Patel',
        reading_time: '1 min read',
        is_draft: true
      });
    }
    setActiveEditorTab('content');
    setPreviewMode('edit');
    setIsEditorOpen(true);
  };

  // Real-time generator payloads
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": form.title || 'Untitled',
    "image": form.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    "author": {
      "@type": "Person",
      "name": form.author || 'Harsh Patel'
    },
    "publisher": {
      "@type": "Organization",
      "name": "Harsh Digital Studios",
      "logo": {
        "@type": "ImageObject",
        "url": "https://harshdigitalstudios.com/logo.png"
      }
    },
    "datePublished": form.publish_date || new Date().toISOString().split('T')[0],
    "description": form.meta_description || form.excerpt || 'A local search engine marketing article'
  }, null, 2);

  const sitemapEntry = `
<url>
  <loc>https://harshdigitalstudios.com/blog/${form.slug || 'slug'}</loc>
  <lastmod>${form.publish_date || new Date().toISOString().split('T')[0]}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>`.trim();

  return (
    <div className="space-y-6">
      {/* Save Toast Feedback */}
      {saveSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-black px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Blog saved successfully!</span>
        </div>
      )}

      {/* Main Admin Blog Workspace view */}
      {!isEditorOpen ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card-bg border border-card-border rounded-2xl p-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>SEO Content Engine</span>
              </h3>
              <p className="text-[10px] text-text-tertiary mt-1">
                Create, schedule, publish, and optimize top-ranking high intent blogs for Raigarh search landscapes.
              </p>
            </div>
            <button
              onClick={() => handleOpenEditor()}
              className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blog</span>
            </button>
          </div>

          {/* Search, filters & status widgets */}
          <div className="bg-card-bg/60 border border-card-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keywords..."
                className="pl-10 pr-4 py-2 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent w-full text-xs text-text-primary placeholder-text-tertiary font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category selector */}
              <div className="flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-text-tertiary" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-neutral-950 border border-card-border rounded-xl text-[11px] py-1.5 px-3 font-semibold text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Web Design">Web Design</option>
                  <option value="SEO">SEO</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="AI Automation">AI Automation</option>
                  <option value="Business Strategy">Business Strategy</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-card-border rounded-xl text-[11px] py-1.5 px-3 font-semibold text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Live</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Drafts</option>
              </select>

              <button 
                onClick={loadBlogs}
                className="p-2 hover:bg-btn-bg border border-btn-border rounded-xl text-text-secondary transition-all"
                title="Reload Blogs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto" />
              <p className="text-xs text-text-secondary font-mono">Connecting to CRM database...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
              <FileText className="w-10 h-10 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-primary">No blog posts found</p>
                <p className="text-xs text-text-tertiary">Create your first SEO search ranking article to connect with local buyers.</p>
              </div>
              <button
                onClick={() => handleOpenEditor()}
                className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-lg hover:opacity-90"
              >
                Add Blog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBlogs.map((blog) => {
                const nowStr = new Date().toISOString().split('T')[0];
                const isScheduled = blog.published && blog.publish_date && blog.publish_date > nowStr;
                const isLive = blog.published && (!blog.publish_date || blog.publish_date <= nowStr);
                const isDraft = !blog.published || blog.is_draft;

                return (
                  <div key={blog.id} className="bg-card-bg border border-card-border hover:border-accent/40 rounded-2xl overflow-hidden flex flex-col justify-between group relative transition-all duration-300">
                    
                    <div className="h-40 bg-neutral-950 relative overflow-hidden shrink-0">
                      <img 
                        src={blog.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                        <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[8px] font-bold text-accent font-mono tracking-widest uppercase rounded border border-accent/20">
                          {blog.category}
                        </span>
                        <div>
                          {isLive && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-black text-[7px] font-extrabold uppercase rounded tracking-wider">
                              ● Live
                            </span>
                          )}
                          {isScheduled && (
                            <span className="px-2 py-0.5 bg-sky-500 text-black text-[7px] font-extrabold uppercase rounded tracking-wider flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" /> Scheduled
                            </span>
                          )}
                          {isDraft && (
                            <span className="px-2 py-0.5 bg-neutral-700 text-white text-[7px] font-extrabold uppercase rounded tracking-wider">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <p className="text-[9px] text-[#00F0FF] font-mono flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> {blog.author || 'Harsh Patel'}
                        </p>
                        <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1 mt-0.5">{blog.title}</h4>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-text-tertiary leading-relaxed line-clamp-2">
                          {blog.excerpt || 'No summary configured.'}
                        </p>
                        {blog.tags && (
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.split(',').slice(0, 3).map((tag, tIdx) => (
                              <span key={tIdx} className="px-1 py-0.5 bg-neutral-900 text-[8px] text-text-tertiary font-mono rounded">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-card-border pt-3">
                        <div className="flex items-center gap-1 text-[9px] text-text-tertiary font-mono">
                          <Clock className="w-3 h-3 text-accent" />
                          <span>{blog.reading_time || '5 min'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditor(blog)}
                            className="p-1.5 bg-neutral-900 border border-card-border rounded-md hover:bg-neutral-800 text-text-secondary hover:text-accent transition-colors"
                            title="Edit Blog"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            className="p-1.5 bg-neutral-900 border border-card-border rounded-md hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Expanded Full Page Editor View with Real-time SEO Toolings */
        <div className="bg-card-bg border border-card-border rounded-[24px] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-card-border pb-4">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-950 border border-card-border hover:bg-neutral-900 rounded-lg text-xs font-bold text-text-secondary transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Registry</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary font-mono">Status:</span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${form.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-text-secondary'}`}>
                {form.published ? 'Publish Mode' : 'Draft Mode'}
              </span>
            </div>
          </div>

          {/* Tab Sub-navigation inside editor */}
          <div className="flex border-b border-card-border">
            {[
              { id: 'content', label: '1. Article Copy', icon: FileText },
              { id: 'seo', label: '2. SEO Meta Rules', icon: Globe },
              { id: 'generator', label: '3. Auto Generated Assets', icon: FileCode }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activeEditorTab === tab.id 
                      ? 'border-accent text-accent' 
                      : 'border-transparent text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active editor view contents */}
          {activeEditorTab === 'content' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., How to Boost Local Map Rankings"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-sans text-text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Slug URL</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="boost-local-map-rankings"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-mono text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-semibold text-text-secondary cursor-pointer"
                  >
                    <option value="Web Design">Web Design</option>
                    <option value="SEO">SEO</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Business Strategy">Business Strategy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs text-text-primary font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="SEO, local business, maps"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs text-text-primary font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Featured Image URL</label>
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-sans text-text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase flex items-center justify-between">
                    <span>Reading Time (Auto-calculated)</span>
                    <span className="text-[9px] text-[#00F0FF] lowercase">{form.reading_time}</span>
                  </label>
                  <input
                    type="text"
                    value={form.reading_time}
                    disabled
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-card-border rounded-xl text-xs font-mono text-text-tertiary cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Rich Markdown Text Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-neutral-950 border border-card-border p-2 rounded-xl">
                  <div className="flex items-center gap-1 border-r border-card-border pr-2 mr-2">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 hover:bg-neutral-800 text-text-secondary hover:text-text-primary rounded text-xs font-bold"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 hover:bg-neutral-800 text-text-secondary hover:text-text-primary rounded text-xs italic"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      className="p-1.5 hover:bg-neutral-800 text-text-secondary hover:text-text-primary rounded text-xs font-bold"
                      title="Heading"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="p-1.5 hover:bg-neutral-800 text-text-secondary hover:text-text-primary rounded text-xs"
                      title="List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      className="p-1.5 hover:bg-neutral-800 text-text-secondary hover:text-text-primary rounded text-xs font-mono"
                      title="Quote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('`', '`')}
                      className="p-1.5 hover:bg-neutral-800 text-text-secondary hover:text-text-primary rounded text-xs font-mono"
                      title="Code Block"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('edit')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded ${previewMode === 'edit' ? 'bg-accent text-black' : 'text-text-tertiary hover:text-text-secondary'}`}
                    >
                      Write Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('preview')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded ${previewMode === 'preview' ? 'bg-accent text-black' : 'text-text-tertiary hover:text-text-secondary'}`}
                    >
                      Live Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('split')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded hidden lg:block ${previewMode === 'split' ? 'bg-accent text-black' : 'text-text-tertiary hover:text-text-secondary'}`}
                    >
                      Dual Pane
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Textarea Code Editor */}
                  {(previewMode === 'edit' || previewMode === 'split') && (
                    <div className="space-y-1.5">
                      <textarea
                        id="blog-content-textarea"
                        value={form.content}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write article copy using standard Markdown formatting... Use headings, lists, tables to build rich structures."
                        className="w-full h-[380px] p-4 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-mono text-text-primary leading-relaxed resize-y scrollbar-none"
                      />
                    </div>
                  )}

                  {/* High Quality Styled HTML Preview Pane */}
                  {(previewMode === 'preview' || previewMode === 'split') && (
                    <div className="border border-card-border bg-neutral-950/60 rounded-xl p-6 h-[380px] overflow-y-auto font-sans leading-relaxed text-text-secondary space-y-4 text-xs scrollbar-none">
                      <div className="pb-3 border-b border-card-border">
                        <span className="text-[10px] font-bold text-accent font-mono uppercase tracking-widest block mb-1">
                          Live Rendered Blog Preview
                        </span>
                        <h1 className="text-sm font-bold text-text-primary font-heading tracking-tight">{form.title || 'Untitled Blog Post'}</h1>
                        <p className="text-[10px] text-text-tertiary mt-1">Written by {form.author} • {form.reading_time || '1 min read'}</p>
                      </div>

                      {/* Simulating basic Markdown formatting to HTML */}
                      {form.content ? (
                        <div className="space-y-3 prose-mini font-sans text-xs">
                          {form.content.split('\n\n').map((paragraph, pIdx) => {
                            if (paragraph.startsWith('### ')) {
                              return <h3 key={pIdx} className="text-xs font-bold text-white pt-2 border-b border-white/5 pb-1 font-heading">{paragraph.replace('### ', '')}</h3>;
                            }
                            if (paragraph.startsWith('## ')) {
                              return <h2 key={pIdx} className="text-xs font-bold text-white pt-2 border-b border-white/5 pb-1 font-heading">{paragraph.replace('## ', '')}</h2>;
                            }
                            if (paragraph.startsWith('- ')) {
                              return (
                                <ul key={pIdx} className="list-disc pl-4 space-y-1">
                                  {paragraph.split('\n').map((li, lIdx) => (
                                    <li key={lIdx}>{li.replace('- ', '')}</li>
                                  ))}
                                </ul>
                              );
                            }
                            if (paragraph.startsWith('> ')) {
                              return <blockquote key={pIdx} className="border-l-2 border-accent pl-3 italic text-text-tertiary">{paragraph.replace('> ', '')}</blockquote>;
                            }
                            return <p key={pIdx} className="leading-relaxed text-text-secondary">{paragraph}</p>;
                          })}
                        </div>
                      ) : (
                        <p className="text-text-tertiary italic">Start writing in the code editor to see live rendering...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeEditorTab === 'seo' && (
            <div className="space-y-5">
              <div className="bg-neutral-950/40 border border-card-border rounded-xl p-4 flex gap-3 items-start">
                <AlertCircle className="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-text-primary">SEO Best Practices & Integrity</p>
                  <p className="text-[10px] text-text-tertiary leading-relaxed">
                    Google indexes headings, meta tags, and schema. Ensure your meta description summarizes the core customer query and stays within character benchmarks to avoid snippet truncation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Meta Title Tag</label>
                    <span className={`text-[9px] font-mono font-bold ${form.meta_title && form.meta_title.length > 60 ? 'text-red-400' : 'text-accent'}`}>
                      {form.meta_title ? form.meta_title.length : 0} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Search query friendly page title"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs text-text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Canonical URL</label>
                  </div>
                  <input
                    type="text"
                    value={form.canonical_url}
                    onChange={(e) => setForm(prev => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="https://harshdigitalstudios.com/blog/slug-url"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-mono text-text-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Meta Description snippet</label>
                  <span className={`text-[9px] font-mono font-bold ${form.meta_description && form.meta_description.length > 160 ? 'text-red-400' : 'text-accent'}`}>
                    {form.meta_description ? form.meta_description.length : 0} / 160 chars
                  </span>
                </div>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => setForm(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="e.g., Learn how premium website development and Local SEO optimizes Google Maps visibility and drives high-intent customer leads in Raigarh."
                  className="w-full h-24 p-3.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs text-text-primary leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase">SEO Excerpt (For blog listing page)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short, interesting snippet to grab click engagement on the index grid..."
                  className="w-full h-20 p-3.5 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs text-text-primary leading-relaxed resize-none"
                />
              </div>

              {/* Real-time Interactive Open Graph Social Preview */}
              <div className="space-y-2 border-t border-card-border pt-4">
                <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-accent" />
                  <span>Real-time OG Link card preview (Simulation)</span>
                </label>
                
                <div className="bg-neutral-950 border border-card-border rounded-2xl p-4 max-w-sm mx-auto shadow-sm">
                  <div className="rounded-xl overflow-hidden bg-neutral-900 border border-card-border">
                    <img 
                      src={form.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'} 
                      alt="Link Preview Card"
                      className="w-full h-36 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-3 bg-neutral-900 space-y-1 font-sans text-[11px]">
                      <p className="text-[9px] text-[#00F0FF] font-mono uppercase tracking-wider">harshdigitalstudios.com</p>
                      <p className="font-bold text-white text-xs line-clamp-1">{form.meta_title || form.title || 'Untitled Article'}</p>
                      <p className="text-text-tertiary line-clamp-2 text-[10px]">{form.meta_description || form.excerpt || 'A local search engine marketing article'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeEditorTab === 'generator' && (
            <div className="space-y-6">
              {/* Automated URL and details */}
              <div className="space-y-4">
                <div className="bg-neutral-950 border border-card-border rounded-xl p-4 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider block">Generated Blog URL</span>
                    <span className="text-xs font-bold text-white font-mono break-all">
                      https://harshdigitalstudios.com/blog/{form.slug || 'your-slug'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://harshdigitalstudios.com/blog/${form.slug || ''}`);
                      alert('Copied URL!');
                    }}
                    className="p-2 hover:bg-neutral-800 border border-card-border rounded-lg text-text-secondary hover:text-accent transition-all"
                    title="Copy URL"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic structured data LD-JSON */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5 text-accent" />
                    <span>Structured Data Schema.org (JSON-LD)</span>
                  </label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(structuredData);
                      alert('Copied Structured Data Schema!');
                    }}
                    className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase bg-neutral-950 hover:bg-neutral-900 border border-card-border text-text-secondary rounded"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 bg-neutral-950 border border-card-border rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-56 scrollbar-none">
                  {structuredData}
                </pre>
              </div>

              {/* Sitemap entries fragment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-accent" />
                    <span>XML Sitemap Entry Fragment</span>
                  </label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sitemapEntry);
                      alert('Copied Sitemap Fragment!');
                    }}
                    className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase bg-neutral-950 hover:bg-neutral-900 border border-card-border text-text-secondary rounded"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 bg-neutral-950 border border-card-border rounded-xl text-[10px] font-mono text-[#00F0FF] overflow-x-auto leading-relaxed scrollbar-none">
                  {sitemapEntry}
                </pre>
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="border-t border-card-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase block">Publish Date (Schedule Publish)</label>
              <input
                type="date"
                value={form.publish_date}
                onChange={(e) => setForm(prev => ({ ...prev, publish_date: e.target.value }))}
                className="px-3.5 py-1.5 bg-neutral-950 border border-card-border rounded-xl text-xs font-mono text-text-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleSave(false, true)} // publish = false, is_draft = true
                disabled={isSaving}
                className="px-3.5 py-2 border border-card-border hover:bg-neutral-900 text-text-secondary font-bold text-xs uppercase tracking-wider rounded-xl transition-all w-full sm:w-auto cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  const nowStr = new Date().toISOString().split('T')[0];
                  if (form.publish_date && form.publish_date > nowStr) {
                    handleSave(true, false); // publish = true, is_draft = false (will automatically render based on date)
                  } else {
                    handleSave(true, false); // publish = true, is_draft = false (immediate publish)
                  }
                }}
                disabled={isSaving}
                className="px-4 py-2 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1 w-full sm:w-auto cursor-pointer"
              >
                {form.publish_date && form.publish_date > new Date().toISOString().split('T')[0] ? (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Publish</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
