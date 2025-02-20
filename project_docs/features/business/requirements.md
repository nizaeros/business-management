# Business Management Feature

## Overview
Implementation of a comprehensive business management system that supports multiple locations and hierarchical business relationships. The system provides a modern, AWS/Azure-inspired interface with a compact, professional design optimized for enterprise use.

## Database Schema Extensions

```sql
-- Extend existing businesses table
ALTER TABLE public.businesses
ADD COLUMN parent_business_id uuid REFERENCES public.businesses(id),
ADD COLUMN business_type text CHECK (business_type IN ('global_headquarters', 'regional_headquarters', 'branch', 'franchise')),
ADD COLUMN status text CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
ADD COLUMN has_parent boolean DEFAULT false;

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
/app/(internal)/businesses/[id]/hierarchy
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
components/business/HierarchyTree
```

### 3. API Routes
```typescript
// Business Management
/api/businesses
/api/businesses/[id]
/api/businesses/search
/api/businesses/[id]/locations
/api/businesses/[id]/contacts
/api/businesses/[id]/hierarchy
```

## Feature Requirements

### 1. Business Listing 
- Modern card-based UI showing:
  - Business logo
  - Business name and code
  - Type and status indicators
  - Quick action buttons
- Compact, responsive grid layout
- Enterprise-grade design:
  - White background (#FFFFFF)
  - Subtle interactive elements (bg-gray-50/50)
  - Consistent spacing and typography
  - Smooth animations and transitions

### 2. Search and Filtering 
- Compact search bar with instant results
- Advanced filtering options:
  - Business type
  - Status
  - Location (city, country)
- Filter state indicators
- Responsive design for all screen sizes
- Professional styling:
  - Subtle backgrounds for interactive elements
  - Clear visual hierarchy
  - Consistent input styling
  - Loading states and transitions

### 3. Business Creation/Edit 
- Multi-step form process:
  1. Basic Information
     - Business name and code
     - Type selection (global_headquarters, regional_headquarters, branch, franchise)
     - Has Parent checkbox
       - When checked, shows parent business selector
       - Parent selection is filtered based on business type:
         - Global HQ: Cannot have parent
         - Regional HQ: Can only select Global HQ as parent
         - Branch/Franchise: Can select either Regional or Global HQ
     - Status selection
  2. Location Details
     - Address information
     - Contact details
- Form features:
  - Progress indicator
  - Step navigation
  - Validation feedback
  - Responsive grid layout
  - Dynamic parent selection based on business type
  - Clear hierarchy visualization
- Enterprise styling:
  - Consistent input design
  - Clear section separation
  - Professional typography
  - Proper spacing hierarchy

### 4. Business Hierarchy
- Support for complex business structures:
  1. Global Headquarters
     - Top-level business entity
     - Cannot have a parent
     - Can have multiple regional HQs and branches
  2. Regional Headquarters
     - Must have a Global HQ as parent
     - Can have multiple branches
  3. Branch/Franchise
     - Can have either Regional or Global HQ as parent
     - Represents operational business units
- Hierarchy Visualization:
  - Tree view of business relationships
  - Clear indication of business types
  - Easy navigation between related businesses
  - Status indicators at each level

### 5. Design System Implementation 
- Core Design Elements:
  - Background: White (#FFFFFF)
  - Interactive Elements: bg-gray-50/50
  - Primary: Egyptian Blue (#1034A6)
  - Secondary: Gold Yellow (#F3BE2B)
  - Border: gray-200
  - Border Radius: rounded-md (6px)
  - Font: Inter, optimized sizes
  
- Component Patterns:
  - Consistent form fields
  - Unified button styles
  - Card layouts
  - Search and filter interfaces
  - Loading states
  - Empty states
  
- Interactions:
  - Hover effects
  - Focus states
  - Loading animations
  - Transitions
  - Validation feedback

### 6. Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Proper contrast ratios
- Focus management
- ARIA attributes
- Keyboard navigation

## Implementation Status
✅ Completed:
- Business listing page with card view
- Search and filter functionality
- Business creation/edit form
- Core design system implementation
- Responsive layouts
- Basic accessibility features
- Loading states and animations
- ESLint configuration and fixes
- Vercel deployment setup
- Location management features

🔄 In Progress:
- Component documentation
- Dark mode support
- Additional micro-interactions
- Design token documentation
- Business hierarchy visualization

⏳ Pending:
- Contact management
- Advanced search features
- Export functionality

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
- Hierarchy visualization

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
