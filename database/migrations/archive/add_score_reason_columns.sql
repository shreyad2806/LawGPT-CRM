-- Add score_reason column to engagement_logs table
ALTER TABLE engagement_logs ADD COLUMN IF NOT EXISTS score_reason JSONB;

-- Add score_reason column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score_reason JSONB;

-- Add index on score_reason for leads table (optional, for filtering by score reasons)
CREATE INDEX IF NOT EXISTS idx_leads_score_reason ON leads USING GIN (score_reason);
