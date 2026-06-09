import { api } from "./client";

export async function getLeads() {
  console.log("Fetching from: /api/leads");
  const response = await api.get("/api/leads");
  console.log("Response:", response.data);
  return response.data;
}

export async function searchLeads(query: string) {
  console.log(`Searching leads with query: ${query}`);
  const response = await api.get(`/api/leads/search?query=${encodeURIComponent(query)}`);
  console.log("Search Response:", response.data);
  return response.data;
}

export async function getLeadById(leadId: number) {
  console.log(`Fetching from: /api/leads/${leadId}`);
  const response = await api.get(`/api/leads/${leadId}`);
  console.log("Response:", response.data);
  return response.data;
}

export async function getLeadActivities(leadId: number) {
  console.log(`Fetching from: /api/leads/${leadId}/activities`);
  const response = await api.get(`/api/leads/${leadId}/activities`);
  console.log("Response:", response.data);
  return response.data;
}

export async function deleteLead(leadId: number) {
  console.log(`[DELETE LEAD] Deleting lead: /api/leads/${leadId}`);
  const response = await api.delete(`/api/leads/${leadId}`);
  console.log("[DELETE LEAD] Delete Response:", response.data);
  return response.data;
}
