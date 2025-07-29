-- Create a function to assign admin role to specific email addresses
CREATE OR REPLACE FUNCTION public.handle_admin_user_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email should have admin role
  IF NEW.email = 'rhampton@genxshred.com' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Remove the default client role if it exists
    DELETE FROM public.user_roles 
    WHERE user_id = NEW.id AND role = 'client'::app_role;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to assign admin role to specific users after they're created
CREATE TRIGGER on_auth_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_user_assignment();

-- If the user already exists, update their role to admin
DO $$
BEGIN
  -- Check if user exists and update their role
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'rhampton@genxshred.com') THEN
    -- Get the user ID
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role 
    FROM auth.users 
    WHERE email = 'rhampton@genxshred.com'
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Remove client role if it exists
    DELETE FROM public.user_roles 
    WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'rhampton@genxshred.com') 
    AND role = 'client'::app_role;
  END IF;
END $$;