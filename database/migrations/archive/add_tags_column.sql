-- Add tags column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags JSONB;

-- Add GIN index on tags for efficient filtering
CREATE INDEX IF NOT EXISTS idx_leads_tags ON leads USING GIN (tags);
