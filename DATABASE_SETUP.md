# Database Setup Guide

## Prerequisites
- Supabase account and project
- Environment variables configured in `.env.local`

## Step 1: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" tab
3. Copy and paste the contents of `migrations/001_init_tables.sql`
4. Run the SQL script to create all necessary tables

## Step 2: Create Storage Bucket (Optional)

If you want to use Supabase Storage for image uploads:

1. Go to your Supabase project dashboard
2. Navigate to the "Storage" tab
3. Create a new bucket named `images`
4. Make the bucket public:
   - Go to bucket settings
   - Set "Public bucket" to enabled
   - Or add a policy to allow public read access

If you skip this step, the app will fall back to storing images as base64 strings in the database.

## Step 3: Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DB_URL=your_supabase_database_url
```

## Step 4: Test the Application

1. Run the development server: `npm run dev`
2. Navigate to `/dashboard/listings/new`
3. Try creating a new listing with an image
4. Check if the listing appears in `/dashboard/listings`

## Troubleshooting

### Database Connection Issues
- Verify your Supabase credentials
- Check if the database URL includes the correct password and connection parameters
- Ensure your IP is whitelisted in Supabase if using IP restrictions

### Image Upload Issues
- If using Supabase Storage, ensure the `images` bucket exists and is public
- If images aren't displaying, check the browser console for errors
- Large base64 images might cause database size issues - consider using Supabase Storage instead

### RLS (Row Level Security) Issues
- If you can't access data, you might need to adjust the RLS policies
- For development, you can temporarily disable RLS on tables if needed
- Make sure authentication is working correctly

## Database Schema Overview

The main tables created:
- `users`: User accounts and profiles
- `listings`: Waste listings with image support
- `interests`: Buyer interest in listings
- `messages`: User-to-user messaging
- `reviews`: User reviews and ratings
- `transactions`: Transaction records
- `notifications`: User notifications
- `analytics`: Usage analytics

All tables use UUID primary keys and include `created_at` and `updated_at` timestamps.
