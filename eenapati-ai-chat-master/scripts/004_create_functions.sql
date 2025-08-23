-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_conversations_updated_at on public.conversations;
create trigger update_conversations_updated_at
  before update on public.conversations
  for each row
  execute function public.update_updated_at_column();

-- Function to auto-update conversation title based on first message
create or replace function public.update_conversation_title()
returns trigger as $$
begin
  -- Only update title for the first user message in a conversation
  if new.role = 'user' and not exists (
    select 1 from public.messages 
    where conversation_id = new.conversation_id 
    and role = 'user' 
    and id != new.id
  ) then
    update public.conversations 
    set title = case 
      when length(new.content) > 50 then left(new.content, 47) || '...'
      else new.content
    end
    where id = new.conversation_id;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger for auto-updating conversation titles
drop trigger if exists update_conversation_title_trigger on public.messages;
create trigger update_conversation_title_trigger
  after insert on public.messages
  for each row
  execute function public.update_conversation_title();
