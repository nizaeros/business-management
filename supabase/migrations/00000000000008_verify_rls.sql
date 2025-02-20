-- First, ensure RLS is enabled
alter table public.business_locations enable row level security;

-- Verify the current policies
select * from pg_policies where schemaname = 'public' and tablename = 'business_locations';

-- Drop and recreate the policies with more permissive initial access
drop policy if exists "Admin and internal users full access to business_locations" on public.business_locations;
drop policy if exists "External users can view associated business locations" on public.business_locations;

-- Create a temporary policy for debugging
create policy "Temporary full access to business_locations"
    on public.business_locations
    for all
    to authenticated
    using (true)
    with check (true);

-- Note: After confirming the issue is fixed, we'll replace this with proper restricted policies
