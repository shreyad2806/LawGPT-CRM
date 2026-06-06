-- Add priority column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS priority VARCHAR(20);

-- Add index on priority for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads (priority);

-- Update existing leads to auto-calculate priority based on lead_score
UPDATE leads 
SET priority = CASE 
    WHEN lead_score > 80 THEN 'Hot'
    WHEN lead_score >= 60 THEN 'Warm'
    ELSE 'Cold'
END
WHERE priority IS NULL;
