
-- Update the trigger function to call your specific n8n webhook
CREATE OR REPLACE FUNCTION public.notify_n8n_on_imessage_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if net schema exists before trying to use it
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'net') THEN
    PERFORM net.http_post(
      url     := 'https://rippedatanyage.app.n8n.cloud/webhook-test/70e8965e-b966-4fbe-8479-b87d40f05e25',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body    := jsonb_build_object(
        'table',     TG_TABLE_NAME,
        'operation', TG_OP,
        'record',    row_to_json(NEW)
      )
    );
  ELSE
    -- Log that the webhook couldn't be sent
    RAISE NOTICE 'Net schema not available, skipping webhook for table: %', TG_TABLE_NAME;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on the imessage table if it doesn't exist
DROP TRIGGER IF EXISTS imessage_insert_webhook ON public.imessage;
CREATE TRIGGER imessage_insert_webhook
  AFTER INSERT ON public.imessage
  FOR EACH ROW EXECUTE FUNCTION notify_n8n_on_imessage_insert();
