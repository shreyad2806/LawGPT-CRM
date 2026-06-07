import { api } from "./client";

export interface Followup {
  id: string;
  lead_id: string;
  lead_name: string;
  company: string;
  role: string;
  lead_score: number;
  lead_quality: string;
  intent: string;
  followup_type: string;
  status: string;
  priority: string;
  scheduled_date: string;
  completed_date: string;
  last_contact_date: string;
  next_action: string;
  generated_reply: string;
  manual_notes: string;
  recommended_action: string;
  ai_reason: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationMemory {
  id: string;
  sender: string;
  message: string;
  type: string;
  timestamp: string;
}

export interface CoachingData {
  summary: string;
  pain_point: string;
  buying_intent: string;
  urgency: string;
  objection_prediction: string;
  recommended_strategy: string;
  next_objective: string;
  confidence: number;
}

export interface CoachingResponse {
  coaching: CoachingData;
  conversation_memory: ConversationMemory[];
}

export interface FollowupsStats {
  pending: number;
  ready_to_send: number;
  sent: number;
  responded: number;
}

export async function getFollowups(): Promise<{ followups: Followup[] }> {
  const response = await api.get("/api/followups");
  return response.data;
}

export async function getFollowup(id: string | number): Promise<{ followup: Followup }> {
  const response = await api.get(`/api/followups/${id}`);
  return response.data;
}

export async function getFollowupsStats(): Promise<FollowupsStats> {
  const response = await api.get("/api/followups/stats");
  return response.data;
}

export async function updateFollowup(id: string | number, data: Partial<Followup>): Promise<{ followup: Followup }> {
  const response = await api.patch(`/api/followups/${id}`, data);
  return response.data;
}

export async function deleteFollowup(id: string | number): Promise<{ success: boolean }> {
  const response = await api.delete(`/api/followups/${id}`);
  return response.data;
}

export async function generateReply(id: string | number): Promise<{ followup: Followup }> {
  const response = await api.post(`/api/followups/${id}/generate-reply`);
  return response.data;
}

export async function completeFollowup(id: string | number): Promise<{ followup: Followup }> {
  const response = await api.post(`/api/followups/${id}/complete`);
  return response.data;
}

export async function recommendAction(id: string | number): Promise<{ followup: Followup }> {
  const response = await api.post(`/api/followups/${id}/recommend`);
  return response.data;
}

export async function getCoachingPanel(id: string | number): Promise<CoachingResponse> {
  const response = await api.get(`/api/followups/${id}/coaching`);
  return response.data;
}

