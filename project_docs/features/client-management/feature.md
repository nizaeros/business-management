# Client Management Feature

## Overview
Comprehensive client management system allowing businesses to manage their clients, including multiple locations, hierarchical relationships, service agreements, and various business details.

## Requirements

### Functional Requirements

1. Client Basic Management
   - Create new clients with basic information
   - Edit existing client details
   - Upload and manage client logos
   - Assign industry categories
   - Set client status (active/inactive)

2. Location Management
   - Add multiple locations per client
   - Designate primary location
   - Manage address details
   - Track location-specific contacts

3. Client Hierarchy
   - Set parent-child relationships (HQ-Branch)
   - View hierarchical structure
   - Manage relationships between clients

4. Client Details
   - Service agreements
   - Share capital information
   - Directors/shareholders/employees
   - Registrations
   - Email groups (CC/To lists)
   - One-time service status
   - Routine services status

5. Search and Filter
   - Search by name, code, industry
   - Filter by status, type, location
   - Advanced search capabilities

### Non-Functional Requirements
1. Performance
   - Quick search response (< 2s)
   - Efficient image handling
   - Optimized database queries

2. Security
   - Role-based access control
   - Data privacy compliance
   - Audit logging

3. Accessibility
   - WCAG 2.1 compliance
   - Keyboard navigation
   - Screen reader support

## Technical Specification

### Database Schema
```sql
-- Industry Categories
CREATE TABLE industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Table Enhancements
ALTER TABLE clients ADD COLUMN (
    industry_id UUID REFERENCES industries(id),
    logo_url TEXT,
    logo_short_url TEXT,
    parent_client_id UUID REFERENCES clients(id),
    has_parent BOOLEAN DEFAULT false,
    registered_name TEXT,
    registration_number TEXT,
    tax_number TEXT,
    website TEXT,
    status TEXT DEFAULT 'active',
    share_capital DECIMAL,
    incorporation_date DATE,
    fiscal_year_end DATE
);

-- Client Locations
CREATE TABLE client_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT,
    phone TEXT,
    email TEXT,
    is_primary BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Contacts
CREATE TABLE client_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    location_id UUID REFERENCES client_locations(id),
    name TEXT NOT NULL,
    designation TEXT,
    department TEXT,
    phone TEXT,
    email TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Agreements
CREATE TABLE service_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    agreement_type TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    terms JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Groups
CREATE TABLE email_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    name TEXT NOT NULL,
    to_addresses TEXT[],
    cc_addresses TEXT[],
    bcc_addresses TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Component Structure
```
src/
├── components/
│   └── client/
│       ├── ClientList/
│       │   ├── ClientList.tsx
│       │   ├── ClientCard.tsx
│       │   ├── ClientSearch.tsx
│       │   └── ClientFilter.tsx
│       ├── ClientForm/
│       │   ├── ClientForm.tsx
│       │   ├── LogoUpload.tsx
│       │   └── LocationForm.tsx
│       ├── ClientDetails/
│       │   ├── Overview.tsx
│       │   ├── Locations.tsx
│       │   ├── Contacts.tsx
│       │   ├── Services.tsx
│       │   └── EmailGroups.tsx
│       └── shared/
│           ├── IndustrySelect.tsx
│           └── StatusBadge.tsx
└── app/
    └── (internal)/
        └── clients/
            ├── page.tsx
            ├── create/
            │   └── page.tsx
            └── [id]/
                ├── page.tsx
                ├── edit/
                │   └── page.tsx
                ├── locations/
                │   └── page.tsx
                └── services/
                    └── page.tsx
```

### API Endpoints
- `GET /api/clients` - List clients with filters
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `POST /api/clients/:id/logo` - Upload logo
- `GET /api/clients/:id/locations` - List locations
- `POST /api/clients/:id/locations` - Add location
- `GET /api/industries` - List industries

## Implementation Tasks

### Phase 1: Core Client Management
- [ ] Create database migrations
- [ ] Implement basic CRUD operations
- [ ] Create client listing page
- [ ] Implement client form
- [ ] Add logo management

### Phase 2: Location Management
- [ ] Add location management
- [ ] Implement primary location logic
- [ ] Create location forms
- [ ] Add location listing

### Phase 3: Advanced Features
- [ ] Implement client hierarchy
- [ ] Add service agreements
- [ ] Create email groups
- [ ] Add contact management

### Phase 4: Search and Filter
- [ ] Implement search functionality
- [ ] Add filter components
- [ ] Optimize search performance
- [ ] Add advanced filtering

## Testing Strategy

### Unit Tests
- Client form validation
- Location management logic
- Search functionality
- File upload handling

### Integration Tests
- Client CRUD operations
- Location management
- Service agreement workflow
- Email group management

### E2E Tests
- Complete client creation flow
- Location management workflow
- Search and filter operations
- Client hierarchy management

## Security Considerations
- Row Level Security (RLS) policies
- File upload validation
- Input sanitization
- Access control based on user roles

## Performance Considerations
- Lazy loading of client details
- Image optimization
- Search indexing
- Query optimization

## Dependencies
- Supabase for database and file storage
- Next.js 13+ for routing and API
- React Hook Form for forms
- TanStack Query for data fetching
- Tailwind CSS for styling
