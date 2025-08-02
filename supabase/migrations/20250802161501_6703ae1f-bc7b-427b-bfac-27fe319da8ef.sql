-- Fix RLS issues for tables that don't have RLS enabled
-- Enable RLS on missing tables

-- Check if these tables exist and enable RLS if they do
DO $$
BEGIN
  -- Enable RLS on contact_submissions if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions' AND table_schema = 'public') THEN
    ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
    
    -- Add basic policy for contact submissions (public access for inserts only)
    DROP POLICY IF EXISTS "Allow public contact submissions" ON public.contact_submissions;
    CREATE POLICY "Allow public contact submissions" 
    ON public.contact_submissions 
    FOR INSERT 
    WITH CHECK (true);
  END IF;

  -- Enable RLS on marketing_subscribers if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'marketing_subscribers' AND table_schema = 'public') THEN
    ALTER TABLE public.marketing_subscribers ENABLE ROW LEVEL SECURITY;
    
    -- Add basic policy for marketing subscribers (public access for inserts only)
    DROP POLICY IF EXISTS "Allow public marketing subscriptions" ON public.marketing_subscribers;
    CREATE POLICY "Allow public marketing subscriptions" 
    ON public.marketing_subscribers 
    FOR INSERT 
    WITH CHECK (true);
  END IF;

  -- Enable RLS on imessage if it exists (this appears to be a system table)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'imessage' AND table_schema = 'public') THEN
    ALTER TABLE public.imessage ENABLE ROW LEVEL SECURITY;
    
    -- No policies for imessage - it appears to be a system table that shouldn't be accessible via API
  END IF;

  -- Enable RLS on documents if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents' AND table_schema = 'public') THEN
    ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
    
    -- Add admin-only access policy for documents
    DROP POLICY IF EXISTS "Admin only access to documents" ON public.documents;
    CREATE POLICY "Admin only access to documents" 
    ON public.documents 
    FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;