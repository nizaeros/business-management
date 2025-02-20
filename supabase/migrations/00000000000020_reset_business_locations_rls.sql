-- Disable RLS
alter table public.business_locations disable row level security;

-- Drop all existing policies
drop policy if exists "Admin and internal users full access to business_locations" on public.business_locations;
drop policy if exists "External users can view associated business locations" on public.business_locations;
drop policy if exists "Users can manage their business locations" on public.business_locations;
drop policy if exists "Enable all access to business_locations" on public.business_locations;

-- Re-enable RLS
alter table public.business_locations enable row level security;

-- Create a single, simple policy for testing
create policy "Enable all access to business_locations"
    on public.business_locations
    for all
    using (true)
    with check (true);
