import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  cmsService, CMSContent, defaultCMSContent, 
  CMSBlogPost, CMSFaqItem, CMSTimelineItem, CMSServicePillar, CMSProcessStep 
} from '../services/cmsService';
import { 
  Save, Upload, Eye, CheckCircle2, AlertCircle, Trash2, Plus, 
  HelpCircle, ToggleLeft, ToggleRight, ArrowUpRight, ArrowDownRight, RefreshCw, 
  Settings, Image as ImageIcon, Sparkles, BookOpen, Layers, List, Phone, Link2, 
  ShieldCheck, Globe, Check, Info, FileText, HardDrive, X
} from 'lucide-react';
import MediaLibrary from './MediaLibrary';

export default function CMSEditor() {
  const [content, setContent] = useState<CMSContent>(defaultCMSContent);
  const [activeSection, setActiveSection] = useState<
    'hero' | 'about' | 'services' | 'process' | 'faq' | 'blog' | 'footer' | 'contact' | 'socials' | 'visibility'
  >('hero');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isModified, setIsModified] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activePickerKeyPath, setActivePickerKeyPath] = useState<string[] | null>(null);

  // For nested list editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Load draft CMS content on mount
  useEffect(() => {
    async function loadCMS() {
      try {
        const draft = await cmsService.getCMSContent('draft');
        setContent(draft);
      } catch (err) {
        console.error('Failed to load CMS content in editor:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCMS();
  }, []);

  // Show auto-expiring feedback
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Mark content as modified when changes occur
  const updateContent = (updater: (prev: CMSContent) => CMSContent) => {
    setContent(prev => {
      const next = updater(prev);
      setIsModified(true);
      
      // Dispatch live update event for real-time iframe sync if previewing in parallel
      const event = new CustomEvent('hds_cms_preview_update', { detail: next });
      window.dispatchEvent(event);
      
      return next;
    });
  };

  // Save draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const success = await cmsService.saveCMSDraft(content);
      if (success) {
        setIsModified(false);
        showFeedback('success', 'Draft saved successfully. View changes using Preview mode!');
      } else {
        showFeedback('error', 'Failed to save draft content.');
      }
    } catch (e) {
      showFeedback('error', 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Publish live
  const handlePublishLive = async () => {
    setPublishing(true);
    try {
      const success = await cmsService.publishCMSContent(content);
      if (success) {
        setIsModified(false);
        showFeedback('success', 'Published successfully! All changes are now live on the website.');
      } else {
        showFeedback('error', 'Failed to publish live content.');
      }
    } catch (e) {
      showFeedback('error', 'An error occurred while publishing.');
    } finally {
      setPublishing(false);
    }
  };

  // Revert draft to live published content
  const handleRevertDraft = async () => {
    if (!window.confirm('Are you sure you want to revert all unsaved draft changes back to the currently published live content?')) {
      return;
    }
    setReverting(true);
    try {
      const live = await cmsService.revertDraftToPublished();
      setContent(live);
      setIsModified(false);
      showFeedback('success', 'Draft reverted back to published content.');
    } catch (e) {
      showFeedback('error', 'Failed to revert draft content.');
    } finally {
      setReverting(false);
    }
  };

  // Handle preview in new window/tab
  const handlePreview = () => {
    // Save state first to ensure preview is accurate
    cmsService.saveCMSDraft(content).then(() => {
      localStorage.setItem('hds_cms_preview_mode', 'active');
      window.open('/?preview=true', '_blank');
    });
  };

  // Image Upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, keyPath: string[]) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImageKey(keyPath.join('.'));
    try {
      const url = await cmsService.uploadImage(file);
      updateContent(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        let obj = copy;
        for (let i = 0; i < keyPath.length - 1; i++) {
          obj = obj[keyPath[i]];
        }
        obj[keyPath[keyPath.length - 1]] = url;
        return copy;
      });
      showFeedback('success', 'Image uploaded successfully!');
    } catch (err) {
      showFeedback('error', 'Failed to upload image asset.');
    } finally {
      setUploadingImageKey(null);
    }
  };

  // Select Image helper from central Media Library
  const handleImageSelect = (url: string) => {
    if (!activePickerKeyPath) return;
    updateContent(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < activePickerKeyPath.length - 1; i++) {
        obj = obj[activePickerKeyPath[i]];
      }
      obj[activePickerKeyPath[activePickerKeyPath.length - 1]] = url;
      return copy;
    });
    showFeedback('success', 'Selected asset applied successfully!');
    setIsMediaPickerOpen(false);
    setActivePickerKeyPath(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary font-mono text-xs">
        <RefreshCw className="w-8 h-8 animate-spin text-accent mb-3" />
        <span>Loading Framer CMS Content Modules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top action control bar */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/15 text-accent rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">CMS Webflow Engine</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isModified ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-mono text-text-tertiary">
                {isModified ? 'Draft has unsaved edits' : 'Synced with Cloud Sandbox'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRevertDraft}
            disabled={reverting || (!isModified && localStorage.getItem('hds_cms_draft') === null)}
            className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-text-secondary disabled:opacity-30 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            title="Discard current draft edits and load published content"
          >
            {reverting ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Revert Draft'}
          </button>

          <button
            onClick={handlePreview}
            className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-text-secondary rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            title="Open preview site showing your latest unsaved edits"
          >
            <Eye className="w-3.5 h-3.5 text-secondary" />
            <span>Preview Draft</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving || !isModified}
            className="px-4 py-1.5 bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/25 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublishLive}
            disabled={publishing}
            className="px-5 py-1.5 bg-accent text-black font-extrabold rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-accent/5 hover:opacity-90 cursor-pointer"
          >
            {publishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" /> : <Globe className="w-3.5 h-3.5" />}
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Feedback Notification popup banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-start text-xs animate-slide-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/25 text-red-400'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 mr-2.5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 mr-2.5 shrink-0 text-red-400" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Main CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Navigation: CMS Sections list */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[9px] font-extrabold tracking-widest text-text-tertiary uppercase block mb-2.5 px-1.5">CMS Collections</span>
          <div className="bg-card-bg border border-card-border rounded-2xl p-2.5 space-y-1 shadow-sm">
            {[
              { id: 'hero', label: 'Hero Section', icon: Sparkles },
              { id: 'about', label: 'About Me Story', icon: BookOpen },
              { id: 'services', label: 'Interactive Services', icon: Layers },
              { id: 'process', label: 'Website Process', icon: List },
              { id: 'faq', label: 'SEO Answer Engine (FAQ)', icon: HelpCircle },
              { id: 'blog', label: 'Knowledge Hub (Blog)', icon: FileText },
              { id: 'contact', label: 'Contact Information', icon: Phone },
              { id: 'socials', label: 'Social Media Links', icon: Link2 },
              { id: 'footer', label: 'Footer Brand Settings', icon: Settings },
              { id: 'visibility', label: 'Section Visibility Control', icon: Eye }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id as any); setEditingIndex(null); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-accent/15 border border-accent/20 text-accent font-bold' 
                      : 'text-text-secondary hover:bg-btn-bg border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-text-tertiary'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="p-3.5 bg-btn-bg/30 border border-card-border rounded-2xl text-[10px] text-text-tertiary leading-relaxed">
            <span className="font-bold text-text-secondary uppercase block mb-1">💡 CMS Editor Guide</span>
            Changes made are saved as a draft locally. Live users will only see your changes once you click <span className="text-accent font-bold">Publish Live</span>.
          </div>
        </div>

        {/* Right Side Editing Form Panel */}
        <div className="lg:col-span-9 bg-card-bg border border-card-border rounded-3xl p-5 md:p-6 shadow-sm space-y-6">
          
          {/* Header */}
          <div className="pb-3.5 border-b border-card-border">
            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">Active CMS Section</span>
            <h3 className="text-md font-bold font-heading text-text-primary capitalize mt-0.5">
              Editing {activeSection === 'faq' ? 'SEO Answer Engine (FAQ)' : activeSection === 'blog' ? 'Knowledge Hub (Blog)' : activeSection} Section
            </h3>
          </div>

          {/* SECTION Form Fields mapping */}

          {/* 1. HERO SECTION EDITOR */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Hero Badge Text</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Lighthouse Speed Score</label>
                  <input
                    type="text"
                    value={content.hero.speedScore}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, speedScore: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Main Title Line 1</label>
                  <input
                    type="text"
                    value={content.hero.titleLine1}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, titleLine1: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Main Title Line 2 (Highlighted)</label>
                  <input
                    type="text"
                    value={content.hero.titleLine2}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, titleLine2: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent font-semibold text-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Sub-headline / Paragraph Copy</label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
                  className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-card-border">
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase mb-2">Primary CTA Button</h4>
                  <input
                    type="text"
                    value={content.hero.ctaBookCall}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, ctaBookCall: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none"
                    placeholder="Button Text"
                  />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase mb-2">Secondary CTA Button</h4>
                  <input
                    type="text"
                    value={content.hero.ctaExploreDemos}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, ctaExploreDemos: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none"
                    placeholder="Button Text"
                  />
                </div>
              </div>

              {/* Stat Highlights */}
              <div className="pt-4 border-t border-card-border space-y-3">
                <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Trust Metric Highlights</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-btn-bg/40 p-3 rounded-xl border border-btn-border/50">
                    <input
                      type="text"
                      value={content.hero.stat1Value}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, stat1Value: e.target.value } }))}
                      className="w-full bg-transparent text-sm font-bold text-accent font-mono focus:outline-none text-center"
                    />
                    <input
                      type="text"
                      value={content.hero.stat1Label}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, stat1Label: e.target.value } }))}
                      className="w-full bg-transparent text-[9px] text-text-secondary text-center focus:outline-none mt-1 font-semibold"
                    />
                  </div>
                  <div className="bg-btn-bg/40 p-3 rounded-xl border border-btn-border/50">
                    <input
                      type="text"
                      value={content.hero.stat2Value}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, stat2Value: e.target.value } }))}
                      className="w-full bg-transparent text-sm font-bold text-secondary font-mono focus:outline-none text-center"
                    />
                    <input
                      type="text"
                      value={content.hero.stat2Label}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, stat2Label: e.target.value } }))}
                      className="w-full bg-transparent text-[9px] text-text-secondary text-center focus:outline-none mt-1 font-semibold"
                    />
                  </div>
                  <div className="bg-btn-bg/40 p-3 rounded-xl border border-btn-border/50">
                    <input
                      type="text"
                      value={content.hero.stat3Value}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, stat3Value: e.target.value } }))}
                      className="w-full bg-transparent text-sm font-bold text-text-primary font-mono focus:outline-none text-center"
                    />
                    <input
                      type="text"
                      value={content.hero.stat3Label}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, stat3Label: e.target.value } }))}
                      className="w-full bg-transparent text-[9px] text-text-secondary text-center focus:outline-none mt-1 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Bio card */}
              <div className="pt-4 border-t border-card-border space-y-3">
                <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Bio Ribbon Card</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-text-tertiary uppercase">Name Header</label>
                    <input
                      type="text"
                      value={content.hero.avatarName}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, avatarName: e.target.value } }))}
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-tertiary uppercase">Avatar Initials</label>
                    <input
                      type="text"
                      value={content.hero.avatarLetters}
                      onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, avatarLetters: e.target.value } }))}
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-text-tertiary uppercase">Mini description</label>
                  <input
                    type="text"
                    value={content.hero.avatarDesc}
                    onChange={(e) => updateContent(prev => ({ ...prev, hero: { ...prev.hero, avatarDesc: e.target.value } }))}
                    className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs"
                  />
                </div>
              </div>

            </div>
          )}

          {/* 2. ABOUT ME STORY EDITOR */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">About Section Big Title</label>
                  <input
                    type="text"
                    value={content.about.headerTitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, about: { ...prev.about, headerTitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">About Section Paragraph Intro</label>
                  <textarea
                    rows={3}
                    value={content.about.headerSubtitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, about: { ...prev.about, headerSubtitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                  />
                </div>
              </div>

              {/* Timeline Milestones list editing */}
              <div className="pt-4 border-t border-card-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Timeline Milestones ({content.about.timeline.length})</h4>
                  <button
                    onClick={() => {
                      const newMilestone: CMSTimelineItem = {
                        year: "New Era",
                        title: "Custom Milestone Title",
                        desc: "Provide description detailing this achievement milestone.",
                        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                      };
                      updateContent(prev => ({
                        ...prev,
                        about: { ...prev.about, timeline: [...prev.about.timeline, newMilestone] }
                      }));
                      setEditingIndex(content.about.timeline.length);
                    }}
                    className="px-2 py-1 bg-accent text-black font-extrabold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-2">
                  {content.about.timeline.map((item, index) => {
                    const isEditingThis = editingIndex === index;
                    return (
                      <div key={index} className="bg-btn-bg/30 border border-card-border/80 rounded-xl overflow-hidden p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 bg-accent/15 text-accent text-[11px] font-mono font-bold rounded">
                              {item.year}
                            </span>
                            <span className="font-bold text-xs text-text-primary truncate max-w-[200px] sm:max-w-[320px]">
                              {item.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingIndex(isEditingThis ? null : index)}
                              className="px-2 py-1 bg-btn-bg border border-btn-border hover:bg-btn-hover-bg rounded text-[10px] text-text-secondary font-semibold cursor-pointer"
                            >
                              {isEditingThis ? 'Close Editor' : 'Edit milestone'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this timeline milestone?')) {
                                  updateContent(prev => ({
                                    ...prev,
                                    about: { ...prev.about, timeline: prev.about.timeline.filter((_, i) => i !== index) }
                                  }));
                                  setEditingIndex(null);
                                }
                              }}
                              className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded text-text-tertiary"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable milestone Form */}
                        {isEditingThis && (
                          <div className="pt-3 border-t border-card-border space-y-3 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Year/Badge</label>
                                <input
                                  type="text"
                                  value={item.year}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.about.timeline];
                                    copy[index].year = e.target.value;
                                    return { ...prev, about: { ...prev.about, timeline: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Milestone Title</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.about.timeline];
                                    copy[index].title = e.target.value;
                                    return { ...prev, about: { ...prev.about, timeline: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary">Image URL</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePickerKeyPath(['about', 'timeline', index.toString(), 'image']);
                                    setIsMediaPickerOpen(true);
                                  }}
                                  className="text-[9px] text-accent font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                                >
                                  <HardDrive className="w-2.5 h-2.5" />
                                  <span>Select from Library</span>
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.image}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.about.timeline];
                                    copy[index].image = e.target.value;
                                    return { ...prev, about: { ...prev.about, timeline: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs"
                                />
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, ['about', 'timeline', index.toString(), 'image'])}
                                    className="hidden"
                                    id={`milestone-file-${index}`}
                                  />
                                  <label
                                    htmlFor={`milestone-file-${index}`}
                                    className="px-2.5 py-1.5 bg-accent text-black font-extrabold text-[10px] uppercase rounded-lg hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    {uploadingImageKey === `about.timeline.${index}.image` ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Upload className="w-3 h-3" />
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Milestone Narrative Description</label>
                              <textarea
                                rows={3}
                                value={item.desc}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.about.timeline];
                                  copy[index].desc = e.target.value;
                                  return { ...prev, about: { ...prev.about, timeline: copy } };
                                })}
                                className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs resize-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 3. SERVICES PILLARS EDITOR */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Services Hub Hero Title</label>
                  <input
                    type="text"
                    value={content.services.heroTitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, services: { ...prev.services, heroTitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Services Hub Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={content.services.heroSubtitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, services: { ...prev.services, heroSubtitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                  />
                </div>
              </div>

              {/* Service pillars list */}
              <div className="pt-4 border-t border-card-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Service Pillars ({content.services.pillars.length})</h4>
                  <button
                    onClick={() => {
                      const newPillar: CMSServicePillar = {
                        id: `service-${Math.random().toString(36).substring(2, 6)}`,
                        title: "Custom Service Title",
                        category: "Design",
                        price: "₹5,000+",
                        desc: "Detailed description of what this service offers to local businesses.",
                        benefits: ["Dynamic Benefit Feature 1", "Dynamic Benefit Feature 2"]
                      };
                      updateContent(prev => ({
                        ...prev,
                        services: { ...prev.services, pillars: [...prev.services.pillars, newPillar] }
                      }));
                      setEditingIndex(content.services.pillars.length);
                    }}
                    className="px-2 py-1 bg-accent text-black font-extrabold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Service
                  </button>
                </div>

                <div className="space-y-2">
                  {content.services.pillars.map((pillar, index) => {
                    const isEditingThis = editingIndex === index;
                    return (
                      <div key={pillar.id} className="bg-btn-bg/30 border border-card-border rounded-xl p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-btn-bg text-[9px] font-bold font-mono text-text-tertiary rounded uppercase border border-btn-border">
                              {pillar.category}
                            </span>
                            <span className="font-bold text-xs text-text-primary truncate max-w-[200px]">
                              {pillar.title}
                            </span>
                            <span className="text-accent font-mono text-xs font-bold">
                              {pillar.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingIndex(isEditingThis ? null : index)}
                              className="px-2 py-1 bg-btn-bg border border-btn-border hover:bg-btn-hover-bg rounded text-[10px] text-text-secondary font-semibold cursor-pointer"
                            >
                              {isEditingThis ? 'Close' : 'Edit details'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this service pillar?')) {
                                  updateContent(prev => ({
                                    ...prev,
                                    services: { ...prev.services, pillars: prev.services.pillars.filter((_, i) => i !== index) }
                                  }));
                                  setEditingIndex(null);
                                }
                              }}
                              className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded text-text-tertiary"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Pillar edit fields */}
                        {isEditingThis && (
                          <div className="pt-3 border-t border-card-border space-y-3 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Service Title</label>
                                <input
                                  type="text"
                                  value={pillar.title}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.services.pillars];
                                    copy[index].title = e.target.value;
                                    return { ...prev, services: { ...prev.services, pillars: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Category Group</label>
                                <select
                                  value={pillar.category}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.services.pillars];
                                    copy[index].category = e.target.value as any;
                                    return { ...prev, services: { ...prev.services, pillars: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs"
                                >
                                  <option value="Design">Design</option>
                                  <option value="SEO">SEO</option>
                                  <option value="Marketing">Marketing</option>
                                  <option value="Maintenance">Maintenance</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Pricing (e.g. ₹15k+)</label>
                                <input
                                  type="text"
                                  value={pillar.price}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.services.pillars];
                                    copy[index].price = e.target.value;
                                    return { ...prev, services: { ...prev.services, pillars: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Bullet Point Benefits (one per line)</label>
                              <textarea
                                rows={3}
                                value={pillar.benefits.join('\n')}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.services.pillars];
                                  copy[index].benefits = e.target.value.split('\n').filter(b => b.trim() !== '');
                                  return { ...prev, services: { ...prev.services, pillars: copy } };
                                })}
                                className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs resize-none"
                                placeholder="Benefit point 1&#10;Benefit point 2&#10;Benefit point 3"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Service description</label>
                              <textarea
                                rows={2}
                                value={pillar.desc}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.services.pillars];
                                  copy[index].desc = e.target.value;
                                  return { ...prev, services: { ...prev.services, pillars: copy } };
                                })}
                                className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs resize-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 4. WEBSITE PROCESS BLUEPRINT EDITOR */}
          {activeSection === 'process' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Blueprint Section Big Title</label>
                  <input
                    type="text"
                    value={content.process.title}
                    onChange={(e) => updateContent(prev => ({ ...prev, process: { ...prev.process, title: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Blueprint Section Subtitle</label>
                  <textarea
                    rows={2}
                    value={content.process.subtitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, process: { ...prev.process, subtitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="pt-4 border-t border-card-border space-y-3">
                <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">4 Blueprint Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.process.steps.map((step, index) => (
                    <div key={index} className="bg-btn-bg/30 border border-card-border p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black font-mono text-accent/30">{step.step}</span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateContent(prev => {
                            const copy = [...prev.process.steps];
                            copy[index].title = e.target.value;
                            return { ...prev, process: { ...prev.process, steps: copy } };
                          })}
                          className="bg-transparent border-b border-card-border text-xs font-bold text-text-primary focus:outline-none focus:border-accent flex-1 ml-3"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={step.desc}
                        onChange={(e) => updateContent(prev => {
                          const copy = [...prev.process.steps];
                          copy[index].desc = e.target.value;
                          return { ...prev, process: { ...prev.process, steps: copy } };
                        })}
                        className="w-full bg-transparent border border-btn-border/40 p-2 rounded-xl text-[11px] text-text-secondary focus:outline-none resize-none mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 5. FAQ SEO ANSWER ENGINE EDITOR */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">FAQ Hero Title</label>
                  <input
                    type="text"
                    value={content.faqs.title}
                    onChange={(e) => updateContent(prev => ({ ...prev, faqs: { ...prev.faqs, title: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">FAQ Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={content.faqs.subtitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, faqs: { ...prev.faqs, subtitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                  />
                </div>
              </div>

              {/* FAQ Q&A list */}
              <div className="pt-4 border-t border-card-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">SEO Questions Registry ({content.faqs.faqs.length})</h4>
                  <button
                    onClick={() => {
                      const newFaq: CMSFaqItem = {
                        q: "New local FAQ question title?",
                        a: "Tailored answer explaining this query with rich keywords matching searchers search criteria."
                      };
                      updateContent(prev => ({
                        ...prev,
                        faqs: { ...prev.faqs, faqs: [...prev.faqs.faqs, newFaq] }
                      }));
                      setEditingIndex(content.faqs.faqs.length);
                    }}
                    className="px-2 py-1 bg-accent text-black font-extrabold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add FAQ
                  </button>
                </div>

                <div className="space-y-2">
                  {content.faqs.faqs.map((faq, index) => {
                    const isEditingThis = editingIndex === index;
                    return (
                      <div key={index} className="bg-btn-bg/30 border border-card-border rounded-xl p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-text-primary truncate max-w-[280px] sm:max-w-[500px]">
                            {faq.q}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingIndex(isEditingThis ? null : index)}
                              className="px-2 py-1 bg-btn-bg border border-btn-border hover:bg-btn-hover-bg rounded text-[10px] text-text-secondary font-semibold cursor-pointer"
                            >
                              {isEditingThis ? 'Close' : 'Edit answer'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this FAQ record?')) {
                                  updateContent(prev => ({
                                    ...prev,
                                    faqs: { ...prev.faqs, faqs: prev.faqs.faqs.filter((_, i) => i !== index) }
                                  }));
                                  setEditingIndex(null);
                                }
                              }}
                              className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded text-text-tertiary"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isEditingThis && (
                          <div className="pt-3 border-t border-card-border space-y-3 animate-fade-in">
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Question Text</label>
                              <input
                                type="text"
                                value={faq.q}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.faqs.faqs];
                                  copy[index].q = e.target.value;
                                  return { ...prev, faqs: { ...prev.faqs, faqs: copy } };
                                })}
                                className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Structured Answer</label>
                              <textarea
                                rows={4}
                                value={faq.a}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.faqs.faqs];
                                  copy[index].a = e.target.value;
                                  return { ...prev, faqs: { ...prev.faqs, faqs: copy } };
                                })}
                                className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs resize-none leading-relaxed"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 6. BLOG / KNOWLEDGE ARTICLES EDITOR */}
          {activeSection === 'blog' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Knowledge Hub Main Title</label>
                  <input
                    type="text"
                    value={content.blog.title}
                    onChange={(e) => updateContent(prev => ({ ...prev, blog: { ...prev.blog, title: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Knowledge Hub Subtitle</label>
                  <textarea
                    rows={2}
                    value={content.blog.subtitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, blog: { ...prev.blog, subtitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                  />
                </div>
              </div>

              {/* Article posts */}
              <div className="pt-4 border-t border-card-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono font-bold text-text-tertiary uppercase">Published Article Guides ({content.blog.posts.length})</h4>
                  <button
                    onClick={() => {
                      const newPost: CMSBlogPost = {
                        id: `blog-guide-${Math.random().toString(36).substring(2, 6)}`,
                        title: "Why SEO and Custom Websites Beat Social Marketing in 2026",
                        tag: "Marketing Strategy",
                        time: "8 min read",
                        desc: "Provide summary preview of the article to tease users. This renders on the home grid teaser list.",
                        content: "## Custom Markdown Title\nIntroduce article details. You can write rich formatting with **Markdown** tags."
                      };
                      updateContent(prev => ({
                        ...prev,
                        blog: { ...prev.blog, posts: [...prev.blog.posts, newPost] }
                      }));
                      setEditingIndex(content.blog.posts.length);
                    }}
                    className="px-2 py-1 bg-accent text-black font-extrabold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Article
                  </button>
                </div>

                <div className="space-y-3">
                  {content.blog.posts.map((post, index) => {
                    const isEditingThis = editingIndex === index;
                    return (
                      <div key={post.id || index} className="bg-btn-bg/30 border border-card-border rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-btn-bg text-[9px] font-bold font-mono text-accent rounded uppercase">
                              {post.tag}
                            </span>
                            <span className="font-bold text-xs text-text-primary truncate max-w-[200px] sm:max-w-[420px]">
                              {post.title}
                            </span>
                            <span className="text-[10px] text-text-tertiary font-mono">
                              ({post.time})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingIndex(isEditingThis ? null : index)}
                              className="px-2.5 py-1 bg-btn-bg border border-btn-border hover:bg-btn-hover-bg rounded text-[10px] text-text-secondary font-bold uppercase tracking-wider cursor-pointer"
                            >
                              {isEditingThis ? 'Close Markdown Editor' : 'Edit Article Content'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Remove this blog post permanently?')) {
                                  updateContent(prev => ({
                                    ...prev,
                                    blog: { ...prev.blog, posts: prev.blog.posts.filter((_, i) => i !== index) }
                                  }));
                                  setEditingIndex(null);
                                }
                              }}
                              className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded text-text-tertiary"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>

                        {isEditingThis && (
                          <div className="pt-4 border-t border-card-border space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Article Category Tag</label>
                                <input
                                  type="text"
                                  value={post.tag}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.blog.posts];
                                    copy[index].tag = e.target.value;
                                    return { ...prev, blog: { ...prev.blog, posts: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Read Duration (e.g. 10 min read)</label>
                                <input
                                  type="text"
                                  value={post.time}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.blog.posts];
                                    copy[index].time = e.target.value;
                                    return { ...prev, blog: { ...prev.blog, posts: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Unique Slug Identifier</label>
                                <input
                                  type="text"
                                  value={post.id}
                                  onChange={(e) => updateContent(prev => {
                                    const copy = [...prev.blog.posts];
                                    copy[index].id = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                                    return { ...prev, blog: { ...prev.blog, posts: copy } };
                                  })}
                                  className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs font-mono text-accent"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Article Headline Title</label>
                              <input
                                type="text"
                                value={post.title}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.blog.posts];
                                  copy[index].title = e.target.value;
                                  return { ...prev, blog: { ...prev.blog, posts: copy } };
                                })}
                                className="w-full px-3 py-1 bg-btn-bg border border-btn-border rounded-lg text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-bold text-text-tertiary mb-1">Teaser summary description (homepage snippet)</label>
                              <textarea
                                rows={2}
                                value={post.desc}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.blog.posts];
                                  copy[index].desc = e.target.value;
                                  return { ...prev, blog: { ...prev.blog, posts: copy } };
                                })}
                                className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs resize-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[9px] uppercase font-bold text-text-tertiary">Detailed Article Content (Supports Markdown Elements)</label>
                                <span className="text-[8px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded font-bold">Rich Text Native editor</span>
                              </div>
                              <textarea
                                rows={10}
                                value={post.content || ''}
                                onChange={(e) => updateContent(prev => {
                                  const copy = [...prev.blog.posts];
                                  copy[index].content = e.target.value;
                                  return { ...prev, blog: { ...prev.blog, posts: copy } };
                                })}
                                className="w-full px-3.5 py-2.5 bg-btn-bg border border-btn-border rounded-xl text-xs font-mono resize-y leading-relaxed"
                                placeholder="## Enter title&#10;Write detailed paragraphs. Supports standard headers (#), bold (**), lists (-)."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 7. CONTACT INFORMATION EDITOR */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Contact Section Badge</label>
                  <input
                    type="text"
                    value={content.contact.badge}
                    onChange={(e) => updateContent(prev => ({ ...prev, contact: { ...prev.contact, badge: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Primary Location Address</label>
                  <input
                    type="text"
                    value={content.contact.address}
                    onChange={(e) => updateContent(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Contact Section Title</label>
                  <input
                    type="text"
                    value={content.contact.heroTitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, contact: { ...prev.contact, heroTitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Support Email Address</label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateContent(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Contact Section Paragraph description</label>
                  <textarea
                    rows={2}
                    value={content.contact.heroSubtitle}
                    onChange={(e) => updateContent(prev => ({ ...prev, contact: { ...prev.contact, heroSubtitle: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Active Telephone / WhatsApp</label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) => updateContent(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          {/* 8. SOCIAL LINKS EDITOR */}
          {activeSection === 'socials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">WhatsApp Chat Direct Link</label>
                  <input
                    type="text"
                    value={content.socials.whatsapp}
                    onChange={(e) => updateContent(prev => ({ ...prev, socials: { ...prev.socials, whatsapp: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Instagram Profile link</label>
                  <input
                    type="text"
                    value={content.socials.instagram}
                    onChange={(e) => updateContent(prev => ({ ...prev, socials: { ...prev.socials, instagram: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Facebook Brand Page</label>
                  <input
                    type="text"
                    value={content.socials.facebook}
                    onChange={(e) => updateContent(prev => ({ ...prev, socials: { ...prev.socials, facebook: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">LinkedIn Professional Profile</label>
                  <input
                    type="text"
                    value={content.socials.linkedin}
                    onChange={(e) => updateContent(prev => ({ ...prev, socials: { ...prev.socials, linkedin: e.target.value } }))}
                    className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">YouTube Brand Link</label>
                <input
                  type="text"
                  value={content.socials.youtube}
                  onChange={(e) => updateContent(prev => ({ ...prev, socials: { ...prev.socials, youtube: e.target.value } }))}
                  className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary font-mono"
                />
              </div>
            </div>
          )}

          {/* 9. FOOTER SETTINGS EDITOR */}
          {activeSection === 'footer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Footer Brand Summary Description</label>
                <textarea
                  rows={3}
                  value={content.footer.description}
                  onChange={(e) => updateContent(prev => ({ ...prev, footer: { ...prev.footer, description: e.target.value } }))}
                  className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1.5">Copyright Rights Ribbon (e.g. All Rights Reserved.)</label>
                <input
                  type="text"
                  value={content.footer.rights}
                  onChange={(e) => updateContent(prev => ({ ...prev, footer: { ...prev.footer, rights: e.target.value } }))}
                  className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary"
                />
              </div>
            </div>
          )}

          {/* 10. SECTION VISIBILITY CONFIGURATION */}
          {activeSection === 'visibility' && (
            <div className="space-y-4">
              <p className="text-[11px] text-text-tertiary leading-relaxed mb-4">
                Toggle the switch options to globally hide or display complete section elements from rendering on your public Chhattisgarh local website layout dynamically.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                {[
                  { key: 'showHero', label: 'Display Hero Banner Section' },
                  { key: 'showAbout', label: 'Display Founder About Me section' },
                  { key: 'showServices', label: 'Display Services pillars list' },
                  { key: 'showProcess', label: 'Display Website Blueprint steps' },
                  { key: 'showFAQ', label: 'Display Frequently Asked Questions' },
                  { key: 'showBlog', label: 'Display Dynamic Blog Articles' },
                  { key: 'showContact', label: 'Display Secure Leads Form' },
                  { key: 'showSocials', label: 'Render Social footer icons' }
                ].map(item => {
                  const val = (content.visibility as any)[item.key];
                  return (
                    <div 
                      key={item.key} 
                      onClick={() => updateContent(prev => {
                        const nextVis = { ...prev.visibility, [item.key]: !val };
                        return { ...prev, visibility: nextVis };
                      })}
                      className="bg-btn-bg/30 hover:bg-btn-bg/60 p-3.5 rounded-2xl border border-btn-border/50 flex items-center justify-between cursor-pointer select-none transition-all"
                    >
                      <span className="text-xs font-bold text-text-secondary uppercase">{item.label}</span>
                      <button className="text-accent transition-transform shrink-0">
                        {val ? (
                          <ToggleRight className="w-8 h-8 text-accent shrink-0" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-text-tertiary shrink-0" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FOOTER SAVING REMINDER */}
          {isModified && (
            <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-accent/5 p-4 rounded-2xl border border-accent/10">
              <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                <Info className="w-4.5 h-4.5 text-accent shrink-0" />
                <span>Edits are currently unsaved drafts. Confirm preview or save changes!</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 bg-secondary text-black font-extrabold text-[10px] uppercase rounded-lg hover:opacity-95 cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublishLive}
                  className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-[10px] uppercase rounded-lg hover:opacity-95 cursor-pointer"
                >
                  Publish Live
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Media Picker Modal Overlay */}
      <AnimatePresence>
        {isMediaPickerOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card-bg border border-card-border rounded-2xl w-full max-w-5xl h-[85vh] p-6 relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-card-border pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-bold text-text-primary font-mono uppercase tracking-tight">Select CMS Asset</h3>
                </div>
                <button 
                  onClick={() => setIsMediaPickerOpen(false)}
                  className="p-1 hover:bg-neutral-900 rounded-lg text-text-tertiary hover:text-text-primary transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <MediaLibrary 
                  mode="select" 
                  allowedTypes={['image', 'icon']} 
                  onSelect={(url) => {
                    handleImageSelect(url);
                  }} 
                  onClose={() => setIsMediaPickerOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
