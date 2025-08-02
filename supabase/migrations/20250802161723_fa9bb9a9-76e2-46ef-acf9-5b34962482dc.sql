-- Fix RLS issues for tables that don't have RLS enabled
-- Enable RLS on missing tables (excluding views)

DO $$
BEGIN
  -- Enable RLS on contact_submissions if it exists and is a table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'contact_submissions' 
    AND table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  ) THEN
    ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
    
    -- Add basic policy for contact submissions (public access for inserts only)
    DROP POLICY IF EXISTS "Allow public contact submissions" ON public.contact_submissions;
    CREATE POLICY "Allow public contact submissions" 
    ON public.contact_submissions 
    FOR INSERT 
    WITH CHECK (true);
  END IF;

  -- Enable RLS on imessage if it exists and is a table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'imessage' 
    AND table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  ) THEN
    ALTER TABLE public.imessage ENABLE ROW LEVEL SECURITY;
    
    -- Admin-only access policy for imessage
    DROP POLICY IF EXISTS "Admin only access to imessage" ON public.imessage;
    CREATE POLICY "Admin only access to imessage" 
    ON public.imessage 
    FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    );
  END IF;

  -- Enable RLS on documents if it exists and is a table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'documents' 
    AND table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  ) THEN
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