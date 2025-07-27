CREATE OR REPLACE VIEW all_contacts AS
SELECT
  id,
  name,
  email,
  message,
  created_at,
  is_processed
FROM
  public.contacts;
