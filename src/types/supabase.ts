export interface Lead {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  service: string;
  budget: string;
  message: string;
  status?: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';
  source?: string;
  ip_address?: string;
  device?: string;
  city?: string;
  notes?: string;
}

export interface ContactMessage {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: 'New' | 'Read' | 'Replied';
}

export interface Newsletter {
  id?: string;
  created_at?: string;
  email: string;
}

export interface WebsiteAudit {
  id?: string;
  created_at?: string;
  website: string;
  business_name: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  status?: 'New' | 'Audited' | 'Contacted';
}

export interface BookedCall {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  meeting_date: string;
  meeting_time: string;
  service: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  image: string;
  review: string;
  rating: number;
  published: boolean;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  created_at?: string;
  publish_date?: string;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  author?: string;
  reading_time?: string;
  is_draft?: boolean;
}

export interface PortfolioProject {
  id?: string;
  created_at?: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  url: string;
  featured: boolean;
  hidden: boolean;
  display_order: number;
  features?: string[];
  tagline?: string;
  icon?: string;
}

