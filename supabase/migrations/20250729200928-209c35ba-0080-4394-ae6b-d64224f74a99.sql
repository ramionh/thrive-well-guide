-- Temporarily disable RLS on user_roles to break the recursion
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin users can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create very simple policies that absolutely cannot cause recursion
-- Allow users to see their own roles
CREATE POLICY "user_can_view_own_role" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow anyone to insert (this will be controlled by edge functions)
CREATE POLICY "allow_insert_roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (true);

-- Allow updates and deletes only by the same user or service role
CREATE POLICY "user_can_manage_own_role" 
ON public.user_roles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "user_can_delete_own_role" 
ON public.user_roles 
FOR DELETE 
USING (user_id = auth.uid());