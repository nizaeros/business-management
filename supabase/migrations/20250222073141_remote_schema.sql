create table "public"."business_contacts" (
    "id" uuid not null default uuid_generate_v4(),
    "business_id" uuid,
    "location_id" uuid,
    "name" text not null,
    "designation" text,
    "phone" text,
    "email" text,
    "is_primary" boolean default false,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
);


alter table "public"."business_contacts" enable row level security;

create table "public"."business_locations" (
    "id" uuid not null default uuid_generate_v4(),
    "business_id" uuid,
    "name" text not null,
    "address_line1" text not null,
    "address_line2" text,
    "city" text not null,
    "state" text not null,
    "country" text not null,
    "postal_code" text,
    "phone" text,
    "email" text,
    "is_primary" boolean default false,
    "coordinates" point,
    "operating_hours" jsonb,
    "status" text default 'active'::text,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
);


alter table "public"."business_locations" enable row level security;

create table "public"."business_users" (
    "id" uuid not null default uuid_generate_v4(),
    "business_id" uuid,
    "user_id" uuid,
    "role" text not null,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
);


alter table "public"."business_users" enable row level security;

create table "public"."businesses" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "registered_name" text,
    "business_code" text not null,
    "logo_url" text,
    "city" text,
    "state" text,
    "country" text,
    "address_line1" text,
    "address_line2" text,
    "slug" text not null,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "parent_business_id" uuid,
    "business_type" text not null,
    "status" text default 'active'::text,
    "logo_short_url" text,
    "logo_full_url" text,
    "has_parent" boolean not null default false
);


alter table "public"."businesses" enable row level security;

create table "public"."client_users" (
    "id" uuid not null default uuid_generate_v4(),
    "client_id" uuid,
    "user_id" uuid,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
);


alter table "public"."client_users" enable row level security;

create table "public"."clients" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "registered_name" text,
    "short_code" text not null,
    "address_line1" text,
    "address_line2" text,
    "city" text,
    "state" text,
    "country" text,
    "pin_code" text,
    "gstin" text,
    "industry_id" uuid,
    "entity_type_id" uuid,
    "parent_organization_id" uuid,
    "logo_url" text,
    "is_active" boolean default true,
    "slug" text not null,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid
);


create table "public"."division_users" (
    "id" uuid not null default gen_random_uuid(),
    "division_id" uuid not null,
    "user_id" uuid not null,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid
);


alter table "public"."division_users" enable row level security;

create table "public"."divisions" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "short_code" text not null,
    "manager_id" uuid,
    "description" text,
    "organization_id" uuid not null,
    "parent_division_id" uuid,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid
);


alter table "public"."divisions" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "full_name" text,
    "avatar_url" text,
    "phone_number" text,
    "user_type" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "email" text
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX business_contacts_pkey ON public.business_contacts USING btree (id);

CREATE UNIQUE INDEX business_locations_pkey ON public.business_locations USING btree (id);

CREATE UNIQUE INDEX business_locations_primary_idx ON public.business_locations USING btree (business_id) WHERE (is_primary = true);

CREATE UNIQUE INDEX business_users_business_id_user_id_key ON public.business_users USING btree (business_id, user_id);

CREATE UNIQUE INDEX business_users_pkey ON public.business_users USING btree (id);

CREATE UNIQUE INDEX businesses_business_code_key ON public.businesses USING btree (business_code);

CREATE UNIQUE INDEX businesses_pkey ON public.businesses USING btree (id);

CREATE UNIQUE INDEX businesses_slug_key ON public.businesses USING btree (slug);

CREATE UNIQUE INDEX client_users_client_id_user_id_key ON public.client_users USING btree (client_id, user_id);

CREATE UNIQUE INDEX client_users_pkey ON public.client_users USING btree (id);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX clients_short_code_key ON public.clients USING btree (short_code);

CREATE UNIQUE INDEX clients_slug_key ON public.clients USING btree (slug);

CREATE UNIQUE INDEX division_users_division_id_user_id_key ON public.division_users USING btree (division_id, user_id);

CREATE UNIQUE INDEX division_users_pkey ON public.division_users USING btree (id);

CREATE UNIQUE INDEX divisions_pkey ON public.divisions USING btree (id);

CREATE UNIQUE INDEX divisions_short_code_organization_id_key ON public.divisions USING btree (short_code, organization_id);

