import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'icon';
  folderId: string | null;
  size: number;
  created_at: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
  created_at: string;
}

// Default items to populate if empty
const DEFAULT_FOLDERS: MediaFolder[] = [
  { id: 'f-images', name: 'Images', parentId: null, created_at: new Date().toISOString() },
  { id: 'f-videos', name: 'Videos', parentId: null, created_at: new Date().toISOString() },
  { id: 'f-pdfs', name: 'Documents', parentId: null, created_at: new Date().toISOString() },
  { id: 'f-icons', name: 'Icons', parentId: null, created_at: new Date().toISOString() },
];

const DEFAULT_ITEMS: MediaItem[] = [
  {
    id: 'm1',
    name: 'Harsh Digital Studios Logo.png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    folderId: 'f-images',
    size: 245000,
    created_at: new Date().toISOString()
  },
  {
    id: 'm2',
    name: 'Raigarh Local SEO Case Study.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    folderId: 'f-pdfs',
    size: 1540000,
    created_at: new Date().toISOString()
  },
  {
    id: 'm3',
    name: 'Raigarh Business Growth Intro.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-39965-large.mp4',
    type: 'video',
    folderId: 'f-videos',
    size: 12400000,
    created_at: new Date().toISOString()
  },
  {
    id: 'm4',
    name: 'Google My Business Ranking Icon.png',
    url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=300&q=80',
    type: 'icon',
    folderId: 'f-icons',
    size: 12000,
    created_at: new Date().toISOString()
  }
];

class MediaService {
  private useSupabaseDb = false;

  constructor() {
    this.checkDatabaseAvailability();
  }

  private async checkDatabaseAvailability() {
    if (!isSupabaseConfigured) {
      this.useSupabaseDb = false;
      return;
    }
    try {
      // Check if media_items table exists
      const { error } = await supabase.from('media_items').select('id').limit(1);
      if (error && error.code === '42P01') {
        // Table doesn't exist
        this.useSupabaseDb = false;
      } else {
        this.useSupabaseDb = !error;
      }
    } catch (e) {
      this.useSupabaseDb = false;
    }
  }

  async getFolders(): Promise<MediaFolder[]> {
    if (this.useSupabaseDb) {
      try {
        const { data, error } = await supabase
          .from('media_folders')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data) return data;
      } catch (e) {
        console.error('Supabase getFolders error:', e);
      }
    }

