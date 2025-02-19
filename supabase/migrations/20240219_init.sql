-- Create users table with RLS
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  user_type text not null check (user_type in ('admin', 'internal', 'external')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create secure policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Admin users can view all data" on public.users
  for all using (
    exists (
      select 1 from public.users where id = auth.uid() and user_type = 'admin'
    )
  );

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, user_type)
  values (new.id, new.email, 'external');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
