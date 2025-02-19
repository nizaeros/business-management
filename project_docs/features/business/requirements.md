# Business Management Feature

## Overview
Implementation of a comprehensive business management system that supports multiple locations and hierarchical business relationships. The system will provide a modern, responsive interface for managing business entities with advanced search and filtering capabilities.

## Database Schema Extensions

```sql
-- Extend existing businesses table
ALTER TABLE public.businesses
ADD COLUMN parent_business_id uuid REFERENCES public.businesses(id),
ADD COLUMN business_type text CHECK (business_type IN ('headquarters', 'branch', 'franchise')),
ADD COLUMN status text CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active';

-- Create business locations table
CREATE TABLE public.business_locations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid REFERENCES public.businesses(id),
    name text NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    postal_code text,
    phone text,
    email text,
    is_primary boolean DEFAULT false,
    coordinates point,
    operating_hours jsonb,
    status text CHECK (status IN ('active', 'inactive', 'temporarily_closed')) DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users,
    UNIQUE(business_id, is_primary) WHERE is_primary = true
);

-- Create business contacts table
CREATE TABLE public.business_contacts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid REFERENCES public.businesses(id),
    location_id uuid REFERENCES public.business_locations(id),
    name text NOT NULL,
    designation text,
    phone text,
    email text,
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users
);
```

## Required Components

### 1. Pages
```typescript
// Business Management Pages
/app/(internal)/businesses/
/app/(internal)/businesses/create
/app/(internal)/businesses/[id]/edit
/app/(internal)/businesses/[id]/locations
/app/(internal)/businesses/[id]/contacts
```

### 2. Components
```typescript
// Business List and Search
components/business/BusinessTable
components/business/BusinessCard
components/business/BusinessSearch
components/business/BusinessFilters

// Business Forms
components/business/BusinessForm
components/business/LocationForm
components/business/ContactForm

// Business Details
components/business/LocationList
components/business/ContactList
components/business/BusinessHierarchy
```

### 3. API Routes
```typescript
// Business Management
/api/businesses
/api/businesses/[id]
/api/businesses/search
/api/businesses/[id]/locations
/api/businesses/[id]/contacts
```

## Feature Requirements

### 1. Business Listing
- Modern card-based UI showing:
  - Business logo
  - Business name
  - Primary location
  - Number of branches
  - Status indicator
- List/Grid view toggle
- Infinite scroll with server-side pagination
- Quick action buttons (Edit, View Locations, Manage Contacts)

### 2. Search and Filters
- Full-text search across business names and locations
- Filters for:
  - Business type (headquarters, branch, franchise)
  - Status (active, inactive, suspended)
  - Location (city, state, country)
  - Parent business
- Save filter preferences per user

### 3. Business Creation/Edit
- Multi-step form with:
  1. Basic Information
     - Business name
     - Business code
     - Business type
     - Parent business (optional)
     - Logo upload
  2. Primary Location
     - Address details
     - Contact information
     - Operating hours
  3. Additional Contacts
     - Contact person details
     - Role/designation
     - Contact information

### 4. Location Management
- Add multiple locations
- Set primary location
- Map integration for address selection
- Operating hours with timezone support
- Status management for each location

### 5. Business Hierarchy
- Visual representation of business relationships
- Easy navigation between parent/child businesses
- Bulk operations on child businesses

## Implementation Phases

### Phase 1: Core Business Management
- [ ] Database schema updates
- [ ] Basic CRUD operations
- [ ] Business listing page
- [ ] Create/Edit forms

### Phase 2: Location Management
- [ ] Location CRUD operations
- [ ] Map integration
- [ ] Operating hours management
- [ ] Primary location handling

### Phase 3: Search and Hierarchy
- [ ] Advanced search implementation
- [ ] Filter system
- [ ] Business hierarchy visualization
- [ ] Parent/Child business management

### Phase 4: UI/UX Enhancements
- [ ] Card/List view toggle
- [ ] Infinite scroll
- [ ] Responsive design
- [ ] Performance optimizations

## Testing Strategy

### 1. Unit Tests
- Form validations
- API route handlers
- Utility functions
- Component rendering

### 2. Integration Tests
- CRUD operations
- Search functionality
- Filter system
- Location management

### 3. E2E Tests
- Business creation flow
- Location addition flow
- Search and filter scenarios
- Business hierarchy navigation

## Performance Considerations

1. Implement efficient pagination for business listing
2. Optimize image loading for logos
3. Use proper indexing for search fields
4. Cache frequently accessed data
5. Lazy load components and features
6. Implement proper error boundaries

## Security Measures

1. Role-based access control
2. Input validation and sanitization
3. File upload restrictions
4. API rate limiting
5. Audit logging for critical operations

## Success Metrics

1. Average time to create/edit a business
2. Search response time
3. System usage analytics
4. User satisfaction surveys
5. Error rate monitoring