CREATE INDEX idx_division_users_division ON public.division_users USING btree (division_id);

CREATE INDEX idx_division_users_user ON public.division_users USING btree (user_id);

CREATE INDEX idx_divisions_organization ON public.divisions USING btree (organization_id);

CREATE INDEX idx_divisions_parent ON public.divisions USING btree (parent_division_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."business_contacts" add constraint "business_contacts_pkey" PRIMARY KEY using index "business_contacts_pkey";

alter table "public"."business_locations" add constraint "business_locations_pkey" PRIMARY KEY using index "business_locations_pkey";

alter table "public"."business_users" add constraint "business_users_pkey" PRIMARY KEY using index "business_users_pkey";

alter table "public"."businesses" add constraint "businesses_pkey" PRIMARY KEY using index "businesses_pkey";

alter table "public"."client_users" add constraint "client_users_pkey" PRIMARY KEY using index "client_users_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."division_users" add constraint "division_users_pkey" PRIMARY KEY using index "division_users_pkey";

alter table "public"."divisions" add constraint "divisions_pkey" PRIMARY KEY using index "divisions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."business_contacts" add constraint "business_contacts_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) not valid;

alter table "public"."business_contacts" validate constraint "business_contacts_business_id_fkey";

alter table "public"."business_contacts" add constraint "business_contacts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."business_contacts" validate constraint "business_contacts_created_by_fkey";

alter table "public"."business_contacts" add constraint "business_contacts_location_id_fkey" FOREIGN KEY (location_id) REFERENCES business_locations(id) not valid;

alter table "public"."business_contacts" validate constraint "business_contacts_location_id_fkey";

alter table "public"."business_contacts" add constraint "business_contacts_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."business_contacts" validate constraint "business_contacts_updated_by_fkey";

alter table "public"."business_locations" add constraint "business_locations_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) not valid;

alter table "public"."business_locations" validate constraint "business_locations_business_id_fkey";

alter table "public"."business_locations" add constraint "business_locations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."business_locations" validate constraint "business_locations_created_by_fkey";

alter table "public"."business_locations" add constraint "business_locations_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'temporarily_closed'::text]))) not valid;

alter table "public"."business_locations" validate constraint "business_locations_status_check";

alter table "public"."business_locations" add constraint "business_locations_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."business_locations" validate constraint "business_locations_updated_by_fkey";

alter table "public"."business_users" add constraint "business_users_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) not valid;

alter table "public"."business_users" validate constraint "business_users_business_id_fkey";

alter table "public"."business_users" add constraint "business_users_business_id_user_id_key" UNIQUE using index "business_users_business_id_user_id_key";

alter table "public"."business_users" add constraint "business_users_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."business_users" validate constraint "business_users_created_by_fkey";

alter table "public"."business_users" add constraint "business_users_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."business_users" validate constraint "business_users_updated_by_fkey";

alter table "public"."business_users" add constraint "business_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."business_users" validate constraint "business_users_user_id_fkey";

alter table "public"."businesses" add constraint "businesses_business_code_key" UNIQUE using index "businesses_business_code_key";

alter table "public"."businesses" add constraint "businesses_business_type_check" CHECK ((business_type = ANY (ARRAY['global_headquarters'::text, 'regional_headquarters'::text, 'branch'::text, 'franchise'::text]))) not valid;

alter table "public"."businesses" validate constraint "businesses_business_type_check";

alter table "public"."businesses" add constraint "businesses_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."businesses" validate constraint "businesses_created_by_fkey";

alter table "public"."businesses" add constraint "businesses_parent_business_id_fkey" FOREIGN KEY (parent_business_id) REFERENCES businesses(id) not valid;

alter table "public"."businesses" validate constraint "businesses_parent_business_id_fkey";

alter table "public"."businesses" add constraint "businesses_slug_key" UNIQUE using index "businesses_slug_key";

alter table "public"."businesses" add constraint "businesses_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text]))) not valid;

alter table "public"."businesses" validate constraint "businesses_status_check";

alter table "public"."businesses" add constraint "businesses_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."businesses" validate constraint "businesses_updated_by_fkey";

alter table "public"."client_users" add constraint "client_users_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) not valid;

alter table "public"."client_users" validate constraint "client_users_client_id_fkey";

alter table "public"."client_users" add constraint "client_users_client_id_user_id_key" UNIQUE using index "client_users_client_id_user_id_key";

