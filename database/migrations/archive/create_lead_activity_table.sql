-- Create lead_activity table
CREATE TABLE IF NOT EXISTS lead_activity (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on lead_id for faster queries
CREATE INDEX IF NOT EXISTS idx_lead_activity_lead_id ON lead_activity(lead_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_lead_activity_created_at ON lead_activity(created_at DESC);

-- Create index on activity_type for filtering
CREATE INDEX IF NOT EXISTS idx_lead_activity_activity_type ON lead_activity(activity_type);
