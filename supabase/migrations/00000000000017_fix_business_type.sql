-- Add business_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'business_type'
    ) THEN
        ALTER TABLE public.businesses
        ADD COLUMN business_type text;
    END IF;
END $$;

-- Drop existing check constraint if it exists
ALTER TABLE public.businesses 
DROP CONSTRAINT IF EXISTS businesses_business_type_check;

-- Add new check constraint
ALTER TABLE public.businesses
ADD CONSTRAINT businesses_business_type_check 
CHECK (business_type IN ('global_headquarters', 'regional_headquarters', 'branch', 'franchise'));

-- Make business_type NOT NULL
ALTER TABLE public.businesses
ALTER COLUMN business_type SET NOT NULL;
