-- Create a function to handle business and location creation in a single transaction
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
    result jsonb;
begin
    -- Start transaction
    begin
        -- Insert business
        insert into businesses
        select * from jsonb_populate_record(null::businesses, business_data)
        returning id into new_business_id;

        -- If location data is provided, insert location
        if location_data is not null then
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
            'status', 'success'
        ) into result;

        return result;
    exception
        when others then
            -- Roll back transaction on error
            raise exception 'Error creating business: %', SQLERRM;
    end;
end;
$$;