alter table "public"."client_users" add constraint "client_users_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."client_users" validate constraint "client_users_created_by_fkey";

alter table "public"."client_users" add constraint "client_users_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."client_users" validate constraint "client_users_updated_by_fkey";

alter table "public"."client_users" add constraint "client_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."client_users" validate constraint "client_users_user_id_fkey";

alter table "public"."clients" add constraint "clients_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."clients" validate constraint "clients_created_by_fkey";

alter table "public"."clients" add constraint "clients_parent_organization_id_fkey" FOREIGN KEY (parent_organization_id) REFERENCES clients(id) not valid;

alter table "public"."clients" validate constraint "clients_parent_organization_id_fkey";

alter table "public"."clients" add constraint "clients_short_code_key" UNIQUE using index "clients_short_code_key";

alter table "public"."clients" add constraint "clients_slug_key" UNIQUE using index "clients_slug_key";

alter table "public"."clients" add constraint "clients_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."clients" validate constraint "clients_updated_by_fkey";

alter table "public"."division_users" add constraint "division_users_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."division_users" validate constraint "division_users_created_by_fkey";

alter table "public"."division_users" add constraint "division_users_division_id_fkey" FOREIGN KEY (division_id) REFERENCES divisions(id) not valid;

alter table "public"."division_users" validate constraint "division_users_division_id_fkey";

alter table "public"."division_users" add constraint "division_users_division_id_user_id_key" UNIQUE using index "division_users_division_id_user_id_key";

alter table "public"."division_users" add constraint "division_users_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."division_users" validate constraint "division_users_updated_by_fkey";

alter table "public"."division_users" add constraint "division_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."division_users" validate constraint "division_users_user_id_fkey";

alter table "public"."divisions" add constraint "divisions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."divisions" validate constraint "divisions_created_by_fkey";

alter table "public"."divisions" add constraint "divisions_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES auth.users(id) not valid;

alter table "public"."divisions" validate constraint "divisions_manager_id_fkey";

alter table "public"."divisions" add constraint "divisions_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES businesses(id) not valid;

alter table "public"."divisions" validate constraint "divisions_organization_id_fkey";

alter table "public"."divisions" add constraint "divisions_parent_division_id_fkey" FOREIGN KEY (parent_division_id) REFERENCES divisions(id) not valid;

alter table "public"."divisions" validate constraint "divisions_parent_division_id_fkey";

alter table "public"."divisions" add constraint "divisions_short_code_organization_id_key" UNIQUE using index "divisions_short_code_organization_id_key";

alter table "public"."divisions" add constraint "divisions_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."divisions" validate constraint "divisions_updated_by_fkey";

alter table "public"."users" add constraint "users_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_created_by_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_updated_by_fkey";

alter table "public"."users" add constraint "users_user_type_check" CHECK ((user_type = ANY (ARRAY['admin'::text, 'internal'::text, 'external'::text]))) not valid;

alter table "public"."users" validate constraint "users_user_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_external_user_associations()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    if new.user_type = 'external' then
        if not exists (select 1 from public.client_users where user_id = new.id) then
            raise exception 'External users must be associated with a client';
        end if;
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.check_internal_user_associations()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    if new.user_type = 'internal' then
        if not exists (select 1 from public.business_users where user_id = new.id) then
            raise exception 'Internal users must be associated with a business';
        end if;
        
        if not exists (select 1 from public.division_users where user_id = new.id) then
            raise exception 'Internal users must be associated with a division';
        end if;
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_business_with_location(business_data jsonb, location_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into public.users (id, full_name, email, is_active, created_at, updated_at)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        true,
        new.created_at,
        new.created_at
    )
    on conflict (id) do update
    set
        email = excluded.email,
        full_name = coalesce(excluded.full_name, users.full_name),
        updated_at = now();
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_required_association_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    -- Check if this is the user's last client association (for external users)
    if exists (
        select 1 from public.users 
        where id = old.user_id 
        and user_type = 'external'
        and not exists (
            select 1 from public.client_users 
            where user_id = old.user_id 
            and id != old.id
        )
    ) then
        raise exception 'Cannot remove the last client association from an external user';
    end if;
    
    return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_business_logos()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

grant delete on table "public"."business_contacts" to "anon";

grant insert on table "public"."business_contacts" to "anon";

