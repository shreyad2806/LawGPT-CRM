import { api } from "./client";

export async function getFollowups() {
  console.log("Fetching from: /api/followups");
  const response = await api.get("/api/followups");
  console.log("Response:", response.data);
  return response.data;
}
