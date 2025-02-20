-- Delete existing test data if any
DELETE FROM public.business_locations WHERE business_id IN (SELECT id FROM public.businesses WHERE id IN ('ghq-001', 'rhq-001'));
DELETE FROM public.businesses WHERE id IN ('ghq-001', 'rhq-001');

-- Create UUIDs for our test data
DO $$
DECLARE
    global_hq_id uuid := uuid_generate_v4();
    regional_hq_id uuid := uuid_generate_v4();
    global_hq_loc_id uuid := uuid_generate_v4();
    regional_hq_loc_id uuid := uuid_generate_v4();
BEGIN

-- Insert test businesses with proper hierarchy
INSERT INTO public.businesses 
(
    id, 
    name, 
    registered_name, 
    business_code, 
    business_type, 
    has_parent,
    parent_business_id,
    status,
    address_line1,
    city,
    state,
    country,
    created_at,
    created_by,
    updated_at,
    updated_by
)
VALUES 
-- Global Headquarters
(
    global_hq_id,
    'Global Corp HQ',
    'Global Corporation',
    'GC-001',
    'global_headquarters',
    false,
    null,
    'active',
    '123 Global Street',
    'New York',
    'NY',
    'USA',
    NOW(),
    'system',
    NOW(),
    'system'
),
-- Regional Headquarters
(
    regional_hq_id,
    'APAC Regional HQ',
    'Global Corp APAC',
    'GC-APAC-001',
    'regional_headquarters',
    true,
    global_hq_id,
    'active',
    '456 Regional Avenue',
    'Singapore',
    'Singapore',
    'Singapore',
    NOW(),
    'system',
    NOW(),
    'system'
);

-- Insert primary locations for the businesses
INSERT INTO public.business_locations
(
    id,
    business_id,
    name,
    address_line1,
    city,
    state,
    country,
    is_primary,
    status,
    created_at,
    created_by,
    updated_at,
    updated_by
)
VALUES
-- Global HQ Location
(
    global_hq_loc_id,
    global_hq_id,
    'Global Corp HQ - Main Office',
    '123 Global Street',
    'New York',
    'NY',
    'USA',
    true,
    'active',
    NOW(),
    'system',
    NOW(),
    'system'
),
-- Regional HQ Location
(
    regional_hq_loc_id,
    regional_hq_id,
    'APAC Regional HQ - Main Office',
    '456 Regional Avenue',
    'Singapore',
    'Singapore',
    'Singapore',
    true,
    'active',
    NOW(),
    'system',
    NOW(),
    'system'
);

END $$;
