-- ====================================================================
-- HARSH DIGITAL STUDIOS (HDS) CRM & CMS - SUPABASE UNIFIED SCHEMA SQL
-- Project: High-Conversion Digital Studio (HDS) Showcase & CRM
-- Target Platform: Supabase (PostgreSQL)
-- Security Standard: Row Level Security (RLS) Enabled on All Tables
-- ====================================================================

-- Enable UUID extension (standard for Supabase UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. TABLE: leads (Inquiries from the core landing page funnels)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_name TEXT,
    service TEXT,
    budget TEXT,
    message TEXT,
    status TEXT DEFAULT 'New'::text NOT NULL,
    source TEXT,
    source_page TEXT,
    ip_address TEXT DEFAULT 'client-side-submission'::text,
    device TEXT,
    city TEXT DEFAULT 'Raigarh'::text,
    notes TEXT DEFAULT ''::text
);

-- ====================================================================
-- 2. TABLE: website_audit (Free SEO & conversion rate audits queue)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.website_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    website TEXT NOT NULL,
    business_name TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'New'::text NOT NULL
);

-- ====================================================================
-- 3. TABLE: contact_messages (Direct messages from the Contact Us page)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    email TEXT NOT NULL,
    business_type TEXT,
    subject TEXT DEFAULT 'General Enquiry'::text,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New'::text NOT NULL,
    source TEXT
);

-- ====================================================================
-- 4. TABLE: booked_calls (Schedules and strategy bookings)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.booked_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    meeting_date TEXT NOT NULL,
    meeting_time TEXT NOT NULL,
    service TEXT NOT NULL,
    notes TEXT DEFAULT ''::text
);

-- ====================================================================
-- 5. TABLE: newsletter (Subscribers for growth updates)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- ====================================================================
-- 6. TABLE: portfolio_projects (Showcase items managed by CMS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT,
    demo_url TEXT,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INTEGER DEFAULT 1 NOT NULL,
    hidden BOOLEAN DEFAULT FALSE NOT NULL,
    tagline TEXT,
    features TEXT[] DEFAULT '{}'::text[] NOT NULL,
    icon TEXT DEFAULT '🚀'::text NOT NULL
);

-- ====================================================================
-- 7. TABLE: testimonials (Client reviews and satisfaction scores)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    image TEXT,
    review TEXT NOT NULL,
    rating INTEGER DEFAULT 5 NOT NULL,
    published BOOLEAN DEFAULT TRUE NOT NULL
);

-- ====================================================================
-- 8. TABLE: blog_posts (Dynamic conversion guides & market reports)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    thumbnail TEXT,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    publish_date DATE,
    tags TEXT DEFAULT ''::text,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    author TEXT DEFAULT 'Harsh Patel'::text NOT NULL,
    reading_time TEXT DEFAULT '5 min read'::text NOT NULL,
    is_draft BOOLEAN DEFAULT FALSE NOT NULL
);

-- ====================================================================
-- 9. TABLE: website_cms (Custom live content-overrides key-value JSON)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.website_cms (
    id VARCHAR(50) PRIMARY KEY, -- 'published' or 'draft'
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on every table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booked_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_cms ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC INSERTS (Allow anonymous visitors to submit forms)
CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for audits" ON public.website_audit FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for booked calls" ON public.booked_calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for newsletter" ON public.newsletter FOR INSERT WITH CHECK (true);

-- 2. PUBLIC SELECTS (Allow visitors to view frontend display components)
CREATE POLICY "Allow public read access to portfolio_projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to website_cms" ON public.website_cms FOR SELECT USING (true);

-- 3. ADMIN READ/WRITE ACCESS (Full control given only to authenticated administrators)
CREATE POLICY "Admin full control on leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on audits" ON public.website_audit FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on contact messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on booked calls" ON public.booked_calls FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on newsletter" ON public.newsletter FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on portfolio_projects" ON public.portfolio_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full control on website_cms" ON public.website_cms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- PERFORMANCE TUNING: INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_website_audit_status ON public.website_audit(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_booked_calls_date ON public.booked_calls(meeting_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON public.portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_order ON public.portfolio_projects(display_order);

-- ====================================================================
-- HELPERS & TRIGGERS
-- ====================================================================

-- Function: Aggregates lead status counts dynamically for the Admin CRM metrics
CREATE OR REPLACE FUNCTION public.get_lead_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_leads', COUNT(*),
        'new_leads', COUNT(*) FILTER (WHERE status = 'New'),
        'contacted_leads', COUNT(*) FILTER (WHERE status = 'Contacted'),
        'in_progress_leads', COUNT(*) FILTER (WHERE status = 'In Progress'),
        'converted_leads', COUNT(*) FILTER (WHERE status = 'Converted'),
        'closed_leads', COUNT(*) FILTER (WHERE status = 'Closed')
    ) INTO result
    FROM public.leads;
    
    RETURN result;
END;
$$;

-- Function: Standard trigger to auto-update updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for website_cms updated_at column
DROP TRIGGER IF EXISTS trigger_update_cms_timestamp ON public.website_cms;
CREATE TRIGGER trigger_update_cms_timestamp
    BEFORE UPDATE ON public.website_cms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comment definitions for security auditing
COMMENT ON TABLE public.leads IS 'Lead submissions from main marketing and consultation landing funnels.';
COMMENT ON TABLE public.website_audit IS 'Audit queues collected via the Free Website Audit modal.';
COMMENT ON TABLE public.contact_messages IS 'Conversations routed from the public Contact page form.';
COMMENT ON TABLE public.booked_calls IS 'Strategic call calendar items secured from scheduling hooks.';
COMMENT ON TABLE public.newsletter IS 'Subscriber emails registered for updates and SEO reports.';
COMMENT ON TABLE public.portfolio_projects IS 'Showcase demo details managed dynamically via CMS.';
COMMENT ON TABLE public.testimonials IS 'Real client reviews curated to build trust and authority.';
COMMENT ON TABLE public.blog_posts IS 'Informative content, local SEO insights, and marketing articles.';
COMMENT ON TABLE public.website_cms IS 'Editable system-wide copy and layouts for the live design engine.';
