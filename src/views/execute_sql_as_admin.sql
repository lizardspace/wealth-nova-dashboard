create or replace function execute_sql_as_admin(sql text)
returns void as $$
begin
  execute sql;
end;
$$ language plpgsql security definer;
