-- =========================================================
-- SDR Assistant Tables Migration
-- =========================================================

-- 1. Conversation Memory Table
CREATE TABLE IF NOT EXISTS public.conversation_memory (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    followup_id BIGINT REFERENCES public.lead_followups(id) ON DELETE SET NULL,
    sender TEXT NOT NULL,          -- e.g., 'Lead', 'Agent', 'AI'
    message TEXT NOT NULL,
    type TEXT NOT NULL,            -- e.g., 'email', 'linkedin_dm', 'note', 'sms'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversation_memory_lead_id_idx ON public.conversation_memory(lead_id);
CREATE INDEX IF NOT EXISTS conversation_memory_followup_id_idx ON public.conversation_memory(followup_id);


-- 2. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT REFERENCES public.leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT NOT NULL,            -- e.g., 'overdue', 'high_intent', 'demo_scheduled', 'critical'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_lead_id_idx ON public.notifications(lead_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);


-- 3. Workflow Runs Table
CREATE TABLE IF NOT EXISTS public.workflow_runs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT REFERENCES public.leads(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,     -- e.g., 'generate_reply', 'recalculate_priority', 'recommendation'
    input_data JSONB,
    output_data JSONB,
    status TEXT DEFAULT 'success', -- 'success', 'failed', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workflow_runs_lead_id_idx ON public.workflow_runs(lead_id);
CREATE INDEX IF NOT EXISTS workflow_runs_action_type_idx ON public.workflow_runs(action_type);


-- 4. CRM Memory Table (for persistent learnings)
CREATE TABLE IF NOT EXISTS public.crm_memory (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT REFERENCES public.leads(id) ON DELETE SET NULL,
    category TEXT NOT NULL,        -- e.g., 'best_timing', 'reply_style', 'conversion_pattern'
    context TEXT,
    strategy_details JSONB,
    success_score NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS crm_memory_category_idx ON public.crm_memory(category);
