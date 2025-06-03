-- Migration to add image column to listings table
-- Run this SQL command in your Supabase SQL editor or database client

-- Add image column to store a single image URL
ALTER TABLE listings ADD COLUMN IF NOT EXISTS image TEXT;

-- Add images column to store multiple image URLs (for future use)
-- ALTER TABLE listings ADD COLUMN IF NOT EXISTS images TEXT[];

-- Index for better performance when filtering by image presence
CREATE INDEX IF NOT EXISTS idx_listings_image ON listings(image) WHERE image IS NOT NULL;

-- Update any existing records to have empty image field
UPDATE listings SET image = NULL WHERE image IS NULL;
