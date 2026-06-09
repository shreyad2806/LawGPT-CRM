# LawGPT CRM & Marketing Automation System

A comprehensive CRM and marketing automation platform built for LawGPT, featuring AI-powered lead scoring, follow-up automation, content generation, and engagement tracking.

---

## Overview

This system provides:
- **Lead Management**: Capture, score, and qualify leads with AI-powered insights
- **Follow-Up Automation**: Automated follow-up generation with AI-powered replies
- **Content Generation**: AI-powered LinkedIn content creation with infographic generation
- **Engagement Tracking**: Track social media engagements and convert them to leads
- **Analytics Dashboard**: Comprehensive analytics for leads, content, and engagement metrics
- **Memory System**: AI-powered conversation memory and lead intelligence

---

## Tech Stack

### Backend
- **FastAPI**: Python web framework for REST API
- **Supabase**: PostgreSQL database and authentication
- **OpenAI API**: GPT-4o-mini for AI features (reply generation, lead qualification, content generation, vision extraction)
- **Python 3.11+**: Backend runtime

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Axios**: HTTP client for API requests

### Database
- **PostgreSQL**: Primary database (via Supabase)
- **16 Tables**: trends, content_queue, leads, engagement_logs, lead_followups, conversation_memory, memory_events, lead_memory_summary, lead_activity, notifications, workflow_runs, agent_logs, agent_memory, crm_memory, strategy_memory, agent_execution_history

---

## Project Structure

```
LawGPT CRM/
├── backend/                 # FastAPI backend
│   ├── agents/             # AI agents
│   ├── api/                # API endpoints
│   ├── routers/            # Route handlers
│   ├── services/           # Business logic
│   └── main.py             # Application entry point
├── frontend/               # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
├── database/               # Database schema and migrations
│   ├── schema.sql          # Production schema
│   └── migrations/         # Archived migrations
└── docs/                   # Documentation
```

---

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account
- OpenAI API key

### Backend Setup

1. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
cp ../.env.example ../.env
# Edit .env with your credentials
```

4. **Run backend**
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment variables**
```bash
cp ../.env.example ../.env.local
# Edit .env.local with your credentials
```

3. **Run frontend**
```bash
npm run dev
```

---

## Database Setup

### Using Supabase

1. Create a new project in Supabase
2. Run the production schema:
```sql
-- Copy contents of database/schema.sql to Supabase SQL Editor
-- Execute to create all tables, indexes, and constraints
```

3. Set up environment variables with your Supabase credentials

---

## Environment Variables

Required environment variables (see `.env.example`):

```env
# OpenAI API Key (required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# n8n Workflow Integration (optional)
N8N_BASE_URL=https://your-n8n-instance.com

# Environment
NODE_ENV=production
```

---

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/{id}` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PATCH /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead
- `GET /api/leads/search?query={query}` - Search leads

### Follow-ups
- `GET /api/followups` - Get all follow-ups
- `GET /api/followups/{id}` - Get follow-up by ID
- `POST /api/followups` - Create follow-up
- `PATCH /api/followups/{id}` - Update follow-up
- `DELETE /api/followups/{id}` - Delete follow-up
- `POST /api/followups/{id}/generate-reply` - Generate AI reply
- `POST /api/followups/{id}/complete` - Mark follow-up as complete

### Engagement Logs
- `GET /api/engagement-logs` - Get all engagement logs
- `POST /api/engagement-logs` - Create engagement log
- `PATCH /api/engagement-logs/{id}` - Update engagement log
- `DELETE /api/engagement-logs/{id}` - Delete engagement log

### Content
- `GET /api/content` - Get all content
- `POST /api/content` - Create content
- `PATCH /api/content/{id}` - Update content
- `POST /api/content/{id}/generate-infographic` - Generate infographic

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/hashtags` - Get hashtag analytics
- `GET /api/analytics/engagement` - Get engagement analytics

### Memory
- `GET /api/memory/{leadId}` - Get lead memory

---

## Features

### 1. Lead Management
- Capture leads from multiple sources (LinkedIn, email, manual)
- AI-powered lead scoring (0-100)
- Lead qualification with confidence scores
- Lead categorization (Cold, Warm, Hot)
- Activity tracking and timeline

### 2. Follow-Up Automation
- Automatic follow-up creation for new leads
- AI-generated personalized replies
- Follow-up scheduling and reminders
- Priority-based follow-up management
- Coaching panel with AI recommendations

### 3. Content Generation
- AI-powered LinkedIn content generation
- Trend analysis and content ideation
- Infographic generation using OpenAI Vision
- Content approval workflow
- Engagement tracking

### 4. Engagement Tracking
- Track LinkedIn comments, messages, and emails
- AI-powered engagement analysis
- Automatic lead conversion from engagements
- Screenshot analysis with AI Vision
- Engagement metrics and analytics

### 5. Memory System
- Conversation history tracking
- Lead intelligence summaries
- Memory events for key interactions
- CRM learning from successful patterns
- Agent state management

---

## Database Schema

The system uses 16 tables organized into the following categories:

### Core Tables
- `leads`: CRM lead data
- `lead_followups`: Follow-up tasks
- `engagement_logs`: Social media engagements
- `content_queue`: Generated content

### Memory Tables
- `conversation_memory`: Conversation history
- `memory_events`: Memory events
- `lead_memory_summary`: Lead intelligence
- `crm_memory`: CRM learnings

### System Tables
- `notifications`: System notifications
- `lead_activity`: Activity logs
- `workflow_runs`: Workflow execution logs
- `agent_logs`: Agent execution logs
- `agent_memory`: Agent state
- `strategy_memory`: Strategy storage
- `agent_execution_history`: Execution history

### Content Tables
- `trends`: AI-analyzed trends

See `database/schema.sql` for complete schema definition.

---

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style
- Backend: PEP 8, Black formatter
- Frontend: ESLint, Prettier

---

## Deployment

### Backend Deployment
1. Deploy to Vercel, Railway, or AWS
2. Set environment variables
3. Run database migrations
4. Start the FastAPI server

### Frontend Deployment
1. Deploy to Vercel or Netlify
2. Set environment variables
3. Build and deploy

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

Proprietary - Internal use for LawGPT

---

## Support

For issues and questions, contact the development team.

