-- Add infographic columns to content_queue table
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS infographic_prompt TEXT;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMPTZ;

-- Add index on image_generated_at for sorting
CREATE INDEX IF NOT EXISTS idx_content_queue_image_generated_at ON content_queue(image_generated_at);
