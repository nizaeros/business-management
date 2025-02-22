# Deployment and Database Migration Guide

## Table of Contents
1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Database Migration Workflow](#database-migration-workflow)
4. [Deployment Process](#deployment-process)
5. [Best Practices](#best-practices)
6. [Emergency Procedures](#emergency-procedures)

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
