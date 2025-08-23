-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  role text not null check (role in ('user', 'assistant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create RLS policies for messages
create policy "messages_select_own"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "messages_update_own"
  on public.messages for update
  using (auth.uid() = user_id);

create policy "messages_delete_own"
  on public.messages for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists messages_conversation_id_created_at_idx 
  on public.messages (conversation_id, created_at asc);

create index if not exists messages_user_id_idx 
  on public.messages (user_id);
