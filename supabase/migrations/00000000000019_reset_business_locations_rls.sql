-- First, disable RLS to clean up
alter table public.business_locations disable row level security;

-- Delete ALL existing policies using dynamic SQL
DO $$ 
DECLARE 
    policy_record record;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'business_locations' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.business_locations', policy_record.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
alter table public.business_locations enable row level security;

-- Create a single, simple policy for testing
create policy "Enable all access to business_locations"
    on public.business_locations
    for all
    using (true)
    with check (true);

-- Verify the policy was created
DO $$ 
BEGIN
    RAISE NOTICE 'Verifying policies for business_locations:';
    FOR policy_record IN 
        SELECT policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies 
        WHERE tablename = 'business_locations' 
        AND schemaname = 'public'
    LOOP
        RAISE NOTICE 'Policy: %, Permissive: %, Roles: %, Command: %, Using: %, With Check: %', 
            policy_record.policyname, 
            policy_record.permissive, 
            policy_record.roles,
            policy_record.cmd,
            policy_record.qual,
            policy_record.with_check;
    END LOOP;
END $$;
