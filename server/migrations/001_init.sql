create table guestbook_entries (
  id serial primary key,
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);
