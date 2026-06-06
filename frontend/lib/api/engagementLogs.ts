import { api } from "./client";

export async function getEngagementLogs() {
  console.log("Fetching from: /api/engagement-logs");
  const response = await api.get("/api/engagement-logs");
  console.log("Response:", response.data);
  return response.data;
}

export async function createEngagementLog(data: Record<string, any>) {
  console.log("Creating engagement log:", data);
  const response = await api.post("/api/engagement-logs", data);
  console.log("Response:", response.data);
  return response.data;
}

export async function updateEngagementLog(id: string | number, updates: Record<string, any>) {
  console.log(`Updating engagement log ${id}:`, updates);
  const response = await api.patch(`/api/engagement-logs/${id}`, updates);
  console.log("Response:", response.data);
  return response.data;
}

export async function deleteEngagementLog(id: string | number) {
  console.log(`Deleting engagement log ${id}`);
  const response = await api.delete(`/api/engagement-logs/${id}`);
  console.log("Response:", response.data);
  return response.data;
}

export async function analyzeEngagement(message: string, source: string) {
  console.log("Analyzing engagement:", { message, source });
  const response = await api.post("/api/engagement-logs/analyze", { message, source });
  console.log("Response:", response.data);
  return response.data;
}
