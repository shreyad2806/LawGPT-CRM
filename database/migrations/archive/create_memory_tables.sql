-- =========================================================
-- SDR Memory Tables Migration
-- =========================================================

-- 1. Lead Memory Summary Table
CREATE TABLE IF NOT EXISTS public.lead_memory_summary (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    summary TEXT,
    buying_intent TEXT,
    urgency TEXT,
    pain_point TEXT,
    objection TEXT,
    decision_maker TEXT,
    budget TEXT,
    preferred_communication TEXT,
    last_action TEXT,
    next_action TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_memory_summary_lead_id_idx ON public.lead_memory_summary(lead_id);

-- 2. Memory Events Table
CREATE TABLE IF NOT EXISTS public.memory_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    value TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS memory_events_lead_id_idx ON public.memory_events(lead_id);
CREATE INDEX IF NOT EXISTS memory_events_event_type_idx ON public.memory_events(event_type);
