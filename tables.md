create table public.users (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  password text not null,
  role text not null,
  "createdAt" timestamp with time zone not null default now(),
  "updatedAt" timestamp with time zone not null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_role_check check (
    (role = any (array['seller'::text, 'buyer'::text]))
  )
) TABLESPACE pg_default;

create table public.listings (
  id serial not null,
  "sellerId" uuid not null,
  title text not null,
  description text not null,
  "wasteType" text not null,
  subtype text not null,
  quantity numeric not null,
  unit text not null,
  price numeric not null,
  location text not null,
  status text not null default 'active'::text,
  "createdAt" timestamp without time zone null default now(),
  "updatedAt" timestamp without time zone null default now(),
  "contactNumber" character varying(10) null,
  image text null,
  constraint listings_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_listings_image on public.listings using btree (image) TABLESPACE pg_default
where
  (image is not null);

create table public.contact_messages (
  id serial not null,
  full_name text not null,
  email text not null,
  inquiry_type text not null,
  subject text not null,
  message text not null,
  created_at timestamp without time zone null default now(),
  constraint contact_messages_pkey primary key (id)
) TABLESPACE pg_default;