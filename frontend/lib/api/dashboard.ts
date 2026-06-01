import { api } from "./client";

export async function getDashboardStats() {
  console.log("Fetching from: /api/dashboard/stats");
  const response = await api.get("/api/dashboard/stats");
  console.log("Response:", response.data);
  return response.data;
}