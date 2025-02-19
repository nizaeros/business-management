-- Drop the foreign key constraint temporarily
alter table public.users drop constraint users_created_by_fkey;
alter table public.users drop constraint users_updated_by_fkey;

-- Modify the users table to make email field available
alter table public.users add column if not exists email text;

-- Recreate the function with better error handling
create or replace function public.handle_auth_user_created()
returns trigger as $$
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
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert or update on auth.users
    for each row execute procedure public.handle_auth_user_created();

-- Add the foreign key constraints back
alter table public.users 
    add constraint users_created_by_fkey 
    foreign key (created_by) 
    references auth.users(id);

alter table public.users 
    add constraint users_updated_by_fkey 
    foreign key (updated_by) 
    references auth.users(id);
