-- Add recommended_action column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS recommended_action VARCHAR(100);

-- Add recommended_action column to engagement_logs table
ALTER TABLE engagement_logs ADD COLUMN IF NOT EXISTS recommended_action VARCHAR(100);

-- Add index on recommended_action for leads table (optional, for filtering by action)
CREATE INDEX IF NOT EXISTS idx_leads_recommended_action ON leads (recommended_action);
