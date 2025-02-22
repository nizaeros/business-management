-- Up Migration
alter table "public"."businesses" add column "description" text;
-- Add comment to the column
comment on column "public"."businesses"."description" is 'Detailed description of the business';

-- Down Migration
alter table "public"."businesses" drop column if exists "description";