grant references on table "public"."business_contacts" to "anon";

grant select on table "public"."business_contacts" to "anon";

grant trigger on table "public"."business_contacts" to "anon";

grant truncate on table "public"."business_contacts" to "anon";

grant update on table "public"."business_contacts" to "anon";

grant delete on table "public"."business_contacts" to "authenticated";

grant insert on table "public"."business_contacts" to "authenticated";

grant references on table "public"."business_contacts" to "authenticated";

grant select on table "public"."business_contacts" to "authenticated";

grant trigger on table "public"."business_contacts" to "authenticated";

grant truncate on table "public"."business_contacts" to "authenticated";

grant update on table "public"."business_contacts" to "authenticated";

grant delete on table "public"."business_contacts" to "service_role";

grant insert on table "public"."business_contacts" to "service_role";

grant references on table "public"."business_contacts" to "service_role";

grant select on table "public"."business_contacts" to "service_role";

grant trigger on table "public"."business_contacts" to "service_role";

grant truncate on table "public"."business_contacts" to "service_role";

grant update on table "public"."business_contacts" to "service_role";

grant delete on table "public"."business_locations" to "anon";

grant insert on table "public"."business_locations" to "anon";

grant references on table "public"."business_locations" to "anon";

grant select on table "public"."business_locations" to "anon";

grant trigger on table "public"."business_locations" to "anon";

grant truncate on table "public"."business_locations" to "anon";

grant update on table "public"."business_locations" to "anon";

grant delete on table "public"."business_locations" to "authenticated";

grant insert on table "public"."business_locations" to "authenticated";

grant references on table "public"."business_locations" to "authenticated";

grant select on table "public"."business_locations" to "authenticated";

grant trigger on table "public"."business_locations" to "authenticated";

grant truncate on table "public"."business_locations" to "authenticated";

grant update on table "public"."business_locations" to "authenticated";

grant delete on table "public"."business_locations" to "service_role";

grant insert on table "public"."business_locations" to "service_role";

grant references on table "public"."business_locations" to "service_role";

grant select on table "public"."business_locations" to "service_role";

grant trigger on table "public"."business_locations" to "service_role";

grant truncate on table "public"."business_locations" to "service_role";

grant update on table "public"."business_locations" to "service_role";

grant delete on table "public"."business_users" to "anon";

grant insert on table "public"."business_users" to "anon";

grant references on table "public"."business_users" to "anon";

grant select on table "public"."business_users" to "anon";

grant trigger on table "public"."business_users" to "anon";

grant truncate on table "public"."business_users" to "anon";

grant update on table "public"."business_users" to "anon";

grant delete on table "public"."business_users" to "authenticated";

grant insert on table "public"."business_users" to "authenticated";

grant references on table "public"."business_users" to "authenticated";

grant select on table "public"."business_users" to "authenticated";

grant trigger on table "public"."business_users" to "authenticated";

grant truncate on table "public"."business_users" to "authenticated";

grant update on table "public"."business_users" to "authenticated";

grant delete on table "public"."business_users" to "service_role";

grant insert on table "public"."business_users" to "service_role";

grant references on table "public"."business_users" to "service_role";

grant select on table "public"."business_users" to "service_role";

grant trigger on table "public"."business_users" to "service_role";

grant truncate on table "public"."business_users" to "service_role";

grant update on table "public"."business_users" to "service_role";

grant delete on table "public"."businesses" to "anon";

grant insert on table "public"."businesses" to "anon";

grant references on table "public"."businesses" to "anon";

grant select on table "public"."businesses" to "anon";

grant trigger on table "public"."businesses" to "anon";

grant truncate on table "public"."businesses" to "anon";

grant update on table "public"."businesses" to "anon";

grant delete on table "public"."businesses" to "authenticated";

grant insert on table "public"."businesses" to "authenticated";

grant references on table "public"."businesses" to "authenticated";

grant select on table "public"."businesses" to "authenticated";

grant trigger on table "public"."businesses" to "authenticated";

grant truncate on table "public"."businesses" to "authenticated";

grant update on table "public"."businesses" to "authenticated";

grant delete on table "public"."businesses" to "service_role";

grant insert on table "public"."businesses" to "service_role";

grant references on table "public"."businesses" to "service_role";

grant select on table "public"."businesses" to "service_role";

