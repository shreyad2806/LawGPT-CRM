import { api } from "./client";

export interface LeadMemorySummary {
  id?: number;
  lead_id: number;
  summary: string;
  buying_intent: string;
  urgency: string;
  pain_point: string;
  objection: string;
  decision_maker: string;
  budget: string;
  preferred_communication: string;
  last_action: string;
  next_action: string;
  updated_at?: string;
}

export interface ConversationMessage {
  id: number;
  lead_id: number;
  followup_id?: number;
  sender: string;
  message: string;
  type: string;
  timestamp: string;
}

export interface MemoryEvent {
  id: number;
  lead_id: number;
  event_type: string;
  value: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface LeadMemoryResponse {
  summary: LeadMemorySummary;
  history: ConversationMessage[];
  events: MemoryEvent[];
}

export async function getLeadMemory(leadId: number): Promise<LeadMemoryResponse> {
  const response = await api.get(`/api/memory/${leadId}`);
  return response.data;
}
