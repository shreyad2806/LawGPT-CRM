import { api } from "./client";

export async function getContent() {
  console.log("Fetching from: /api/content");
  const response = await api.get("/api/content");
  console.log("Response:", response.data);
  return response.data;
}
