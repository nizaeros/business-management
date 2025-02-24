# Database Migration Guide

## Overview
This guide covers the management of database migrations using Supabase CLI for our business management application.

## Database Environments

We maintain two separate database environments:

1. **Local Development Database**
   - URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
   - Runs locally through Docker using Supabase CLI
   - Used for development and testing
   - Can be reset and recreated at any time
   - Started using `supabase start`

2. **BMApp-dev (Development Environment)**
   - Online Supabase project database
   - Contains actual development data
   - Used by the team for collaboration
   - Updated through GitHub Actions CI/CD

## Local Development Workflow

1. **Start Local Database**
   ```bash
   # Start all Supabase services (excluding vector for stability)
   supabase start -x vector
   ```

2. **Create New Migration**
   ```bash
   # Create a new migration file
   supabase migration new your_migration_name
   ```

3. **Test Migrations Locally**
   ```bash
   # Reset and test your migrations
   supabase db reset
   ```

4. **Push Changes**
   ```bash
   # After testing, commit and push your changes
   git add supabase/migrations/
   git commit -m "feat(db): add your migration description"
   git push origin staging
   ```

## Migration File Structure
Migrations are stored in `supabase/migrations/` with the following naming convention:
```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Example:
```sql
-- 20250222073920_add_description_to_business.sql

-- Up Migration
ALTER TABLE "public"."businesses" ADD COLUMN "description" text;
COMMENT ON COLUMN "public"."businesses"."description" IS 'Detailed description of the business';

-- Down Migration
ALTER TABLE "public"."businesses" DROP COLUMN IF EXISTS "description";
```

## Migration Best Practices

### 1. Writing Migrations
- Always include both Up and Down migrations
- Use IF EXISTS/IF NOT EXISTS clauses
- Add comments for complex changes
- Keep migrations atomic (one logical change per migration)

### 2. Testing Migrations
```bash
# Test locally first
supabase db reset
supabase db push

# Verify changes
supabase db diff
```

### 3. Common Migration Patterns

#### Adding a Table
```sql
-- Up Migration
CREATE TABLE IF NOT EXISTS "public"."new_table" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "new_table_pkey" PRIMARY KEY ("id")
);

-- Down Migration
DROP TABLE IF EXISTS "public"."new_table";
```

#### Adding a Column
```sql
-- Up Migration
ALTER TABLE "public"."table_name" ADD COLUMN IF NOT EXISTS "new_column" text;
COMMENT ON COLUMN "public"."table_name"."new_column" IS 'Description of the column';

-- Down Migration
ALTER TABLE "public"."table_name" DROP COLUMN IF EXISTS "new_column";
```

#### Adding Foreign Keys
```sql
-- Up Migration
ALTER TABLE "public"."table_name" 
    ADD COLUMN IF NOT EXISTS "foreign_id" uuid REFERENCES other_table(id);

-- Down Migration
ALTER TABLE "public"."table_name" 
    DROP COLUMN IF EXISTS "foreign_id";
```

## Branch and Database Strategy

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature staging

   # Start local database
   supabase start -x vector

   # Create and test migrations locally
   supabase migration new your_migration
   supabase db reset  # Test your changes
   ```

2. **Migration Testing**
   - Work on your feature branch
   - Test migrations repeatedly using `supabase db reset`
   - Only commit migrations that are working and final

3. **Pushing to Staging**
   ```bash
   # Once migrations are tested and working
   git checkout staging
   git merge feature/your-feature
   git push origin staging  # This will update BMApp-dev
   ```

## Managing Migration Files

1. **During Development**
   - Keep working migrations in your feature branch
   - Use `supabase db reset` frequently to test
   - Don't push incomplete migrations to staging

2. **Before Pushing to Staging**
   - Clean up migration files
   - Combine multiple migrations if needed
   - Ensure both "up" and "down" migrations work

3. **Migration File Cleanup**
   ```bash
   # If you have multiple working migrations
   supabase migration squash your_migration_name  # Combines migrations
   ```

## Best Practices for Migration Management

1. **Feature Branches**
   - Always create feature branches from staging
   - Test migrations thoroughly in local environment
   - Clean up migrations before merging to staging

2. **Staging Branch (BMApp-dev)**
   - Only accepts tested and working migrations
   - Automatically deploys to BMApp-dev
   - Serves as integration environment

3. **Main Branch (Production)**
   - Only receives stable migrations
   - Requires thorough testing in staging
   - Manual deployment process

## Migration Safety

1. **Before Pushing to Staging**
   - Test all migrations locally
   - Verify "down" migrations work
   - Check for data integrity

2. **After Pushing to Staging**
   - Monitor BMApp-dev deployment
   - Verify database changes
   - Test application functionality

3. **Emergency Rollback**
   ```bash
   # If something goes wrong in BMApp-dev
   git revert <commit>
   git push origin staging
   ```

## Common Scenarios

1. **Working on Multiple Features**
   ```bash
   # Feature 1
   git checkout -b feature/feature1 staging
   supabase migration new feature1_changes
   # Test and develop...

   # Feature 2
   git checkout -b feature/feature2 staging
   supabase migration new feature2_changes
   # Test and develop...
   ```

2. **Fixing Failed Migrations**
   ```bash
   # If a migration fails in BMApp-dev
   git checkout -b fix/migration-fix staging
   # Fix migration files
   supabase db reset  # Test locally
   git push origin fix/migration-fix
   # Create pull request to staging
   ```

3. **Managing Conflicts**
   ```bash
   # If you have migration conflicts
   git checkout staging
   git pull origin staging
   git checkout your-feature-branch
   git rebase staging
   # Resolve conflicts in migration files
   supabase db reset  # Test after resolving
   ```

## Type Generation

### Automatic Type Updates
After any schema change:
```bash
supabase gen types typescript --linked > src/types/supabase.ts
```

### Using Generated Types
```typescript
import { Database } from '@/types/supabase';

type Business = Database['public']['Tables']['businesses']['Row'];
type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
```

## Troubleshooting

### Common Issues

1. **Migration Conflicts**
```bash
# View current status
supabase migration list

# Repair if needed
supabase migration repair --status reverted <version>
```

2. **Failed Migrations**
```bash
# Roll back to last working version
supabase migration repair --status reverted <version>

# Fix migration file and try again
supabase db push
```

3. **Type Generation Errors**
- Ensure database is accessible
- Check for syntax errors in migrations
- Verify schema permissions

## Migration History

Keep track of significant migrations:

| Date | Migration | Description | Author |
|------|-----------|-------------|---------|
| 2025-02-22 | 20250222073141 | Initial schema | System |
| 2025-02-22 | 20250222073920 | Add business description | System |

## Backup Procedures

### Before Major Changes
1. Create a backup in Supabase dashboard
2. Document current schema version
3. Test migration in development

### Recovery Steps
1. Access Supabase dashboard
2. Navigate to Database > Backups
3. Restore from point-in-time backup
4. Verify data integrity

## Security Considerations

1. **Access Control**
```sql
-- Always set proper RLS policies
ALTER TABLE "public"."table_name" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name" ON "public"."table_name"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = created_by);
```

2. **Sensitive Data**
- Never store passwords in plain text
- Use appropriate data types for sensitive information
- Implement proper access controls

## Monitoring

### Performance
- Monitor query performance
- Check index usage
- Review table sizes

### Maintenance
- Regular vacuum operations
- Index maintenance
- Statistics updates
