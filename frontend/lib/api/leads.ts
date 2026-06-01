import { api } from "./client";

export async function getLeads() {
  console.log("Fetching from: /api/leads");
  const response = await api.get("/api/leads");
  console.log("Response:", response.data);
  return response.data;
}
