-- Drop existing function
drop function if exists create_business_with_location;

-- Recreate function with location ID generation
create or replace function create_business_with_location(
    business_data jsonb,
    location_data jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    new_business_id uuid;
    new_location_id uuid;
    business_record businesses;
    result jsonb;
begin
    -- Start transaction
    begin
        -- Generate new UUID for business
        new_business_id := gen_random_uuid();
        
        -- Insert business with explicit UUID
        insert into businesses
        select * from jsonb_populate_record(
            null::businesses, 
            business_data || jsonb_build_object('id', new_business_id)
        )
        returning * into business_record;

        -- If location data is provided, insert location with generated ID
        if location_data is not null and location_data != 'null'::jsonb then
            -- Generate new UUID for location
            new_location_id := gen_random_uuid();
            
            insert into business_locations
            select *
            from jsonb_populate_record(
                null::business_locations,
                location_data || jsonb_build_object(
                    'id', new_location_id,
                    'business_id', new_business_id
                )
            );
        end if;

        -- Prepare result
        select jsonb_build_object(
            'id', new_business_id,
            'status', 'success',
            'business', row_to_json(business_record)
        ) into result;

        return result;
    exception
        when others then
            -- Roll back transaction on error
            raise exception 'Error creating business: %', SQLERRM;
    end;
end;
$$;
