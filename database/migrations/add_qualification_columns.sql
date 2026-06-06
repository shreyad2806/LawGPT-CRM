-- Add qualification_reason column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS qualification_reason JSONB;

-- Add confidence column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS confidence INTEGER;

-- Add index on confidence for sorting
CREATE INDEX IF NOT EXISTS idx_leads_confidence ON leads (confidence);
