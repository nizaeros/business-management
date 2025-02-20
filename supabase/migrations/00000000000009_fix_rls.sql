-- Drop all existing policies
drop policy if exists "Temporary full access to business_locations" on public.business_locations;
drop policy if exists "Admin and internal users full access to business_locations" on public.business_locations;
drop policy if exists "External users can view associated business locations" on public.business_locations;

-- First ensure RLS is enabled
alter table public.business_locations enable row level security;

-- Create a single policy for now that allows all authenticated users full access
create policy "Temporary full access to business_locations"
    on public.business_locations
    as permissive
    for all
    to authenticated
    using (true)
    with check (true);

-- View current policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
from pg_policies 
where schemaname = 'public' and tablename = 'business_locations';
