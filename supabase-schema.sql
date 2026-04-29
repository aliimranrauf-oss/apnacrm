-- ============================================
-- ApnaCRM - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
create table if not exists public.customers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text,
  source text check (source in ('WhatsApp', 'Instagram', 'Other')) default 'WhatsApp',
  status text check (status in ('New Lead', 'Interested', 'Ordered', 'Completed', 'Lost')) default 'New Lead',
  notes text,
  follow_up_date date,
  created_at timestamptz default now() not null
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.customers enable row level security;

-- Users can only see their own customers
create policy "Users can view own customers"
  on public.customers for select
  using (auth.uid() = user_id);

-- Users can insert their own customers
create policy "Users can insert own customers"
  on public.customers for insert
  with check (auth.uid() = user_id);

-- Users can update their own customers
create policy "Users can update own customers"
  on public.customers for update
  using (auth.uid() = user_id);

-- Users can delete their own customers
create policy "Users can delete own customers"
  on public.customers for delete
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES for performance
-- ============================================
create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists customers_status_idx on public.customers(status);
create index if not exists customers_follow_up_date_idx on public.customers(follow_up_date);
create index if not exists customers_created_at_idx on public.customers(created_at desc);
