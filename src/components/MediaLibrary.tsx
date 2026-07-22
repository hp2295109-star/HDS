import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, FolderPlus, FileText, Image as ImageIcon, Video, File, Search, 
  Copy, Check, Trash2, Edit2, Upload, X, ArrowLeft, ExternalLink, Grid, 
  List, ChevronRight, HardDrive, Plus, Info, CornerDownRight, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { mediaService, MediaItem, MediaFolder } from '../services/mediaService';

interface MediaLibraryProps {
  mode?: 'manage' | 'select';
  onSelect?: (url: string) => void;
  onClose?: () => void;
  allowedTypes?: Array<'image' | 'video' | 'pdf' | 'icon'>;
}

export default function MediaLibrary({ 
  mode = 'manage', 
  onSelect, 
  onClose,
  allowedTypes = ['image', 'video', 'pdf', 'icon']
}: MediaLibraryProps) {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Navigation, Filtering & Sorting State
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<string>('all'); // all, image, video, pdf, icon
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'size' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Selected file details state (for right sidebar preview)
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modals & Forms State
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
  const [renamingItemName, setRenamingItemName] = useState('');
  
  const [movingItemId, setMovingItemId] = useState<string | null>(null);
  
  // Drag-and-drop & replace state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Status Alerts
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const fetchedFolders = await mediaService.getFolders();
      const fetchedItems = await mediaService.getItems();
      setFolders(fetchedFolders);
      setItems(fetchedItems);
    } catch (e) {
      showFeedback('error', 'Failed to load media assets.');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const folder = await mediaService.createFolder(newFolderName.trim(), selectedFolderId);
      setFolders(prev => [...prev, folder]);
      setNewFolderName('');
      setIsNewFolderOpen(false);
      showFeedback('success', `Created folder "${folder.name}"`);
    } catch (e) {
      showFeedback('error', 'Failed to create folder.');
    }
  };

  const handleRenameFolder = async (folderId: string) => {
    if (!editingFolderName.trim()) return;
    try {
      const success = await mediaService.renameFolder(folderId, editingFolderName.trim());
      if (success) {
        setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: editingFolderName.trim() } : f));
        setEditingFolderId(null);
        setEditingFolderName('');
        showFeedback('success', 'Folder renamed.');
      }
    } catch (e) {
      showFeedback('error', 'Failed to rename folder.');
    }
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Are you sure you want to delete "${folderName}"? Any files inside will be moved to Root.`)) return;
    try {
      const success = await mediaService.deleteFolder(folderId);
      if (success) {
        setFolders(prev => prev.filter(f => f.id !== folderId));
        setItems(prev => prev.map(item => item.folderId === folderId ? { ...item, folderId: null } : item));
        if (selectedFolderId === folderId) {
          setSelectedFolderId(null);
        }
        showFeedback('success', `Deleted folder "${folderName}"`);
      }
    } catch (e) {
      showFeedback('error', 'Failed to delete folder.');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedItem = await mediaService.uploadFile(file, selectedFolderId);
        setItems(prev => [uploadedItem, ...prev]);
        uploadedCount++;
      }
      showFeedback('success', `Successfully uploaded ${uploadedCount} file(s) to Supabase Storage!`);
    } catch (e) {
      showFeedback('error', 'Failed to upload some file(s).');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRenameItem = async (itemId: string) => {
    if (!renamingItemName.trim()) return;
    try {
      const success = await mediaService.renameFile(itemId, renamingItemName.trim());
      if (success) {
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, name: renamingItemName.trim() } : item));
        if (activeItem?.id === itemId) {
          setActiveItem(prev => prev ? { ...prev, name: renamingItemName.trim() } : null);
        }
        setRenamingItemId(null);
        setRenamingItemName('');
        showFeedback('success', 'File renamed successfully.');
      }
    } catch (e) {
      showFeedback('error', 'Failed to rename file.');
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${itemName}"?`)) return;
    try {
      const success = await mediaService.deleteFile(itemId);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        if (activeItem?.id === itemId) {
          setActiveItem(null);
        }
        showFeedback('success', 'File deleted permanently.');
      }
    } catch (e) {
      showFeedback('error', 'Failed to delete file.');
    }
  };

  const handleMoveItem = async (itemId: string, folderId: string | null) => {
    try {
      const success = await mediaService.moveFile(itemId, folderId);
      if (success) {
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, folderId } : item));
        setMovingItemId(null);
        showFeedback('success', 'Moved file successfully.');
      }
    } catch (e) {
      showFeedback('error', 'Failed to move file.');
    }
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeItem) return;
    setUploading(true);
    try {
      const updated = await mediaService.replaceFile(activeItem.id, file);
      if (updated) {
        setItems(prev => prev.map(item => item.id === activeItem.id ? updated : item));
        setActiveItem(updated);
        showFeedback('success', `File replaced with "${file.name}"`);
      } else {
        showFeedback('error', 'Failed to replace file.');
      }
    } catch (e) {
      showFeedback('error', 'Error replacing file.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format bytes cleanly
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Filtering Logic
  const filteredFolders = folders.filter(folder => {
    // Show subfolders of the currently active folder
    return folder.parentId === selectedFolderId;
  });

  const filteredItems = items.filter(item => {
    // Match current folder structure
    const matchesFolder = item.folderId === selectedFolderId;
    
    // Match Search Query
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Match Type Filter
    const matchesType = activeType === 'all' || item.type === activeType;
    
    // Filter types allowed by props
    const isAllowed = allowedTypes.includes(item.type);

    return matchesFolder && matchesSearch && matchesType && isAllowed;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortOption === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortOption === 'size') {
      return b.size - a.size;
    }
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Calculate current folder's breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [];
    let currentId = selectedFolderId;
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        crumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={`grid grid-cols-1 ${activeItem ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 h-full items-start`}>
      {/* LEFT/MIDDLE: Folder view, uploads, files grid (Takes 3 columns if item selected, or full width) */}
      <div className={`${activeItem ? 'lg:col-span-3' : 'lg:col-span-3'} bg-card-bg border border-card-border rounded-2xl overflow-hidden flex flex-col justify-between`}>
        
        {/* Header toolbar */}
        <div className="p-5 border-b border-card-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center flex-wrap gap-1 text-[11px] font-mono font-semibold">
              <button 
                onClick={() => setSelectedFolderId(null)}
                className={`hover:text-accent transition-colors flex items-center gap-1 ${!selectedFolderId ? 'text-accent' : 'text-text-tertiary'}`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Media Root</span>
              </button>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.id}>
                  <ChevronRight className="w-3 h-3 text-text-tertiary" />
                  <button
                    onClick={() => setSelectedFolderId(crumb.id)}
                    className={`hover:text-accent transition-colors ${idx === breadcrumbs.length - 1 ? 'text-accent' : 'text-text-tertiary'}`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewFolderOpen(true)}
                className="px-3 py-1.5 bg-neutral-900 border border-card-border hover:border-accent/40 rounded-xl text-[10px] font-bold text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5"
              >
                <FolderPlus className="w-3.5 h-3.5 text-accent" />
                <span>New Folder</span>
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Media</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                multiple
                className="hidden" 
                onChange={(e) => handleFileUpload(e.target.files)} 
              />
            </div>
          </div>

          {/* Search, filters, views */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search media items by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-card-border rounded-xl focus:outline-none focus:border-accent text-xs font-sans text-text-primary"
              />
            </div>

            {/* Content Filters */}
            <div className="flex items-center flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Files', icon: File },
                { id: 'image', label: 'Images', icon: ImageIcon },
                { id: 'video', label: 'Videos', icon: Video },
                { id: 'pdf', label: 'PDFs', icon: FileText },
                { id: 'icon', label: 'Icons', icon: Plus }
              ].map(type => {
                const TypeIcon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
                      activeType === type.id
                        ? 'bg-neutral-900 border-accent text-accent'
                        : 'bg-neutral-950 border-card-border text-text-tertiary hover:text-text-secondary hover:border-text-tertiary/40'
                    }`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    <span>{type.label}</span>
                  </button>
                );
              })}

              <div className="border-l border-card-border pl-1.5 ml-1.5 flex items-center gap-1.5">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-neutral-950 border border-card-border rounded-xl px-2 py-1.5 text-[10px] font-mono text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="size">Sort: Size (Largest)</option>
                  <option value="name">Sort: Name (A-Z)</option>
                </select>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-neutral-900 border-card-border text-accent' : 'border-transparent text-text-tertiary'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg border transition-all ${viewMode === 'list' ? 'bg-neutral-900 border-card-border text-accent' : 'border-transparent text-text-tertiary'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK STATUS */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className={`px-5 py-2.5 flex items-center gap-2 text-xs font-semibold ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/10' : 'bg-red-500/10 text-red-400 border-b border-red-500/10'}`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DRAG AND DROP ZONE / MAIN BODY */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`p-6 min-h-[400px] relative transition-all duration-300 ${dragActive ? 'bg-accent/5 border-2 border-dashed border-accent' : ''}`}
        >
          {dragActive && (
            <div className="absolute inset-0 bg-neutral-950/80 z-20 flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <Upload className="w-10 h-10 text-accent animate-bounce" />
              <p className="text-sm font-bold text-text-primary">Drop files here to upload</p>
              <p className="text-xs text-text-tertiary">Files will be safely stored in Supabase Storage buckets.</p>
            </div>
          )}

          {/* NEW FOLDER FORM */}
          <AnimatePresence>
            {isNewFolderOpen && (
              <motion.form 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleCreateFolder}
                className="bg-neutral-950 border border-card-border p-4 rounded-xl mb-5 flex items-center justify-between gap-3"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-mono text-text-tertiary uppercase font-bold">New Folder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Portfolio Case Studies"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-card-border rounded-lg text-xs font-sans text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsNewFolderOpen(false)}
                    className="px-2.5 py-1.5 bg-neutral-900 border border-card-border rounded-lg text-[10px] font-bold text-text-tertiary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-accent text-black rounded-lg text-[10px] font-extrabold"
                  >
                    Create
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-text-tertiary font-mono">Synchronizing media cloud storage...</p>
            </div>
          ) : filteredFolders.length === 0 && filteredItems.length === 0 ? (
            <div className="py-20 text-center max-w-sm mx-auto space-y-4">
              <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-text-tertiary">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-primary">This folder is empty</p>
                <p className="text-xs text-text-tertiary">Drag & drop files, or create a folder to begin organizing your assets.</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg hover:opacity-90 inline-flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Folders Grid */}
              {filteredFolders.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-text-tertiary uppercase font-bold tracking-wider">Folders</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                    {filteredFolders.map(folder => (
                      <div 
                        key={folder.id}
                        className="bg-neutral-950 border border-card-border hover:border-accent/30 rounded-xl p-3 flex items-center justify-between group transition-all"
                      >
                        <button
                          onClick={() => setSelectedFolderId(folder.id)}
                          className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                        >
                          <Folder className="w-4 h-4 text-accent shrink-0" />
                          {editingFolderId === folder.id ? (
                            <input
                              type="text"
                              value={editingFolderName}
                              onChange={(e) => setEditingFolderName(e.target.value)}
                              onBlur={() => handleRenameFolder(folder.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameFolder(folder.id);
                                if (e.key === 'Escape') setEditingFolderId(null);
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              className="bg-neutral-900 border border-accent rounded px-1.5 py-0.5 text-xs text-text-primary font-sans w-full focus:outline-none"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary truncate">{folder.name}</span>
                          )}
                        </button>
                        
                        {/* Folder control triggers */}
                        {editingFolderId !== folder.id && (
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-1 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingFolderId(folder.id);
                                setEditingFolderName(folder.name);
                              }}
                              className="p-1 text-text-tertiary hover:text-accent rounded hover:bg-neutral-900"
                              title="Rename folder"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFolder(folder.id, folder.name);
                              }}
                              className="p-1 text-text-tertiary hover:text-red-400 rounded hover:bg-neutral-900"
                              title="Delete folder"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Grid/List View */}
              {filteredItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-text-tertiary uppercase font-bold tracking-wider">Files ({filteredItems.length})</h4>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {filteredItems.map(item => {
                        const isActive = activeItem?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setActiveItem(item)}
                            className={`bg-neutral-950 border rounded-xl overflow-hidden group flex flex-col justify-between cursor-pointer transition-all ${
                              isActive ? 'border-accent ring-1 ring-accent' : 'border-card-border hover:border-text-tertiary/40'
                            }`}
                          >
                            {/* File Thumbnail Preview */}
                            <div className="h-28 bg-neutral-900 relative flex items-center justify-center overflow-hidden border-b border-card-border shrink-0">
                              {item.type === 'image' && (
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              {item.type === 'icon' && (
                                <div className="p-4 bg-neutral-950 rounded-lg border border-card-border flex items-center justify-center">
                                  <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-8 h-8 object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                              {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <Video className="w-7 h-7 text-accent" />
                                </div>
                              )}
                              {item.type === 'pdf' && (
                                <div className="text-center space-y-1">
                                  <FileText className="w-8 h-8 text-rose-500 mx-auto" />
                                  <span className="text-[8px] font-bold font-mono text-text-tertiary uppercase">PDF</span>
                                </div>
                              )}

                              {/* Size Badge */}
                              <span className="absolute bottom-2 right-2 bg-black/85 text-[7px] font-bold px-1.5 py-0.5 rounded text-text-tertiary">
                                {formatBytes(item.size)}
                              </span>
                            </div>

                            {/* File description */}
                            <div className="p-2.5 space-y-1">
                              <div className="flex items-start justify-between gap-1.5">
                                {renamingItemId === item.id ? (
                                  <input
                                    type="text"
                                    value={renamingItemName}
                                    onChange={(e) => setRenamingItemName(e.target.value)}
                                    onBlur={() => handleRenameItem(item.id)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleRenameItem(item.id);
                                      if (e.key === 'Escape') setRenamingItemId(null);
                                    }}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-neutral-900 border border-accent rounded px-1 py-0.5 text-[10px] text-text-primary font-sans w-full focus:outline-none"
                                  />
                                ) : (
                                  <p className="text-[10px] font-bold text-text-secondary group-hover:text-text-primary line-clamp-1 truncate flex-1 leading-normal" title={item.name}>
                                    {item.name}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-[8px] text-text-tertiary font-mono pt-1">
                                <span className="uppercase text-accent">{item.type}</span>
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      setRenamingItemId(item.id);
                                      setRenamingItemName(item.name);
                                    }}
                                    className="hover:text-accent p-0.5"
                                    title="Rename File"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(item.url, item.id)}
                                    className="hover:text-accent p-0.5"
                                    title="Copy Direct URL"
                                  >
                                    {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id, item.name)}
                                    className="hover:text-red-400 p-0.5"
                                    title="Delete File"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* LIST VIEW */
                    <div className="bg-neutral-950 border border-card-border rounded-xl overflow-hidden font-sans">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-neutral-900/60 text-text-tertiary text-[9px] font-mono uppercase tracking-wider border-b border-card-border">
                            <th className="p-3 pl-4">Name</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Size</th>
                            <th className="p-3 text-right pr-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border/50">
                          {filteredItems.map(item => {
                            const isCopied = copiedId === item.id;
                            return (
                              <tr 
                                key={item.id}
                                onClick={() => setActiveItem(item)}
                                className={`hover:bg-neutral-900/40 cursor-pointer transition-colors ${activeItem?.id === item.id ? 'bg-neutral-900' : ''}`}
                              >
                                <td className="p-3 pl-4 flex items-center gap-2.5 font-semibold text-text-secondary">
                                  {item.type === 'image' && <ImageIcon className="w-4 h-4 text-[#00F0FF] shrink-0" />}
                                  {item.type === 'video' && <Video className="w-4 h-4 text-accent shrink-0" />}
                                  {item.type === 'pdf' && <FileText className="w-4 h-4 text-rose-500 shrink-0" />}
                                  {item.type === 'icon' && <Plus className="w-4 h-4 text-amber-500 shrink-0" />}
                                  
                                  {renamingItemId === item.id ? (
                                    <input
                                      type="text"
                                      value={renamingItemName}
                                      onChange={(e) => setRenamingItemName(e.target.value)}
                                      onBlur={() => handleRenameItem(item.id)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameItem(item.id);
                                        if (e.key === 'Escape') setRenamingItemId(null);
                                      }}
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                      className="bg-neutral-900 border border-accent rounded px-2 py-0.5 text-xs text-text-primary focus:outline-none"
                                    />
                                  ) : (
                                    <span className="truncate max-w-xs md:max-w-md block" title={item.name}>{item.name}</span>
                                  )}
                                </td>
                                <td className="p-3 text-text-tertiary font-mono uppercase text-[10px]">{item.type}</td>
                                <td className="p-3 text-text-tertiary font-mono text-[10px]">{formatBytes(item.size)}</td>
                                <td className="p-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2 text-text-tertiary">
                                    <button
                                      onClick={() => {
                                        setRenamingItemId(item.id);
                                        setRenamingItemName(item.name);
                                      }}
                                      className="hover:text-accent p-1"
                                      title="Rename"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => copyToClipboard(item.url, item.id)}
                                      className="hover:text-accent p-1"
                                      title="Copy URL"
                                    >
                                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id, item.name)}
                                      className="hover:text-red-400 p-1"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Live preview of selected item or quick actions */}
      {activeItem && (
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-5 flex flex-col justify-between shrink-0 h-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h3 className="text-xs font-bold text-text-primary font-mono uppercase">Asset Inspector</h3>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 hover:bg-neutral-900 rounded text-text-tertiary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="aspect-video w-full bg-neutral-950 rounded-xl overflow-hidden border border-card-border flex items-center justify-center relative group p-1">
              {activeItem.type === 'image' && (
                <img
                  src={activeItem.url}
                  alt={activeItem.name}
                  className="max-h-full max-w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              )}
              {activeItem.type === 'icon' && (
                <div className="p-6 bg-neutral-900/60 rounded-xl border border-card-border">
                  <img
                    src={activeItem.url}
                    alt={activeItem.name}
                    className="w-12 h-12 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              {activeItem.type === 'video' && (
                <video
                  src={activeItem.url}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
              {activeItem.type === 'pdf' && (
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 text-rose-500 mx-auto" />
                  <a 
                    href={activeItem.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1 justify-center"
                  >
                    <span>Open Document</span> <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Asset Metadata fields */}
            <div className="space-y-3 font-mono text-[10px] leading-relaxed">
              <div>
                <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px]">Filename</span>
                <span className="text-text-secondary font-sans font-semibold break-all text-xs">{activeItem.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px]">Type</span>
                  <span className="text-accent font-bold uppercase">{activeItem.type}</span>
                </div>
                <div>
                  <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px]">Size</span>
                  <span className="text-text-secondary">{formatBytes(activeItem.size)}</span>
                </div>
              </div>
              {activeItem.dimensions && (
                <div>
                  <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px]">Dimensions</span>
                  <span className="text-text-secondary">{activeItem.dimensions}</span>
                </div>
              )}
              <div>
                <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px]">Uploaded On</span>
                <span className="text-text-secondary">{new Date(activeItem.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px] mb-1">Direct Cloud URL</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={activeItem.url}
                    className="flex-1 bg-neutral-950 border border-card-border rounded-lg px-2 py-1 text-[9px] text-text-tertiary select-all focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => copyToClipboard(activeItem.url, activeItem.id)}
                    className="px-2.5 bg-neutral-900 border border-card-border rounded-lg hover:border-accent/40 text-text-secondary hover:text-accent transition-all shrink-0"
                    title="Copy URL"
                  >
                    {copiedId === activeItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Replace file action */}
              <div className="pt-2 border-t border-card-border/60 space-y-1.5">
                <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px]">Replace File Asset</span>
                <button
                  onClick={() => replaceFileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-1.5 bg-neutral-900 border border-card-border hover:border-accent/40 rounded-lg text-[10px] font-bold text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3 text-accent" />
                  <span>Upload Replacement File</span>
                </button>
                <input
                  type="file"
                  ref={replaceFileInputRef}
                  className="hidden"
                  onChange={handleReplaceFile}
                />
              </div>

              {/* Move to folder action */}
              <div className="pt-2 border-t border-card-border/60">
                <span className="text-text-tertiary block font-bold uppercase tracking-wider text-[8px] mb-1">Move to Folder</span>
                <select
                  value={activeItem.folderId || ''}
                  onChange={(e) => handleMoveItem(activeItem.id, e.target.value || null)}
                  className="w-full bg-neutral-950 border border-card-border rounded-lg px-2.5 py-1.5 text-[10px] text-text-secondary focus:outline-none cursor-pointer"
                >
                  <option value="">[ Root / Unorganized ]</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Selector Selection Button for Mode === 'select' */}
          {mode === 'select' && onSelect && (
            <div className="pt-4 border-t border-card-border mt-4">
              <button
                onClick={() => {
                  onSelect(activeItem.url);
                  if (onClose) onClose();
                }}
                className="w-full py-2 bg-accent text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1"
              >
                Select This Asset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
