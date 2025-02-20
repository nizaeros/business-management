# Codebase Structure Documentation

## Directory Overview
```bash
business-management/
├── src/                    # Source code
│   ├── app/               # Next.js 13+ App Router
│   │   ├── (auth)/       # Authentication routes
│   │   ├── (internal)/   # Internal dashboard routes
│   │   └── (external)/   # External client routes
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── business/     # Business-specific components
│   ├── lib/              # Utilities and configurations
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── project_docs/         # Project documentation
    ├── design-system/    # Design system documentation
    ├── features/         # Feature specifications
    └── technical/        # Technical documentation
```

## Key Files and Their Purposes

### Root Directory
- `next.config.ts` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration

### Source Code (/src)

#### App Router (/src/app)
- `layout.tsx` - Root layout with global providers
- `(auth)/*` - Authentication-related pages
  - `login/page.tsx` - Login page
  - `forgot-password/page.tsx` - Password recovery
  - `reset-password/page.tsx` - Password reset
- `(internal)/*` - Internal dashboard pages
  - `businesses/page.tsx` - Business listing
  - `businesses/[id]/page.tsx` - Business details
  - `businesses/[id]/edit/page.tsx` - Business edit form
- `(external)/*` - Client-facing pages
  - `external/page.tsx` - External dashboard

#### Components (/src/components)

##### UI Components (/components/ui)
- `card/` - Card components
  - `Card.tsx` - Base card component
  - `CardHeader.tsx` - Card header component
  - `CardContent.tsx` - Card content component
- `form/` - Form components
  - `Input.tsx` - Text input component
  - `Select.tsx` - Select dropdown component
  - `Checkbox.tsx` - Checkbox component
  - `FormField.tsx` - Form field wrapper

##### Business Components (/components/business)
- `BusinessCard.tsx` - Business card display
- `BusinessForm.tsx` - Business creation/edit form
- `BusinessSearch.tsx` - Search functionality
- `BusinessFilters.tsx` - Filter components

#### Library (/src/lib)
- `supabase/` - Supabase client configuration
- `utils/` - Utility functions and helpers

#### Types (/src/types)
- `supabase.ts` - Database types
- `common.ts` - Shared type definitions

### Documentation (/project_docs)

#### Design System (/design-system)
- `overview.md` - Design system documentation
- Components and styling guidelines

#### Features (/features)
- `auth/` - Authentication feature specs
- `business/` - Business module specs

#### Technical (/technical)
- `codebase-structure.md` - This file
- Development guidelines and standards

## File Naming Conventions
1. React Components: PascalCase (e.g., `BusinessCard.tsx`)
2. Utilities: camelCase (e.g., `formatDate.ts`)
3. Constants: UPPER_SNAKE_CASE
4. Documentation: kebab-case (e.g., `file-structure.md`)

## Component Organization
- Each component should have its own directory when it has multiple related files
- Include index.ts for clean exports
- Keep styles, tests, and types close to the component

## Best Practices
1. Follow the established file structure
2. Use appropriate naming conventions
3. Keep related files together
4. Document significant changes
5. Maintain clean imports/exports

## Version Control
1. Main Branches:
   - `main` - Production releases
   - `staging` - Integration testing
   - `development` - Active development

2. Feature Branches:
   - Format: `feature/feature-name`
   - Example: `feature/business-locations`

3. Bug Fix Branches:
   - Format: `fix/issue-description`
   - Example: `fix/checkbox-validation`

## Deployment
- Production: Vercel (main branch)
- Staging: Vercel (staging branch)
- Preview: Vercel (PR deployments)

## Build and Development
- Development: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type Check: `npm run type-check`
