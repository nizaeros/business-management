-- Drop existing policies
drop policy if exists "Admin and internal users full access to businesses" on public.businesses;
drop policy if exists "External users can view associated businesses" on public.businesses;
drop policy if exists "Admin and internal users full access to business_users" on public.business_users;
drop policy if exists "External users can view their own business associations" on public.business_users;
drop policy if exists "Admin and internal users full access to clients" on public.clients;
drop policy if exists "External users can view and update their associated clients" on public.clients;
drop policy if exists "External users can update their associated clients" on public.clients;
drop policy if exists "Admin and internal users full access to client_users" on public.client_users;
drop policy if exists "External users can view their own client associations" on public.client_users;

-- Businesses table policies (only for admin and internal users)
create policy "Admin and internal users full access to businesses"
    on public.businesses for all
    using (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    );

-- Business users table policies (only for admin and internal users)
create policy "Admin and internal users full access to business_users"
    on public.business_users for all
    using (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    );

create policy "Internal users can view their own business associations"
    on public.business_users for select
    using (
        user_id = auth.uid() and 
        exists (
            select 1 from public.users
            where id = auth.uid()
            and user_type = 'internal'
        )
    );

-- Clients table policies
create policy "Admin and internal users full access to clients"
    on public.clients for all
    using (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    );

create policy "External users can view their associated clients"
    on public.clients for select
    using (
        exists (
            select 1 from public.client_users cu
            join public.users u on u.id = cu.user_id
            where cu.client_id = clients.id
            and cu.user_id = auth.uid()
            and u.user_type = 'external'
        )
    );

-- Client users table policies
create policy "Admin and internal users full access to client_users"
    on public.client_users for all
    using (
        auth.jwt() ->> 'user_type' in ('admin', 'internal')
    );

create policy "External users can view their own client associations"
    on public.client_users for select
    using (
        user_id = auth.uid() and
        exists (
            select 1 from public.users
            where id = auth.uid()
            and user_type = 'external'
        )
    );
