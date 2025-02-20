-- Drop existing policies
drop policy if exists "Admin and internal users full access to business_locations" on public.business_locations;
drop policy if exists "External users can view associated business locations" on public.business_locations;

-- Create policy for admin and internal users to have full access
create policy "Admin and internal users full access to business_locations"
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

-- Create policy for external users to view locations of their associated businesses
create policy "External users can view associated business locations"
    on public.business_locations
    as permissive
    for select
    to authenticated
    using (
        exists (
            select 1 from public.business_users bu
            join public.users u on u.id = bu.user_id
            where bu.business_id = business_locations.business_id
            and bu.user_id = auth.uid()
            and u.user_type = 'external'
        )
    );
