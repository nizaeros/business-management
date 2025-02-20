-- Drop existing check constraint for business_type
ALTER TABLE public.businesses 
DROP CONSTRAINT IF EXISTS businesses_business_type_check;

-- Update business_type enum with new values
ALTER TABLE public.businesses
ADD CONSTRAINT businesses_business_type_check 
CHECK (business_type IN ('global_headquarters', 'regional_headquarters', 'branch', 'franchise'));

-- Add has_parent column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'has_parent'
    ) THEN
        ALTER TABLE public.businesses
        ADD COLUMN has_parent boolean DEFAULT false;
    END IF;
END $$;

-- Create function to validate business hierarchy
CREATE OR REPLACE FUNCTION validate_business_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
    -- If has_parent is false, parent_business_id must be null
    IF NOT NEW.has_parent AND NEW.parent_business_id IS NOT NULL THEN
        RAISE EXCEPTION 'Parent business ID must be null when has_parent is false';
    END IF;

    -- If has_parent is true, parent_business_id must not be null
    IF NEW.has_parent AND NEW.parent_business_id IS NULL THEN
        RAISE EXCEPTION 'Parent business ID is required when has_parent is true';
    END IF;

    -- Global HQ cannot have a parent
    IF NEW.business_type = 'global_headquarters' AND NEW.has_parent THEN
        RAISE EXCEPTION 'Global headquarters cannot have a parent business';
    END IF;

    -- Regional HQ must have a global HQ as parent if has_parent is true
    IF NEW.business_type = 'regional_headquarters' AND NEW.has_parent AND (
        NOT EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = NEW.parent_business_id 
            AND business_type = 'global_headquarters'
        )
    ) THEN
        RAISE EXCEPTION 'Regional headquarters can only have global headquarters as parent';
    END IF;

    -- Branches and franchises must have either regional or global HQ as parent if has_parent is true
    IF (NEW.business_type IN ('branch', 'franchise')) AND NEW.has_parent AND (
        NOT EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = NEW.parent_business_id 
            AND business_type IN ('regional_headquarters', 'global_headquarters')
        )
    ) THEN
        RAISE EXCEPTION 'Branch or franchise must have either regional or global headquarters as parent';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS business_hierarchy_validation ON public.businesses;
CREATE TRIGGER business_hierarchy_validation
    BEFORE INSERT OR UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION validate_business_hierarchy();

-- Update the create_business_with_location function
CREATE OR REPLACE FUNCTION create_business_with_location(
    business_data jsonb,
    location_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_business_id uuid;
    new_location_id uuid;
    business_record businesses;
    result jsonb;
BEGIN
    -- Start transaction
    BEGIN
        -- Generate new UUID for business
        new_business_id := gen_random_uuid();
        
        -- Insert business with explicit UUID
        INSERT INTO businesses
        SELECT * FROM jsonb_populate_record(
            null::businesses, 
            business_data || jsonb_build_object('id', new_business_id)
        )
        RETURNING * INTO business_record;

        -- If location data is provided, insert location with generated ID
        IF location_data IS NOT NULL AND location_data != 'null'::jsonb THEN
            -- Generate new UUID for location
            new_location_id := gen_random_uuid();
            
            INSERT INTO business_locations
            SELECT *
            FROM jsonb_populate_record(
                null::business_locations,
                location_data || jsonb_build_object(
                    'id', new_location_id,
                    'business_id', new_business_id
                )
            );
        END IF;

        -- Prepare result
        SELECT jsonb_build_object(
            'id', new_business_id,
            'status', 'success',
            'business', row_to_json(business_record)
        ) INTO result;

        RETURN result;
    EXCEPTION
        WHEN others THEN
            -- Roll back transaction on error
            RAISE EXCEPTION 'Error creating business: %', SQLERRM;
    END;
END;
$$;
