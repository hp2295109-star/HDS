-- ====================================================================
-- HARSH DIGITAL STUDIOS (HDS) CRM - SUPABASE SCHEMA SQL
-- ====================================================================
-- Copy and run this script in the Supabase SQL Editor to initialize
-- your CRM tables with row-level security (RLS) configured.
-- ====================================================================

-- 1. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_name TEXT,
    service TEXT,
    budget TEXT,
    message TEXT,
    status TEXT DEFAULT 'New'::text,
    source TEXT,
    ip_address TEXT,
    device TEXT,
    city TEXT DEFAULT 'Raigarh'::text,
    notes TEXT DEFAULT ''::text
);

-- Enable Row Level Security (RLS) for Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public users (visitors) to insert new leads from the website
CREATE POLICY "Allow public insert for leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can read, update, or delete lead records
CREATE POLICY "Allow authenticated admins select on leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins update on leads" 
ON public.leads 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins delete on leads" 
ON public.leads 
FOR DELETE 
TO authenticated 
USING (true);


-- 2. WEBSITE AUDIT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.website_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    website TEXT NOT NULL,
    business_name TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'New'::text
);

-- Enable RLS for website audits
ALTER TABLE public.website_audit ENABLE ROW LEVEL SECURITY;

-- Allow public users to request an audit
CREATE POLICY "Allow public insert for audits" 
ON public.website_audit 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can manage audit queue
CREATE POLICY "Allow authenticated admins select on audits" 
ON public.website_audit 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins update on audits" 
ON public.website_audit 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins delete on audits" 
ON public.website_audit 
FOR DELETE 
TO authenticated 
USING (true);


-- 3. CONTACT FORM MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    email TEXT NOT NULL,
    business_type TEXT,
    subject TEXT DEFAULT 'General Enquiry'::text,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New'::text,
    source TEXT
);

-- Enable RLS for contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public users to send message
CREATE POLICY "Allow public insert for contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can manage contact messages
CREATE POLICY "Allow authenticated admins select on contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins update on contact messages" 
ON public.contact_messages 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins delete on contact messages" 
ON public.contact_messages 
FOR DELETE 
TO authenticated 
USING (true);


-- 4. BOOKED STRATEGY CALLS TABLE
CREATE TABLE IF NOT EXISTS public.booked_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    meeting_date TEXT NOT NULL,
    meeting_time TEXT NOT NULL,
    service TEXT NOT NULL,
    notes TEXT DEFAULT ''::text
);

-- Enable RLS for booked calls
ALTER TABLE public.booked_calls ENABLE ROW LEVEL SECURITY;

-- Allow public users to book calls
CREATE POLICY "Allow public insert for booked calls" 
ON public.booked_calls 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can manage booked calls
CREATE POLICY "Allow authenticated admins select on booked calls" 
ON public.booked_calls 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins update on booked calls" 
ON public.booked_calls 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins delete on booked calls" 
ON public.booked_calls 
FOR DELETE 
TO authenticated 
USING (true);


-- 5. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Enable RLS for newsletter
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Allow public users to subscribe
CREATE POLICY "Allow public insert for newsletter" 
ON public.newsletter 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can view newsletter list
CREATE POLICY "Allow authenticated admins select on newsletter" 
ON public.newsletter 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated admins delete on newsletter" 
ON public.newsletter 
FOR DELETE 
TO authenticated 
USING (true);
