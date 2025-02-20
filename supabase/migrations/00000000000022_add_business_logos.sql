-- Add new logo columns and deprecate the old one
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS logo_short_url text,
ADD COLUMN IF NOT EXISTS logo_full_url text,
ADD COLUMN IF NOT EXISTS has_parent boolean NOT NULL DEFAULT false;

-- Create a function to validate logo URLs
CREATE OR REPLACE FUNCTION validate_business_logos()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate logo URLs format (basic validation)
    IF NEW.logo_short_url IS NOT NULL AND NOT (
        NEW.logo_short_url LIKE 'https://%' OR 
        NEW.logo_short_url LIKE 'http://%'
    ) THEN
        RAISE EXCEPTION 'Invalid short logo URL format';
    END IF;

    IF NEW.logo_full_url IS NOT NULL AND NOT (
        NEW.logo_full_url LIKE 'https://%' OR 
        NEW.logo_full_url LIKE 'http://%'
    ) THEN
        RAISE EXCEPTION 'Invalid full logo URL format';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for logo validation
DROP TRIGGER IF EXISTS business_logos_validation ON public.businesses;
CREATE TRIGGER business_logos_validation
    BEFORE INSERT OR UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION validate_business_logos();

-- Comment on new columns
COMMENT ON COLUMN public.businesses.logo_short_url IS 'URL for the short version of the business logo';
COMMENT ON COLUMN public.businesses.logo_full_url IS 'URL for the full version of the business logo';
COMMENT ON COLUMN public.businesses.has_parent IS 'Whether the business has a parent';

-- Migration to move existing logo URLs to full logo URL
UPDATE public.businesses
SET logo_full_url = logo_url
WHERE logo_url IS NOT NULL
AND logo_full_url IS NULL;

-- Mark old logo_url as deprecated (we'll remove it in a future migration)
COMMENT ON COLUMN public.businesses.logo_url IS 'DEPRECATED: Use logo_full_url or logo_short_url instead';