    // LocalStorage Fallback
    const stored = localStorage.getItem('hds_media_folders');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEFAULT_FOLDERS;
      }
    } else {
      localStorage.setItem('hds_media_folders', JSON.stringify(DEFAULT_FOLDERS));
      return DEFAULT_FOLDERS;
    }
  }

  async getItems(): Promise<MediaItem[]> {
    if (this.useSupabaseDb) {
      try {
        const { data, error } = await supabase
          .from('media_items')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.error('Supabase getItems error:', e);
      }
    }

    // LocalStorage Fallback
    const stored = localStorage.getItem('hds_media_items');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEFAULT_ITEMS;
      }
    } else {
      localStorage.setItem('hds_media_items', JSON.stringify(DEFAULT_ITEMS));
      return DEFAULT_ITEMS;
    }
  }

  async createFolder(name: string, parentId: string | null = null): Promise<MediaFolder> {
    const newFolder: MediaFolder = {
      id: 'f-' + Math.random().toString(36).substring(2, 9),
      name,
      parentId,
      created_at: new Date().toISOString()
    };

    if (this.useSupabaseDb) {
      try {
        const { data, error } = await supabase
          .from('media_folders')
          .insert(newFolder)
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.error('Supabase createFolder error:', e);
      }
    }

    const folders = await this.getFolders();
    folders.push(newFolder);
    localStorage.setItem('hds_media_folders', JSON.stringify(folders));
    return newFolder;
  }

  async renameFolder(id: string, name: string): Promise<boolean> {
    if (this.useSupabaseDb) {
      try {
        const { error } = await supabase
          .from('media_folders')
          .update({ name })
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase renameFolder error:', e);
      }
    }

    const folders = await this.getFolders();
    const folder = folders.find(f => f.id === id);
    if (folder) {
      folder.name = name;
      localStorage.setItem('hds_media_folders', JSON.stringify(folders));
      return true;
    }
    return false;
  }

  async deleteFolder(id: string): Promise<boolean> {
    if (this.useSupabaseDb) {
      try {
        const { error } = await supabase
          .from('media_folders')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase deleteFolder error:', e);
      }
    }

    const folders = await this.getFolders();
    const filteredFolders = folders.filter(f => f.id !== id);
    localStorage.setItem('hds_media_folders', JSON.stringify(filteredFolders));

    // Move any child items of deleted folder to root
    const items = await this.getItems();
    let itemsModified = false;
    items.forEach(item => {
      if (item.folderId === id) {
        item.folderId = null;
        itemsModified = true;
      }
    });
    if (itemsModified) {
      localStorage.setItem('hds_media_items', JSON.stringify(items));
    }

    return true;
  }

  // Upload a file to Supabase Storage and create a media library entry
  async uploadFile(file: File, folderId: string | null = null): Promise<MediaItem> {
    let fileUrl = '';
    const fileExt = file.name.split('.').pop() || '';
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `media-library/${Math.random().toString(36).substring(2, 10)}_${sanitizedFileName}`;

    // Determine type
    let type: 'image' | 'video' | 'pdf' | 'icon' = 'image';
    const mimeType = file.type.toLowerCase();
    if (mimeType.includes('video/')) {
      type = 'video';
    } else if (mimeType.includes('pdf') || fileExt.toLowerCase() === 'pdf') {
      type = 'pdf';
    } else if (fileExt.toLowerCase() === 'ico' || sanitizedFileName.toLowerCase().includes('icon')) {
      type = 'icon';
    } else if (mimeType.includes('image/')) {
      type = 'image';
    }

    if (isSupabaseConfigured) {
      try {
        // Try 'media' bucket first, fall back to 'cms_assets'
        let bucket = 'media';
        let uploadResult = await supabase.storage
          .from(bucket)
          .upload(storagePath, file, { cacheControl: '3600', upsert: true });

        if (uploadResult.error) {
          console.warn(`Supabase Storage upload to 'media' bucket failed, attempting fallback 'cms_assets':`, uploadResult.error);
          bucket = 'cms_assets';
          uploadResult = await supabase.storage
            .from(bucket)
            .upload(storagePath, file, { cacheControl: '3600', upsert: true });
        }

        if (uploadResult.error) {
          throw uploadResult.error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);
        fileUrl = publicUrl;
      } catch (err) {
        console.error('Supabase storage upload error, falling back to local URL simulation:', err);
        fileUrl = await this.readFileAsDataURL(file);
      }
    } else {
      // Offline simulation fallback using Local URL/Data URL
      fileUrl = await this.readFileAsDataURL(file);
    }

    const newItem: MediaItem = {
      id: 'm-' + Math.random().toString(36).substring(2, 9),
      name: file.name,
      url: fileUrl,
      type,
      folderId,
      size: file.size,
      created_at: new Date().toISOString()
    };

    if (this.useSupabaseDb) {
      try {
        const { data, error } = await supabase
          .from('media_items')
          .insert(newItem)
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.error('Supabase createItem error:', e);
      }
    }

    const items = await this.getItems();
    items.unshift(newItem);
    localStorage.setItem('hds_media_items', JSON.stringify(items));
    return newItem;
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  async renameFile(id: string, name: string): Promise<boolean> {
    if (this.useSupabaseDb) {
      try {
        const { error } = await supabase
          .from('media_items')
          .update({ name })
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase renameFile error:', e);
      }
    }

    const items = await this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.name = name;
      localStorage.setItem('hds_media_items', JSON.stringify(items));
      return true;
    }
    return false;
  }

  async deleteFile(id: string): Promise<boolean> {
    // Attempt Supabase storage file deletion if we can figure out the path
    if (this.useSupabaseDb) {
      try {
        const { data: item } = await supabase
          .from('media_items')
          .select('*')
          .eq('id', id)
          .single();

        if (item && isSupabaseConfigured) {
          // Extract path from public URL
          const urlStr = item.url;
          if (urlStr.includes('/storage/v1/object/public/')) {
            const parts = urlStr.split('/storage/v1/object/public/');
            if (parts.length > 1) {
              const pathParts = parts[1].split('/');
              const bucket = pathParts[0];
              const path = pathParts.slice(1).join('/');
              await supabase.storage.from(bucket).remove([path]);
            }
          }
        }

        const { error } = await supabase
          .from('media_items')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase deleteFile error:', e);
      }
    }

    const items = await this.getItems();
    const filteredItems = items.filter(i => i.id !== id);
    localStorage.setItem('hds_media_items', JSON.stringify(filteredItems));
    return true;
  }

  // Moves file into a specific folder
  async moveFile(itemId: string, folderId: string | null): Promise<boolean> {
    if (this.useSupabaseDb) {
      try {
        const { error } = await supabase
          .from('media_items')
          .update({ folderId })
          .eq('id', itemId);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase moveFile error:', e);
      }
    }

    const items = await this.getItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.folderId = folderId;
      localStorage.setItem('hds_media_items', JSON.stringify(items));
      return true;
    }
    return false;
  }
}

export const mediaService = new MediaService();
