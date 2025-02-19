-- Function to sync auth.users to public.users
create or replace function public.handle_auth_user_created()
returns trigger as $$
begin
    insert into public.users (id, full_name, email, is_active, created_at, updated_at)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        true,
        new.created_at,
        new.created_at
    )
    on conflict (id) do update
    set
        email = excluded.email,
        updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for syncing new auth users
create trigger on_auth_user_created
    after insert or update on auth.users
    for each row execute procedure public.handle_auth_user_created();
