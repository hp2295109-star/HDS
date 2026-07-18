-- ====================================================================
-- SUPABASE DATABASE INITIALIZATION SCHEMA
-- Project: High-Conversion Digital Studio (HDS) Showcase & CRM
-- Author: Google AI Studio Agent
-- Target Platform: Supabase (PostgreSQL)
-- ====================================================================

-- Enable UUID extension (standard for Supabase UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. TABLE: portfolio_projects
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT,
    demo_url TEXT,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Additional fields to support frontend customization controls
    hidden BOOLEAN DEFAULT FALSE NOT NULL,
    tagline TEXT,
    features TEXT[] DEFAULT '{}'::text[] NOT NULL,
    icon TEXT DEFAULT '🚀'::text NOT NULL
);

-- ====================================================================
-- 2. TABLE: leads
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    budget TEXT NOT NULL,
    message TEXT NOT NULL,
    source_page TEXT,
    status TEXT DEFAULT 'New'::text NOT NULL,
    notes TEXT DEFAULT ''::text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Additional telemetry fields used by the CRM backend
    ip_address TEXT DEFAULT 'client-side-submission'::text,
    device TEXT,
    city TEXT
);

-- ====================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 4. RLS POLICIES FOR: portfolio_projects
-- ====================================================================

-- Policy A: Allow anyone (Public/Anonymous & Authenticated) to Read/Select projects
-- This ensures visitors can view the showcase on the homepage & portfolio views.
CREATE POLICY "Allow public read access to portfolio_projects"
ON public.portfolio_projects
FOR SELECT
TO public
USING (true);

-- Policy B: Allow Authenticated Admin users full control (Insert, Update, Delete)
CREATE POLICY "Allow authenticated admin full access to portfolio_projects"
ON public.portfolio_projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ====================================================================
-- 5. RLS POLICIES FOR: leads
-- ====================================================================

-- Policy A: Allow anyone (Public/Anonymous) to insert leads
-- This is critical so prospective clients can submit forms from the website.
CREATE POLICY "Allow public inserts of leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Policy B: Allow Authenticated Admin users full read/write access to leads
-- This ensures the admin CRM dashboard can fetch, edit notes, update status, or delete leads.
CREATE POLICY "Allow authenticated admin full access to leads"
ON public.leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- ====================================================================
-- 6. REUSABLE DATABASE FUNCTIONS
-- ====================================================================

-- Function 1: Get lead statistics summary
-- Returns a quick aggregate JSON of lead counts by status, helpful for the CRM dashboard.
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

-- Function 2: Automated trigger to update updated_at timestamp columns if added
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comment definitions for documentation
COMMENT ON TABLE public.portfolio_projects IS 'Showcase projects crafted by High-Conversion Digital Studio.';
COMMENT ON TABLE public.leads IS 'Form submissions and prospective client inquiries collected across the digital funnel.';
COMMENT ON FUNCTION public.get_lead_stats() IS 'Aggregates status metrics across all leads in the database for secure CRM metrics retrieval.';
