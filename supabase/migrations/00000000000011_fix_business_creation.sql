-- Drop existing function
drop function if exists create_business_with_location;

-- Re-create function with fixes
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
    business_record businesses;
    result jsonb;
begin
    -- Start transaction
    begin
        -- Generate new UUID for business
        new_business_id := uuid_generate_v4();
        
        -- Insert business with explicit UUID
        insert into businesses
        select * from jsonb_populate_record(
            null::businesses, 
            business_data || jsonb_build_object('id', new_business_id)
        )
        returning * into business_record;

        -- If location data is provided, insert location
        if location_data is not null and location_data != 'null'::jsonb then
            insert into business_locations
            select *
            from jsonb_populate_record(
                null::business_locations,
                location_data || jsonb_build_object('business_id', new_business_id)
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
