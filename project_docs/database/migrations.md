# Database Migration Guide

## Overview
This guide covers the management of database migrations using Supabase CLI for our business management application.

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
