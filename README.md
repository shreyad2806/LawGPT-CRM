# LawGPT CRM & Marketing Automation System — V1

Internal CRM and marketing automation system built for LawGPT using n8n, Supabase, OpenAI, and Next.js.

---

## Current V1 Progress

### Completed Systems

#### 1. Trend Automation Workflow

* Fetches RSS/news feeds
* Performs AI-based trend analysis
* Generates LinkedIn content using OpenAI
* Stores generated content in Supabase

---

#### 2. Content Publishing Workflow

* Fetches content from content queue
* Simulates publishing flow
* Updates publishing status in database

---

#### 3. Lead Capture & Scoring System

* Frontend lead capture form built using v0/Next.js
* Webhook integration with n8n
* Stores leads in Supabase
* Rule-based lead scoring engine
* Lead categorization:

  * Cold
  * Warm
  * Hot
  * High Intent

---

#### 4. Follow-Up Automation Workflow

* Automatically triggers for high-intent leads
* Sends follow-up emails
* Sends founder notification emails
* Updates CRM lead status

---

# System Architecture

![Uploading Gemini_Generated_Image_f9n54uf9n54uf9n5.png…]()

---

# Tech Stack

* n8n
* Supabase
* OpenAI API
* Next.js / v0
* Gmail Automation

---

# Database Tables

* trends
* content_queue
* leads
* engagement_logs

---

# V2 Planned Improvements

Real LinkedIn publishing integration
Improved AI-generated content quality
AI-generated visual/social media content
Better CRM dashboard UI
AI-based lead qualification

---

# Files Included

* n8n workflow JSON files
* frontend form code
* database schema
* screenshots
