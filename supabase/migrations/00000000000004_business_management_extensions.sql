-- Add new columns to businesses table
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS parent_business_id uuid REFERENCES public.businesses(id),
ADD COLUMN IF NOT EXISTS business_type text CHECK (business_type IN ('headquarters', 'branch', 'franchise')),
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active';

-- Create business locations table
CREATE TABLE IF NOT EXISTS public.business_locations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid REFERENCES public.businesses(id),
    name text NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    postal_code text,
    phone text,
    email text,
    is_primary boolean DEFAULT false,
    coordinates point,
    operating_hours jsonb,
    status text CHECK (status IN ('active', 'inactive', 'temporarily_closed')) DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users
);

-- Create partial unique index for primary location
CREATE UNIQUE INDEX business_locations_primary_idx ON public.business_locations (business_id) 
WHERE is_primary = true;

-- Create business contacts table
CREATE TABLE IF NOT EXISTS public.business_contacts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid REFERENCES public.businesses(id),
    location_id uuid REFERENCES public.business_locations(id),
    name text NOT NULL,
    designation text,
    phone text,
    email text,
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for business locations
CREATE POLICY "Enable read access for authenticated users" ON public.business_locations
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.business_locations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update for business owners" ON public.business_locations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Create policies for business contacts
CREATE POLICY "Enable read access for authenticated users" ON public.business_contacts
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.business_contacts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update for business owners" ON public.business_contacts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);
