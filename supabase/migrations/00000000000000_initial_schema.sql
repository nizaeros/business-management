-- Create extension for UUID generation
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
    id uuid references auth.users primary key,
    full_name text,
    avatar_url text,
    phone_number text,
    user_type text check (user_type in ('admin', 'internal', 'external')),
    is_active boolean default true,
    created_at timestamptz default now(),
    created_by uuid references auth.users,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users
);

-- Businesses table
create table public.businesses (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    registered_name text,
    business_code text unique not null,
    logo_url text,
    city text,
    state text,
    country text,
    address_line1 text,
    address_line2 text,
    slug text unique not null,
    created_at timestamptz default now(),
    created_by uuid references auth.users,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users
);

-- Business users table
create table public.business_users (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id),
    user_id uuid references public.users(id),
    role text not null,
    is_active boolean default true,
    created_at timestamptz default now(),
    created_by uuid references auth.users,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users,
    unique(business_id, user_id)
);

-- Clients table
create table public.clients (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    registered_name text,
    short_code text unique not null,
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    country text,
    pin_code text,
    gstin text,
    industry_id uuid,
    entity_type_id uuid,
    parent_organization_id uuid references public.clients(id),
    logo_url text,
    is_active boolean default true,
    slug text unique not null,
    created_at timestamptz default now(),
    created_by uuid references auth.users,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users
);

-- Client users table
create table public.client_users (
    id uuid primary key default uuid_generate_v4(),
    client_id uuid references public.clients(id),
    user_id uuid references public.users(id),
    is_active boolean default true,
    created_at timestamptz default now(),
    created_by uuid references auth.users,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users,
    unique(client_id, user_id)
);

-- Row Level Security (RLS) Policies

-- Users table policies
alter table public.users enable row level security;

create policy "Users can view their own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Only admins can insert users"
    on public.users for insert
    with check (auth.jwt() ->> 'user_type' = 'admin');

create policy "Only admins can update users"
    on public.users for update
    using (auth.jwt() ->> 'user_type' = 'admin');

-- Business users policies
alter table public.business_users enable row level security;

create policy "Users can view their own business associations"
    on public.business_users for select
    using (auth.uid() = user_id);

create policy "Only admins can manage business users"
    on public.business_users for all
    using (auth.jwt() ->> 'user_type' = 'admin');

-- Client users policies
alter table public.client_users enable row level security;

create policy "Users can view their own client associations"
    on public.client_users for select
    using (auth.uid() = user_id);

create policy "Only admins can manage client users"
    on public.client_users for all
    using (auth.jwt() ->> 'user_type' = 'admin');
