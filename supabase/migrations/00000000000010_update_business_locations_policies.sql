-- Drop all existing policies for business_locations
drop policy if exists "Temporary full access to business_locations" on public.business_locations;
drop policy if exists "Enable insert for authenticated users" on public.business_locations;
drop policy if exists "Enable read access for authenticated users" on public.business_locations;
drop policy if exists "Enable update for business owners" on public.business_locations;

-- Create new policies based on user type
create policy "Admin and internal users full access"
    on public.business_locations
    as permissive
    for all
    to authenticated
    using (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    )
    with check (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    );

-- Allow all authenticated users to read locations
create policy "Allow read access for authenticated users"
    on public.business_locations
    as permissive
    for select
    to authenticated
    using (true);

-- Allow business owners and admins to update their locations
create policy "Allow update for business owners and admins"
    on public.business_locations
    as permissive
    for update
    to authenticated
    using (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
        or
        auth.uid() = created_by
    )
    with check (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
        or
        auth.uid() = created_by
    );

-- Allow internal users to create locations
create policy "Allow internal users to create locations"
    on public.business_locations
    as permissive
    for insert
    to authenticated
    with check (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    );