grant trigger on table "public"."businesses" to "service_role";

grant truncate on table "public"."businesses" to "service_role";

grant update on table "public"."businesses" to "service_role";

grant delete on table "public"."client_users" to "anon";

grant insert on table "public"."client_users" to "anon";

grant references on table "public"."client_users" to "anon";

grant select on table "public"."client_users" to "anon";

grant trigger on table "public"."client_users" to "anon";

grant truncate on table "public"."client_users" to "anon";

grant update on table "public"."client_users" to "anon";

grant delete on table "public"."client_users" to "authenticated";

grant insert on table "public"."client_users" to "authenticated";

grant references on table "public"."client_users" to "authenticated";

grant select on table "public"."client_users" to "authenticated";

grant trigger on table "public"."client_users" to "authenticated";

grant truncate on table "public"."client_users" to "authenticated";

grant update on table "public"."client_users" to "authenticated";

grant delete on table "public"."client_users" to "service_role";

grant insert on table "public"."client_users" to "service_role";

grant references on table "public"."client_users" to "service_role";

grant select on table "public"."client_users" to "service_role";

grant trigger on table "public"."client_users" to "service_role";

grant truncate on table "public"."client_users" to "service_role";

grant update on table "public"."client_users" to "service_role";

grant delete on table "public"."clients" to "anon";

grant insert on table "public"."clients" to "anon";

grant references on table "public"."clients" to "anon";

grant select on table "public"."clients" to "anon";

grant trigger on table "public"."clients" to "anon";

grant truncate on table "public"."clients" to "anon";

grant update on table "public"."clients" to "anon";

grant delete on table "public"."clients" to "authenticated";

grant insert on table "public"."clients" to "authenticated";

grant references on table "public"."clients" to "authenticated";

grant select on table "public"."clients" to "authenticated";

grant trigger on table "public"."clients" to "authenticated";

grant truncate on table "public"."clients" to "authenticated";

grant update on table "public"."clients" to "authenticated";

grant delete on table "public"."clients" to "service_role";

grant insert on table "public"."clients" to "service_role";

grant references on table "public"."clients" to "service_role";

grant select on table "public"."clients" to "service_role";

grant trigger on table "public"."clients" to "service_role";

grant truncate on table "public"."clients" to "service_role";

grant update on table "public"."clients" to "service_role";

grant delete on table "public"."division_users" to "anon";

grant insert on table "public"."division_users" to "anon";

grant references on table "public"."division_users" to "anon";

grant select on table "public"."division_users" to "anon";

grant trigger on table "public"."division_users" to "anon";

grant truncate on table "public"."division_users" to "anon";

grant update on table "public"."division_users" to "anon";

grant delete on table "public"."division_users" to "authenticated";

grant insert on table "public"."division_users" to "authenticated";

grant references on table "public"."division_users" to "authenticated";

grant select on table "public"."division_users" to "authenticated";

grant trigger on table "public"."division_users" to "authenticated";

grant truncate on table "public"."division_users" to "authenticated";

grant update on table "public"."division_users" to "authenticated";

grant delete on table "public"."division_users" to "service_role";

grant insert on table "public"."division_users" to "service_role";

grant references on table "public"."division_users" to "service_role";

grant select on table "public"."division_users" to "service_role";

grant trigger on table "public"."division_users" to "service_role";

grant truncate on table "public"."division_users" to "service_role";

grant update on table "public"."division_users" to "service_role";

grant delete on table "public"."divisions" to "anon";

grant insert on table "public"."divisions" to "anon";

grant references on table "public"."divisions" to "anon";

grant select on table "public"."divisions" to "anon";

grant trigger on table "public"."divisions" to "anon";

grant truncate on table "public"."divisions" to "anon";

grant update on table "public"."divisions" to "anon";

grant delete on table "public"."divisions" to "authenticated";

grant insert on table "public"."divisions" to "authenticated";

grant references on table "public"."divisions" to "authenticated";

grant select on table "public"."divisions" to "authenticated";

grant trigger on table "public"."divisions" to "authenticated";

grant truncate on table "public"."divisions" to "authenticated";

grant update on table "public"."divisions" to "authenticated";

grant delete on table "public"."divisions" to "service_role";

grant insert on table "public"."divisions" to "service_role";

grant references on table "public"."divisions" to "service_role";

grant select on table "public"."divisions" to "service_role";

