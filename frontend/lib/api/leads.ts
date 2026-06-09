import { api } from "./client";

export async function getLeads() {
  const response = await api.get("/api/leads");
  return response.data;
}

export async function searchLeads(query: string) {
  const response = await api.get(`/api/leads/search?query=${encodeURIComponent(query)}`);
  return response.data;
}

export async function getLeadById(leadId: number) {
  const response = await api.get(`/api/leads/${leadId}`);
  return response.data;
}

export async function getLeadActivities(leadId: number) {
  const response = await api.get(`/api/leads/${leadId}/activities`);
  return response.data;
}

export async function deleteLead(leadId: number) {
  const response = await api.delete(`/api/leads/${leadId}`);
  return response.data;
}
