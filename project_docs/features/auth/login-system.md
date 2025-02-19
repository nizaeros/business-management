# Login System Feature Plan

## Overview
Implementation of a role-based authentication system using Supabase, supporting multiple user types with different access levels and dashboards.

## Database Schema

### 1. Authentication Tables
```sql
-- Using Supabase auth.users for base authentication
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

create table public.business_users (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id),
    user_id uuid references public.users(id),
    role text not null, -- 'manager', 'staff', etc.
    is_active boolean default true,
    created_at timestamptz default now(),
    created_by uuid references auth.users,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users,
    unique(business_id, user_id)
);

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
```

## Authentication Flow

### 1. User Invitation (Admin Only)
```typescript
interface InviteUserRequest {
    email: string;
    fullName: string;
    userType: 'internal' | 'external';
    businessId?: string; // Required for internal users
    clientId?: string;   // Required for external users
    role?: string;       // Required for internal users
}
```

### 2. User Registration Flow
1. Admin invites user via email
2. User receives invitation email with setup link
3. User sets password (alphanumeric required)
4. System creates necessary records:
   - auth.users (Supabase)
   - public.users
   - business_users or client_users
5. Redirect to appropriate dashboard

### 3. Login Flow
1. User enters email/password
2. System validates credentials
3. Determine user type and access level
4. Redirect to appropriate dashboard:
   - Admin → Admin Dashboard
   - Internal → Internal Dashboard
   - External → Client Dashboard

## Required Components

### 1. Pages
```typescript
// Authentication Pages
/app/(auth)/login
/app/(auth)/set-password
/app/(auth)/forgot-password

// Admin Pages
/app/(internal)/users/invite
/app/(internal)/users/manage

// Dashboards
/app/(internal)/dashboard
/app/(external)/[clientId]/dashboard
```

### 2. Components
```typescript
// Authentication Components
components/auth/LoginForm
components/auth/SetPasswordForm
components/auth/ForgotPasswordForm

// User Management
components/auth/InviteUserForm
components/auth/UserManagementTable
```

### 3. API Routes
```typescript
// Authentication
/api/auth/invite-user
/api/auth/set-password
/api/auth/resend-invitation

// User Management
/api/users/[id]
/api/users/status
```

## Security Measures

1. Role-based access control (RBAC)
2. Input validation and sanitization
3. Password strength requirements
4. Protected API routes
5. Session management

## Implementation Phases

### Phase 1: Basic Authentication
- [x] Database schema setup
- [x] Basic login/logout functionality
- [x] Password setup flow
- [x] Dashboard redirects

### Phase 2: User Management
- [ ] User invitation system
- [ ] User profile management
- [ ] Role management

### Phase 3: Access Control
- [ ] RBAC implementation
- [ ] API route protection
- [ ] Dashboard access control

## Testing Requirements

1. Unit Tests
   - Authentication functions
   - Form validations
   - API routes

2. Integration Tests
   - Login flow
   - Registration flow
   - Dashboard access

3. E2E Tests
   - Complete user journey
   - Role-based access
   - Dashboard functionality
