-- =========================================================
-- LawGPT CRM & Marketing Automation System
-- Production Schema - Complete Canonical Definition
-- =========================================================
-- This schema recreates the entire project from scratch
-- Includes all tables, indexes, constraints, foreign keys, and triggers
-- =========================================================

-- =========================================================
-- ENUM TYPES
-- =========================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM (
      'new',
      'contacted',
      'qualified',
      'closed'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE content_status AS ENUM (
      'draft',
      'approved',
      'rejected',
      'posted'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_feedback') THEN
    CREATE TYPE content_feedback AS ENUM (
      'weak_hook',
      'weak_cta',
      'too_generic',
      'too_long',
      'low_quality',
      'needs_rewrite',
      'approved',
      'none'
    );
  END IF;
END $$;

-- =========================================================
-- TABLES
-- =========================================================

-- -----------------------------
-- 1) trends
-- AI Trend Analysis System
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.trends (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  title TEXT NOT NULL,
  source TEXT,
  url TEXT,
  category TEXT,
  
  trend_score NUMERIC,
  ai_relevance_score NUMERIC,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS trends_trend_score_idx ON public.trends(trend_score DESC);
CREATE INDEX IF NOT EXISTS trends_url_idx ON public.trends(url);
CREATE INDEX IF NOT EXISTS trends_title_idx ON public.trends(title);

-- Constraints
ALTER TABLE public.trends
  ADD CONSTRAINT trends_trend_score_non_negative
  CHECK (trend_score IS NULL OR trend_score >= 0);

ALTER TABLE public.trends
  ADD CONSTRAINT trends_ai_relevance_score_non_negative
  CHECK (ai_relevance_score IS NULL OR ai_relevance_score >= 0);

-- -----------------------------
-- 2) content_queue
-- AI Content Generation System
-- Content Publishing Engine
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.content_queue (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  trend_id BIGINT NOT NULL
    REFERENCES public.trends(id)
    ON DELETE CASCADE,
  
  generated_post TEXT,
  hook TEXT,
  cta TEXT,
  
  status content_status NOT NULL DEFAULT 'draft',
  
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  posted BOOLEAN NOT NULL DEFAULT FALSE,
  
  engagement_score NUMERIC,
  feedback content_feedback NOT NULL DEFAULT 'none',
  
  published_message TEXT,
  
  -- Infographic columns
  image_url TEXT,
  infographic_prompt TEXT,
  infographic_url TEXT,
  image_generated_at TIMESTAMPTZ,
  
  -- Payload for additional data
  payload JSONB,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS content_queue_trend_id_idx ON public.content_queue(trend_id);
CREATE INDEX IF NOT EXISTS content_queue_status_idx ON public.content_queue(status);
CREATE INDEX IF NOT EXISTS content_queue_image_generated_at_idx ON public.content_queue(image_generated_at DESC);
CREATE INDEX IF NOT EXISTS content_queue_infographic_url_idx ON public.content_queue(infographic_url);

-- Constraints
ALTER TABLE public.content_queue
  ADD CONSTRAINT content_queue_engagement_score_non_negative
  CHECK (engagement_score IS NULL OR engagement_score >= 0);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_content_queue_updated_at ON public.content_queue;

CREATE TRIGGER trigger_content_queue_updated_at
BEFORE UPDATE ON public.content_queue
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------
-- 3) leads
-- CRM Lead Capture System
-- Lead Scoring Engine
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  name TEXT,
  email TEXT,
  company TEXT,
  message TEXT,
  
  source TEXT,
  
  lead_score NUMERIC,
  lead_category TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  
  -- Qualification columns
  priority VARCHAR(20),
  qualification_reason JSONB,
  confidence INTEGER,
  recommended_action VARCHAR(100),
  score_reason JSONB,
  tags JSONB,
  reason TEXT,
  
  -- Additional qualification fields
  qualification_score INTEGER,
  qualification_status VARCHAR(50),
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique_idx 
  ON public.leads(email) 
  WHERE email IS NOT NULL;
  
CREATE INDEX IF NOT EXISTS leads_priority_idx ON public.leads(priority);
CREATE INDEX IF NOT EXISTS leads_confidence_idx ON public.leads(confidence);
CREATE INDEX IF NOT EXISTS leads_recommended_action_idx ON public.leads(recommended_action);
CREATE INDEX IF NOT EXISTS leads_score_reason_idx ON public.leads USING GIN (score_reason);
CREATE INDEX IF NOT EXISTS leads_tags_idx ON public.leads USING GIN (tags);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_lead_score_idx ON public.leads(lead_score DESC);

-- Constraints
ALTER TABLE public.leads
  ADD CONSTRAINT leads_lead_score_non_negative
  CHECK (lead_score IS NULL OR lead_score >= 0);

ALTER TABLE public.leads
  ADD CONSTRAINT leads_confidence_range
  CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 100));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;

