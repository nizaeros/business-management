-- Drop all existing policies
drop policy if exists "Admin and internal users full access to business_locations" on public.business_locations;
drop policy if exists "External users can view associated business locations" on public.business_locations;
drop policy if exists "Users can manage their business locations" on public.business_locations;

-- Create a comprehensive policy for admin and internal users
create policy "Admin and internal users full access to business_locations"
    on public.business_locations
    for all
    using (
        -- Check if user is admin or internal
        (auth.jwt() ->> 'user_type' in ('admin', 'internal'))
        -- Also allow access if user is associated with the business
        or exists (
            select 1 
            from public.business_users bu
            where bu.business_id = business_locations.business_id
            and bu.user_id = auth.uid()
        )
    )
    with check (
        -- Check if user is admin or internal
        (auth.jwt() ->> 'user_type' in ('admin', 'internal'))
        -- Also allow access if user is associated with the business
        or exists (
            select 1 
            from public.business_users bu
            where bu.business_id = business_locations.business_id
            and bu.user_id = auth.uid()
        )
    );

-- Create policy for external users to view and manage their business locations
create policy "External users can manage their business locations"
    on public.business_locations
    for all
    using (
        exists (
            select 1 
            from public.business_users bu
            join public.users u on u.id = bu.user_id
            where bu.business_id = business_locations.business_id
            and bu.user_id = auth.uid()
            and u.user_type = 'external'
        )
    )
    with check (
        exists (
            select 1 
            from public.business_users bu
            join public.users u on u.id = bu.user_id
            where bu.business_id = business_locations.business_id
            and bu.user_id = auth.uid()
            and u.user_type = 'external'
        )
    );
