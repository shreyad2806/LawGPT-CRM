import { api } from "./client";

export async function getAnalyticsHashtags() {
  console.log("Fetching from: /api/analytics/hashtags");
  const response = await api.get("/api/analytics/hashtags");
  console.log("Response:", response.data);
  return response.data;
}

export async function getAnalyticsPerformers() {
  console.log("Fetching from: /api/analytics/performers");
  const response = await api.get("/api/analytics/performers");
  console.log("Response:", response.data);
  return response.data;
}

export async function getAnalyticsEngagement() {
  console.log("Fetching from: /api/analytics/engagement");
  const response = await api.get("/api/analytics/engagement");
  console.log("Response:", response.data);
  return response.data;
}

export async function getAnalyticsTrends() {
  console.log("Fetching from: /api/analytics/trends");
  const response = await api.get("/api/analytics/trends");
  console.log("Response:", response.data);
  return response.data;
}