CREATE TRIGGER trigger_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------
-- 4) engagement_logs
-- Engagement Tracking System
-- Follow-Up Automation (uses engagement signals)
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.engagement_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT NOT NULL
    REFERENCES public.leads(id)
    ON DELETE CASCADE,
  
  content_id BIGINT
    REFERENCES public.content_queue(id)
    ON DELETE SET NULL,
  
  platform TEXT,
  action TEXT,
  
  likes INTEGER,
  comments INTEGER,
  impressions INTEGER,
  shares INTEGER,
  
  -- AI Analysis columns
  intent TEXT,
  lead_score INTEGER,
  lead_quality VARCHAR(20),
  score_reason JSONB,
  ai_summary TEXT,
  recommended_action VARCHAR(100),
  qualification_reason JSONB,
  confidence INTEGER,
  tags JSONB,
  
  -- Additional fields
  person_name TEXT,
  company TEXT,
  role TEXT,
  message TEXT,
  source TEXT,
  engagement_type TEXT,
  converted_to_lead BOOLEAN DEFAULT FALSE,
  
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS engagement_logs_lead_id_idx ON public.engagement_logs(lead_id);
CREATE INDEX IF NOT EXISTS engagement_logs_content_id_idx ON public.engagement_logs(content_id);
CREATE INDEX IF NOT EXISTS engagement_logs_timestamp_idx ON public.engagement_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS engagement_logs_platform_idx ON public.engagement_logs(platform);
CREATE INDEX IF NOT EXISTS engagement_logs_source_idx ON public.engagement_logs(source);

-- -----------------------------
-- 5) lead_followups
-- Follow-Up Management System
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.lead_followups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT NOT NULL 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
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

-- Indexes
CREATE INDEX IF NOT EXISTS lead_followups_lead_id_idx ON public.lead_followups(lead_id);
CREATE INDEX IF NOT EXISTS lead_followups_status_idx ON public.lead_followups(status);
CREATE INDEX IF NOT EXISTS lead_followups_scheduled_date_idx ON public.lead_followups(scheduled_date);
CREATE INDEX IF NOT EXISTS lead_followups_priority_idx ON public.lead_followups(priority);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_lead_followups_updated_at ON public.lead_followups;

CREATE TRIGGER trigger_lead_followups_updated_at
BEFORE UPDATE ON public.lead_followups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------
-- 6) conversation_memory
-- SDR Memory System - Conversation History
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.conversation_memory (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT NOT NULL 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
  followup_id BIGINT 
    REFERENCES public.lead_followups(id) 
    ON DELETE SET NULL,
  
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS conversation_memory_lead_id_idx ON public.conversation_memory(lead_id);
CREATE INDEX IF NOT EXISTS conversation_memory_followup_id_idx ON public.conversation_memory(followup_id);
CREATE INDEX IF NOT EXISTS conversation_memory_timestamp_idx ON public.conversation_memory(timestamp DESC);

-- -----------------------------
-- 7) memory_events
-- SDR Memory System - Memory Events
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.memory_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT NOT NULL 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  value TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS memory_events_lead_id_idx ON public.memory_events(lead_id);
CREATE INDEX IF NOT EXISTS memory_events_event_type_idx ON public.memory_events(event_type);
CREATE INDEX IF NOT EXISTS memory_events_created_at_idx ON public.memory_events(created_at DESC);

-- -----------------------------
-- 8) lead_memory_summary
-- SDR Memory System - Lead Intelligence Summary
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.lead_memory_summary (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT NOT NULL 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
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

-- Indexes
CREATE INDEX IF NOT EXISTS lead_memory_summary_lead_id_idx ON public.lead_memory_summary(lead_id);

-- -----------------------------
-- 9) lead_activity
-- Activity Tracking System
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.lead_activity (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT NOT NULL 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
  activity_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lead_activity_lead_id ON public.lead_activity(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activity_created_at ON public.lead_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activity_activity_type ON public.lead_activity(activity_type);

-- -----------------------------
-- 10) notifications
-- Notification System
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS notifications_lead_id_idx ON public.notifications(lead_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- -----------------------------
-- 11) workflow_runs
-- Workflow Execution Logging
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT 
    REFERENCES public.leads(id) 
    ON DELETE CASCADE,
  
  action_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS workflow_runs_lead_id_idx ON public.workflow_runs(lead_id);
CREATE INDEX IF NOT EXISTS workflow_runs_action_type_idx ON public.workflow_runs(action_type);
CREATE INDEX IF NOT EXISTS workflow_runs_created_at_idx ON public.workflow_runs(created_at DESC);

-- -----------------------------
-- 12) agent_logs
-- Agent Execution Logging
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  agent_name TEXT,
  event TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS agent_logs_agent_name_idx ON public.agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS agent_logs_created_at_idx ON public.agent_logs(created_at DESC);

-- -----------------------------
-- 13) agent_memory
-- Agent State Management
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.agent_memory (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  agent_name TEXT,
  state JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS agent_memory_agent_name_idx ON public.agent_memory(agent_name);

-- -----------------------------
-- 14) crm_memory
-- CRM Learning System
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.crm_memory (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  lead_id BIGINT 
    REFERENCES public.leads(id) 
    ON DELETE SET NULL,
  
  category TEXT NOT NULL,
  context TEXT,
  strategy_details JSONB,
  success_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS crm_memory_category_idx ON public.crm_memory(category);
CREATE INDEX IF NOT EXISTS crm_memory_lead_id_idx ON public.crm_memory(lead_id);

-- -----------------------------
-- 15) strategy_memory
-- Strategy Storage System
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.strategy_memory (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  strategy_name TEXT,
  strategy_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS strategy_memory_strategy_name_idx ON public.strategy_memory(strategy_name);

-- -----------------------------
-- 16) agent_execution_history
-- Agent Execution Tracking
-- -----------------------------
CREATE TABLE IF NOT EXISTS public.agent_execution_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  agent_name TEXT,
  event TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS agent_execution_history_agent_name_idx ON public.agent_execution_history(agent_name);
CREATE INDEX IF NOT EXISTS agent_execution_history_created_at_idx ON public.agent_execution_history(created_at DESC);

-- =========================================================
-- END OF PRODUCTION SCHEMA
-- =========================================================
