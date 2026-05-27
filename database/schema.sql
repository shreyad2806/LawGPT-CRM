-- =========================================================
-- LawGPT CRM & Marketing Automation System
-- Consolidated final schema
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

  -- These are included because your table has these columns.
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  posted BOOLEAN NOT NULL DEFAULT FALSE,

  engagement_score NUMERIC,

  feedback content_feedback NOT NULL DEFAULT 'none',

  published_message TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_queue_trend_id_idx
  ON public.content_queue(trend_id);

CREATE INDEX IF NOT EXISTS content_queue_status_idx
  ON public.content_queue(status);

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

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique_idx
  ON public.leads(email)
  WHERE email IS NOT NULL;

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

  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS engagement_logs_lead_id_idx
  ON public.engagement_logs(lead_id);

CREATE INDEX IF NOT EXISTS engagement_logs_content_id_idx
  ON public.engagement_logs(content_id);

CREATE INDEX IF NOT EXISTS engagement_logs_timestamp_idx
  ON public.engagement_logs(timestamp);


ALTER TABLE public.trends
  ADD CONSTRAINT trends_trend_score_non_negative
  CHECK (trend_score IS NULL OR trend_score >= 0);

ALTER TABLE public.trends
  ADD CONSTRAINT trends_ai_relevance_score_non_negative
  CHECK (ai_relevance_score IS NULL OR ai_relevance_score >= 0);

ALTER TABLE public.content_queue
  ADD CONSTRAINT content_queue_engagement_score_non_negative
  CHECK (engagement_score IS NULL OR engagement_score >= 0);

ALTER TABLE public.leads
  ADD CONSTRAINT leads_lead_score_non_negative
  CHECK (lead_score IS NULL OR lead_score >= 0);