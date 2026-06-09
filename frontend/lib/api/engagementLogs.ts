import { api } from "./client";

export async function getEngagementLogs() {
  const response = await api.get("/api/engagement-logs");
  return response.data;
}

export async function createEngagementLog(data: Record<string, any>) {
  const response = await api.post("/api/engagement-logs", data);
  return response.data;
}

export async function updateEngagementLog(id: string | number, updates: Record<string, any>) {
  const response = await api.patch(`/api/engagement-logs/${id}`, updates);
  return response.data;
}

export async function deleteEngagementLog(id: string | number) {
  const response = await api.delete(`/api/engagement-logs/${id}`);
  return response.data;
}

export async function analyzeEngagement(message: string, source: string) {
  const response = await api.post("/api/engagement-logs/analyze", { message, source });
  return response.data;
}