grant trigger on table "public"."divisions" to "service_role";

grant truncate on table "public"."divisions" to "service_role";

grant update on table "public"."divisions" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable insert for authenticated users"
on "public"."business_contacts"
as permissive
for insert
to authenticated
with check ((auth.uid() = created_by));


create policy "Enable read access for authenticated users"
on "public"."business_contacts"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for business owners"
on "public"."business_contacts"
as permissive
for update
to authenticated
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));


create policy "Admin and internal users full access"
on "public"."business_locations"
as permissive
for all
to authenticated
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])))
with check (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "Allow internal users to create locations"
on "public"."business_locations"
as permissive
for insert
to authenticated
with check (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "Allow read access for authenticated users"
on "public"."business_locations"
as permissive
for select
to authenticated
using (true);


create policy "Allow update for business owners and admins"
on "public"."business_locations"
as permissive
for update
to authenticated
using ((((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])) OR (auth.uid() = created_by)))
with check ((((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])) OR (auth.uid() = created_by)));


create policy "Authenticated users full access to business_locations"
on "public"."business_locations"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "External users can manage their business locations"
on "public"."business_locations"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (business_users bu
     JOIN users u ON ((u.id = bu.user_id)))
  WHERE ((bu.business_id = business_locations.business_id) AND (bu.user_id = auth.uid()) AND (u.user_type = 'external'::text)))))
with check ((EXISTS ( SELECT 1
   FROM (business_users bu
     JOIN users u ON ((u.id = bu.user_id)))
  WHERE ((bu.business_id = business_locations.business_id) AND (bu.user_id = auth.uid()) AND (u.user_type = 'external'::text)))));


create policy "Admin and internal users full access to business_users"
on "public"."business_users"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "Authenticated users full access to business_users"
on "public"."business_users"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Internal users can view their own business associations"
on "public"."business_users"
as permissive
for select
to public
using (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.user_type = 'internal'::text))))));


create policy "Only admins can manage business users"
on "public"."business_users"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = 'admin'::text));


create policy "Users can view their own business associations"
on "public"."business_users"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Admin and internal users full access to businesses"
on "public"."businesses"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "Authenticated users full access to businesses"
on "public"."businesses"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Admin and internal users full access to client_users"
on "public"."client_users"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "External users can view their own client associations"
on "public"."client_users"
as permissive
for select
to public
using (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.user_type = 'external'::text))))));


create policy "Only admins can manage client users"
on "public"."client_users"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = 'admin'::text));


create policy "Users can view their own client associations"
on "public"."client_users"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Admin and internal users full access to clients"
on "public"."clients"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "External users can view their associated clients"
on "public"."clients"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (client_users cu
     JOIN users u ON ((u.id = cu.user_id)))
  WHERE ((cu.client_id = clients.id) AND (cu.user_id = auth.uid()) AND (u.user_type = 'external'::text)))));


create policy "Admin and internal users full access to division_users"
on "public"."division_users"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "Users can view their own division associations"
on "public"."division_users"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Admin and internal users full access to divisions"
on "public"."divisions"
as permissive
for all
to public
using (((auth.jwt() ->> 'user_type'::text) = ANY (ARRAY['admin'::text, 'internal'::text])));


create policy "Authenticated users full access to users"
on "public"."users"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Only admins can insert users"
on "public"."users"
as permissive
for insert
to public
with check (((auth.jwt() ->> 'user_type'::text) = 'admin'::text));


create policy "Only admins can update users"
on "public"."users"
as permissive
for update
to public
using (((auth.jwt() ->> 'user_type'::text) = 'admin'::text));


create policy "Users can view their own data"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER business_logos_validation BEFORE INSERT OR UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION validate_business_logos();

CREATE TRIGGER prevent_client_association_deletion BEFORE DELETE ON public.client_users FOR EACH ROW EXECUTE FUNCTION prevent_required_association_deletion();

CREATE TRIGGER enforce_external_user_associations AFTER INSERT OR UPDATE ON public.users FOR EACH ROW WHEN ((new.user_type = 'external'::text)) EXECUTE FUNCTION check_external_user_associations();

CREATE TRIGGER enforce_internal_user_associations AFTER INSERT OR UPDATE ON public.users FOR EACH ROW WHEN ((new.user_type = 'internal'::text)) EXECUTE FUNCTION check_internal_user_associations();


