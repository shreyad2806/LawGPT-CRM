import { api } from "./client";

export async function getDashboardStats() {
  const response = await api.get("/api/dashboard/stats");
  return response.data;
}