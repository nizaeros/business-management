-- Disable RLS on all tables first
alter table public.businesses disable row level security;
alter table public.business_locations disable row level security;
alter table public.business_users disable row level security;
alter table public.users disable row level security;

-- Drop all existing policies
drop policy if exists "Admin and internal users full access to business_locations" on public.business_locations;
drop policy if exists "External users can view associated business locations" on public.business_locations;
drop policy if exists "Users can manage their business locations" on public.business_locations;
drop policy if exists "Enable all access to business_locations" on public.business_locations;

drop policy if exists "Enable all access to businesses" on public.businesses;
drop policy if exists "Admin users full access to businesses" on public.businesses;
drop policy if exists "External users can view their businesses" on public.businesses;

drop policy if exists "Enable all access to business_users" on public.business_users;
drop policy if exists "Admin users full access to business_users" on public.business_users;

drop policy if exists "Enable all access to users" on public.users;
drop policy if exists "Admin users full access to users" on public.users;

-- Re-enable RLS on all tables
alter table public.businesses enable row level security;
alter table public.business_locations enable row level security;
alter table public.business_users enable row level security;
alter table public.users enable row level security;

-- Create simple authenticated-only policies for each table

-- Businesses table
create policy "Authenticated users full access to businesses"
    on public.businesses
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Business Locations table
create policy "Authenticated users full access to business_locations"
    on public.business_locations
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Business Users table
create policy "Authenticated users full access to business_users"
    on public.business_users
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Users table
create policy "Authenticated users full access to users"
    on public.users
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
