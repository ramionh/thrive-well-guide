-- Create a function to insert test messages with proper permissions
CREATE OR REPLACE FUNCTION public.insert_test_imessage(
  to_phone TEXT,
  from_phone TEXT, 
  message_text TEXT,
  direction TEXT DEFAULT 'Incoming'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.imessage ("ToPhone", "FromPhone", "Message", "IncomingOutgoing", "ReceivedDateTime") 
  VALUES (to_phone, from_phone, message_text, direction, NOW())
  RETURNING "iMessageID" INTO new_id;
  
  RETURN new_id;
END;
$$;