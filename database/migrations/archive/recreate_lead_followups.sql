-- =========================================================
-- Recreate lead_followups Table
-- =========================================================

-- Drop the existing table (this will remove all sample data)
DROP TABLE IF EXISTS public.lead_followups CASCADE;

-- Create the new table with updated schema
CREATE TABLE public.lead_followups (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    
    followup_type TEXT,
    status TEXT DEFAULT 'Needs Response',
    priority TEXT DEFAULT 'High',
    
    scheduled_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    
    next_action TEXT,
    ai_generated_message TEXT,
    manual_notes TEXT,
    recommended_action TEXT,
    ai_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for frequent queries
CREATE INDEX IF NOT EXISTS lead_followups_lead_id_idx ON public.lead_followups(lead_id);
CREATE INDEX IF NOT EXISTS lead_followups_status_idx ON public.lead_followups(status);
CREATE INDEX IF NOT EXISTS lead_followups_scheduled_date_idx ON public.lead_followups(scheduled_date);

-- Trigger for automatically updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_lead_followups_updated_at ON public.lead_followups;

CREATE TRIGGER trigger_lead_followups_updated_at
BEFORE UPDATE ON public.lead_followups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
