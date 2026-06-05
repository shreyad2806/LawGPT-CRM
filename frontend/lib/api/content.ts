import { api } from "./client";

export async function getContent() {
  console.log("Fetching from: /api/content");
  const response = await api.get("/api/content");
  console.log("Response:", response.data);
  return response.data;
}

export async function updateContent(id: string | number, updates: Record<string, any>) {
  console.log(`[api.content] updateContent id=${id} updates=`, updates);
  const response = await api.patch(`/api/content/${id}`, updates);
  console.log(`[api.content] updateContent response=`, response.data);
  return response.data;
}

export async function generateInfographic(contentId: string | number) {
  console.log(`Generating infographic for content ${contentId}`);
  const response = await api.post(`/api/infographic/generate`, { content_id: contentId });
  console.log("[api.content] generateInfographic response:", response.data);
  return response.data;
}
