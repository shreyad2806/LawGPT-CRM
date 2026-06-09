import { api } from "./client";

export async function getContent() {
  const response = await api.get("/api/content");
  return response.data;
}

export async function updateContent(
  id: string | number,
  updates: Record<string, any>
) {
  const response = await api.patch(
    `/api/content/${id}`,
    updates
  );

  return response.data;
}

export async function generateInfographic(
  contentId: string | number
) {
  const response = await api.post(
    `/api/content/${contentId}/generate-infographic`
  );

  return response.data;
}

export async function regenerateInfographic(
  contentId: string | number
) {
  const response = await api.post(
    `/api/content/${contentId}/regenerate-infographic`
  );

  return response.data;
}