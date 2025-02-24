# Deployment and Database Migration Guide

## Table of Contents
1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Database Migration Workflow](#database-migration-workflow)
4. [Deployment Process](#deployment-process)
5. [Best Practices](#best-practices)
6. [Emergency Procedures](#emergency-procedures)
7. [Branch Strategy](#branch-strategy)
8. [Deployment Flow](#deployment-flow)
9. [Development Workflow](#development-workflow)
10. [Environment Management](#environment-management)
11. [Database Changes](#database-changes)
12. [Common Commands](#common-commands)
13. [Monitoring and Verification](#monitoring-and-verification)
14. [Git Branch Strategy](#git-branch-strategy)
15. [Feature Development and Branching Strategy](#feature-development-and-branching-strategy)

## Project Structure

### Environments
- **Development**: `BmApp-Dev` (Project ID: nbuwuosqpfzyxasdvejk)
- **Production**: `BmApp-Prod` (To be created)

### Branch Strategy
```plaintext
main (production)
  │
  ├── staging (optional)
  │
  └── feature branches
      └── development
```

## Environment Setup

### Local Development
- Copy `.env.example` to `.env.local` and fill in your development environment variables
- Never commit `.env.local` to git

### Production (Vercel)
Set the following environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Environment Files Explained
We use a simple environment setup:

1. `.env.local` - Local development variables (git-ignored)
2. `.env.example` - Template showing required variables (committed to git)

We do NOT use:
- `.env.production` - Not needed (use Vercel environment variables)
- `.env.development` - Not needed (use .env.local)
- Any other env files

This keeps our setup clean and secure, with clear separation between local development and production environments.

## Database Migration Workflow

### 1. Local Development

```bash
# Create new feature branch
git checkout -b feature/new-feature

# Create new migration
supabase migration new feature_name

# Edit migration file (supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql)
-- Up Migration
ALTER TABLE "public"."table_name" ADD COLUMN "new_column" text;

-- Down Migration
ALTER TABLE "public"."table_name" DROP COLUMN IF EXISTS "new_column";

# Test locally
supabase db push

# Commit changes
git add .
git commit -m "feat: add new feature with migrations"
```

### 2. Development Deployment

```bash
# Push to development branch
git push origin feature/new-feature

# Link to development project
supabase link --project-ref nbuwuosqpfzyxasdvejk

# Deploy migrations
supabase db push
```

### 3. Production Deployment

```bash
# Merge to main
git checkout main
git merge feature/new-feature

# Link to production project
supabase link --project-ref <prod_project_ref>

# Review migrations
supabase migration list

# Deploy to production
supabase db push
```

## Deployment Process

### CI/CD Configuration
Located in `.github/workflows/supabase-deploy.yml`:

```yaml
name: Deploy Migrations
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      PRODUCTION_PROJECT_ID: ${{ secrets.PRODUCTION_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v3
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
      - name: Deploy Migrations
        run: supabase db push
```

### Required Secrets
- `SUPABASE_ACCESS_TOKEN`: Supabase access token
- `PRODUCTION_PROJECT_ID`: Production project reference ID

## Best Practices

### 1. Migration Safety
- Always use IF EXISTS/IF NOT EXISTS in migrations
- Include both Up and Down migrations
- Test migrations locally before deployment
- Keep migrations small and focused

### 2. Version Control
- All migrations must be in version control
- Never modify committed migrations
- Create new migrations for changes
- Document breaking changes

### 3. TypeScript Types
```bash
# Generate after schema changes
supabase gen types typescript --linked > src/types/supabase.ts
```

## Emergency Procedures

### Rolling Back Migrations
```bash
# View migration history
supabase migration list

# Rollback specific migration
supabase migration repair --status reverted <migration_version>

# Verify rollback
supabase migration list
```

### Database Backup
- Always backup before major migrations
- Use Supabase dashboard for manual backups
- Enable point-in-time recovery for production

## Branch Strategy

1. **Feature Branches**
   - Created from `staging`
   - Used for development
   - Local testing only
   - Example: `feature/add-business-type`

2. **Staging Branch**
   - Connected to BMApp-dev
   - Integration environment
   - Auto-deploys on push
   - Receives tested features

3. **Main Branch**
   - Will connect to production
   - Receives stable code
   - Manual deployment
   - Requires approval

## Deployment Flow

```mermaid
graph TD
    A[Feature Branch] -->|Local Development| B[Local Environment]
    A -->|Tested & Ready| C[staging branch]
    C -->|Auto Deploy| D[BMApp-dev]
    C -->|Stable Release| E[main branch]
    E -->|Manual Deploy| F[Production]
```

## Development Workflow

1. **Start New Feature**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature staging

   # Start local environment
   supabase start -x vector
   npm run dev
   ```

2. **During Development**
   - Work in feature branch
   - Test with local database
   - Create and test migrations
   - Commit working changes

3. **Ready for Integration**
   ```bash
   # Update from staging
   git checkout staging
   git pull origin staging
   git checkout feature/your-feature
   git rebase staging

   # Final local testing
   supabase db reset
   npm run test

   # Push to staging
   git checkout staging
   git merge feature/your-feature
   git push origin staging
   ```

## Environment Management

1. **Local Environment**
   - Complete isolation
   - Fresh database
   - Rapid testing
   - No shared state

2. **BMApp-dev (Staging)**
   - Shared environment
   - Integration testing
   - Team collaboration
   - Auto-deployment

3. **Production** (Future)
   - Stable releases
   - Manual deployment
   - Backup before changes
   - Monitored updates

## Database Changes

1. **Feature Development**
   - Create migrations in feature branch
   - Test thoroughly with local database
   - Clean up before pushing to staging

2. **Staging Integration**
   - Migrations auto-apply to BMApp-dev
   - Monitor deployment in GitHub Actions
   - Test in BMApp-dev environment

3. **Production Release**
   - Review all migrations
   - Backup production database
   - Manual deployment process

## Common Commands

```bash
# Feature Development
git checkout -b feature/new-feature staging
supabase start -x vector
npm run dev

# Push to Staging
git checkout staging
git merge feature/new-feature
git push origin staging

# Emergency Rollback
git revert <commit>
git push origin staging
```

## Monitoring and Verification

1. **Local Changes**
   - Supabase Studio (http://localhost:54323)
   - Local logs and tests
   - Database reset available

2. **Staging Changes**
   - GitHub Actions logs
   - Vercel deployment
   - Supabase dashboard
   - Team verification

Remember: Always test thoroughly in your feature branch before pushing to staging.

## Common Commands Reference

```bash
# Create new migration
supabase migration new my_migration_name

# List migrations
supabase migration list

# Push migrations
supabase db push

# Generate types
supabase gen types typescript --linked > src/types/supabase.ts

# Link project
supabase link --project-ref <project_ref>

# Repair/rollback migration
supabase migration repair --status reverted <version>
```

## Monitoring and Maintenance

### Health Checks
1. Monitor migration logs in GitHub Actions
2. Check Supabase dashboard for:
   - Database performance
   - Error rates
   - Storage usage

### Regular Maintenance
1. Review and clean up unused tables
2. Optimize queries and indexes
3. Update types after schema changes
4. Maintain documentation

## Pre-deployment Checklist

1. ✅ All environment variables are set
2. ✅ Client components are properly wrapped in Suspense
3. ✅ Static/Dynamic rendering is properly configured
4. ✅ TypeScript and ESLint checks pass
5. ✅ All dependencies are up to date

## Deployment Process

1. Push changes to the `staging` branch
2. Vercel will automatically deploy to preview environment
3. Test the preview deployment
4. If successful, merge to `main` branch
5. Vercel will automatically deploy to production

## Monitoring and Troubleshooting

1. Use Vercel deployment logs for build issues
2. Check Runtime logs for server-side errors
3. Monitor Edge Function execution in Vercel dashboard
4. Use browser console for client-side issues

## Rollback Process

If issues are discovered after deployment:
1. Revert the problematic commit
2. Push the revert to the appropriate branch
3. Vercel will automatically redeploy the previous working version

## Common Issues and Solutions

### 1. Client Component Issues
- Wrap components using `useSearchParams`, `useRouter`, or other client hooks in Suspense boundaries
- Example:
  ```tsx
  import { Suspense } from 'react';

  export default function Page() {
    return (
      <Suspense fallback={<Loading />}>
        <ClientComponent />
      </Suspense>
    );
  }
  ```

### 2. Static vs Dynamic Pages
- Add `export const dynamic = 'force-dynamic'` for pages that need dynamic rendering
- Use proper caching strategies where applicable

### 3. Environment Variables
- Double-check that all environment variables are properly set in Vercel
- Use the Vercel dashboard to manage environment variables
- Keep production secrets secure and never commit them to the repository

## Environment Overview

Our project uses multiple environments for different stages of development:

1. **Local Development**
   - Local Supabase instance running in Docker
   - Used for development and testing
   - Completely isolated from other environments
   - Database URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

2. **Development (BMApp-dev)**
   - Online Supabase project
   - Shared development environment
   - Used for team collaboration
   - Updated via GitHub Actions

3. **Production** (Future)
   - Production Supabase project
   - Will be used for live application
   - Deployment through manual approval

## Environment Files

Maintain separate environment files:
```
.env.development    # Development credentials
.env.production     # Production credentials (when ready)
```

## Deployment Workflow

1. **Local Development**
   ```bash
   # Start local services
   supabase start -x vector

   # Run Next.js development server
   npm run dev
   ```

2. **Development Deployment**
   - Push changes to `staging` branch
   - GitHub Actions will:
     - Run tests
     - Apply database migrations
     - Deploy to Vercel

3. **Production Deployment** (Future)
   - Merge `staging` into `main`
   - Manual approval required
   - Production migrations run after approval

## Database Migrations

1. **Local Testing**
   - Create and test migrations locally
   - Verify changes in local database
   - Commit migration files

2. **Development Deployment**
   - Migrations auto-apply to BMApp-dev
   - Triggered by push to `staging`
   - Monitored via GitHub Actions

3. **Production Deployment**
   - Manual review of migrations
   - Backup before applying
   - Applied after approval

## CI/CD Pipeline

```mermaid
graph TD
    A[Local Development] -->|Push to staging| B[GitHub Actions]
    B -->|Auto Deploy| C[Development/BMApp-dev]
    B -->|Run Tests| D[Test Suite]
    B -->|Apply Migrations| E[Development DB]
    C -->|Manual Merge| F[Production]
```

## Emergency Procedures

1. **Database Issues**
   - Local: Reset using `supabase db reset`
   - Development: Restore from latest backup
   - Contact team lead for BMApp-dev issues

2. **Deployment Failures**
   - Check GitHub Actions logs
   - Revert problematic migrations
   - Roll back to last working commit

## Monitoring

1. **Local Development**
   - Supabase Studio: http://localhost:54323
   - Database: Local Postgres logs

2. **Development Environment**
   - Supabase Dashboard
   - Vercel Dashboard
   - GitHub Actions logs

## Security Notes

1. **Environment Variables**
   - Never commit `.env` files
   - Use Vercel for production secrets
   - Use local `.env.development` for development

2. **Database Access**
   - Use RLS policies for security
   - Test policies in local environment
   - Regular security audits

## Common Commands

```bash
# Local Development
supabase start -x vector    # Start local services
supabase stop              # Stop local services
supabase status           # Check service status

# Deployment
git push origin staging   # Deploy to development
```

## Git Branch Strategy

### Branch Types

1. **Main Branches (Permanent)**
   - `main`: Production branch
   - `staging`: Development and testing (connected to BMApp-dev)

2. **Temporary Branches**
   - `feature/*` - New features
     - Example: `feature/add-business-type`
     - Created from: `staging`
     - Merged to: `staging`
   
   - `fix/*` - Bug fixes
     - Example: `fix/login-issue`
     - Created from: `staging`
     - Merged to: `staging`

### Branch Naming Convention

1. **Feature Branches**
   ```bash
   feature/short-description
   # Examples:
   feature/add-business-type
   feature/user-permissions
   ```

2. **Fix Branches**
   ```bash
   fix/short-description
   # Examples:
   fix/login-error
   fix/database-migration
   ```

### Workflow Commands

1. **Create Feature Branch**
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b feature/your-feature
   ```

2. **Update Feature Branch**
   ```bash
   git checkout staging
   git pull origin staging
   git checkout feature/your-feature
   git rebase staging
   ```

3. **Merge to Staging**
   ```bash
   # After testing locally
   git checkout staging
   git pull origin staging
   git merge feature/your-feature
   git push origin staging
   ```

### Branch Protection Rules

1. **staging Branch**
   - No direct pushes
   - Requires pull request
   - Auto-deploys to BMApp-dev

2. **main Branch** (Future)
   - Protected branch
   - Requires pull request
   - Requires approval
   - Manual deployment

### Best Practices

1. **Always Branch from staging**
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b feature/new-feature
   ```

2. **Keep Branches Updated**
   ```bash
   # While working on feature
   git checkout staging
   git pull origin staging
   git checkout feature/your-feature
   git rebase staging
   ```

3. **Clean Up After Merge**
   ```bash
   # After your feature is merged
   git checkout staging
   git pull origin staging
   git branch -d feature/your-feature
   ```

## Feature Development and Branching Strategy

### Branch Organization

1. **Main Branches**
   - `main`: Production branch
   - `staging`: Development and testing (connected to BMApp-dev)

2. **Feature Branch Structure**
   ```
   staging
   └── feature/feature-name
       ├── feature/feature-database  # Database changes
       ├── feature/feature-ui        # UI components
       ├── feature/feature-logic     # Business logic
       └── feature/feature-tests     # Tests
   ```

### Feature Development Workflow

1. **Initial Setup**
   ```bash
   # Start from staging
   git checkout staging
   git pull origin staging
   
   # Create main feature branch
   git checkout -b feature/feature-name
   
   # Create sub-feature branch
   git checkout -b feature/feature-specific
   ```

2. **Development Process**
   a. Create database migrations first
   b. Develop UI components and pages
   c. Implement business logic
   d. Write tests
   e. Integrate and test sub-features
   f. Merge to main feature branch
   g. Final testing
   h. Merge to staging

### Example: Client Management Feature

```
feature/client-management
├── feature/client-database  # Schema and migrations
├── feature/client-list      # List and search UI
├── feature/client-create    # Create/Edit forms
└── feature/client-details   # Detail pages
```

**File Structure:**
```
src/
├── components/
│   └── client/
│       ├── ClientList.tsx
│       ├── ClientCard.tsx
│       ├── ClientSearch.tsx
│       └── ClientForm.tsx
├── types/
│   └── client.ts
└── app/
    └── (internal)/
        └── clients/
            ├── page.tsx
            ├── create/
            │   └── page.tsx
            └── [id]/
                └── page.tsx
```

### Integration Process

1. **Database Changes First**
   ```bash
   git checkout feature/client-database
   supabase migration new add_clients_schema
   # Test migration locally
   git checkout feature/client-management
   git merge feature/client-database
   ```

2. **UI and Logic Integration**
   ```bash
   # Merge UI components
   git merge feature/client-list
   git merge feature/client-create
   
   # Test integrated features
   npm run test
   npm run dev
   ```

3. **Final Integration**
   ```bash
   git checkout staging
   git merge feature/client-management
   git push origin staging
   ```

### Quality Gates

Before merging to staging:
- [ ] All sub-features tested independently
- [ ] Integration testing complete
- [ ] Database migrations tested
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Performance verified
- [ ] Accessibility checked

### Documentation Requirements

Each feature should maintain:
```
project_docs/features/
└── feature_name/
    ├── requirements.md    # Feature requirements
    ├── technical_spec.md  # Implementation details
    ├── api.md            # API documentation
    └── testing.md        # Test cases
```
