-- Create divisions table
create table public.divisions (
    id uuid not null default gen_random_uuid(),
    name text not null,
    short_code text not null,
    manager_id uuid references auth.users(id),
    description text null,
    organization_id uuid not null references public.businesses(id),
    parent_division_id uuid null references public.divisions(id),
    is_active boolean null default true,
    created_at timestamp with time zone null default now(),
    created_by uuid null references auth.users(id),
    updated_at timestamp with time zone null,
    updated_by uuid null references auth.users(id),
    primary key (id),
    unique(short_code, organization_id)
);

-- Enable RLS on divisions
alter table public.divisions enable row level security;

-- Add division policies
create policy "Admin and internal users full access to divisions"
    on public.divisions for all
    using (auth.jwt() ->> 'user_type' in ('admin', 'internal'));

-- Create division_users table for mapping users to divisions
create table public.division_users (
    id uuid primary key default gen_random_uuid(),
    division_id uuid not null references public.divisions(id),
    user_id uuid not null references public.users(id),
    is_active boolean default true,
    created_at timestamptz default now(),
    created_by uuid references auth.users(id),
    updated_at timestamptz,
    updated_by uuid references auth.users(id),
    unique(division_id, user_id)
);

-- Enable RLS on division_users
alter table public.division_users enable row level security;

-- Add division_users policies
create policy "Admin and internal users full access to division_users"
    on public.division_users for all
    using (auth.jwt() ->> 'user_type' in ('admin', 'internal'));

create policy "Users can view their own division associations"
    on public.division_users for select
    using (user_id = auth.uid());

-- Create functions and triggers for enforcing associations

-- Function to check external user associations
create or replace function check_external_user_associations()
returns trigger as $$
begin
    if new.user_type = 'external' then
        if not exists (select 1 from public.client_users where user_id = new.id) then
            raise exception 'External users must be associated with a client';
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Function to check internal user associations
create or replace function check_internal_user_associations()
returns trigger as $$
begin
    if new.user_type = 'internal' then
        if not exists (select 1 from public.business_users where user_id = new.id) then
            raise exception 'Internal users must be associated with a business';
        end if;
        
        if not exists (select 1 from public.division_users where user_id = new.id) then
            raise exception 'Internal users must be associated with a division';
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for external users
create trigger enforce_external_user_associations
    after insert or update on public.users
    for each row
    when (new.user_type = 'external')
    execute function check_external_user_associations();

-- Trigger for internal users
create trigger enforce_internal_user_associations
    after insert or update on public.users
    for each row
    when (new.user_type = 'internal')
    execute function check_internal_user_associations();

-- Function to prevent deletion of required associations
create or replace function prevent_required_association_deletion()
returns trigger as $$
begin
    -- Check if this is the user's last client association (for external users)
    if exists (
        select 1 from public.users 
        where id = old.user_id 
        and user_type = 'external'
        and not exists (
            select 1 from public.client_users 
            where user_id = old.user_id 
            and id != old.id
        )
    ) then
        raise exception 'Cannot remove the last client association from an external user';
    end if;
    
    return old;
end;
$$ language plpgsql security definer;

-- Trigger to prevent deletion of required client associations
create trigger prevent_client_association_deletion
    before delete on public.client_users
    for each row
    execute function prevent_required_association_deletion();

-- Add indexes for better performance
create index idx_divisions_organization on public.divisions(organization_id);
create index idx_division_users_user on public.division_users(user_id);
create index idx_division_users_division on public.division_users(division_id);
create index idx_divisions_parent on public.divisions(parent_division_id);
