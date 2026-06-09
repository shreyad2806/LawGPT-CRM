import { api } from "./client";

export async function getAnalyticsHashtags() {
  const response = await api.get("/api/analytics/hashtags");
  return response.data;
}

export async function getAnalyticsPerformers() {
  const response = await api.get("/api/analytics/performers");
  return response.data;
}

export async function getAnalyticsEngagement() {
  const response = await api.get("/api/analytics/engagement");
  return response.data;
}

export async function getAnalyticsTrends() {
  const response = await api.get("/api/analytics/trends");
  return response.data;
}

export async function getAnalyticsTopics() {
  const response = await api.get("/api/analytics/topics");
  return response.data;
}

export async function getAnalyticsRecommendations() {
  const response = await api.get("/api/analytics/recommendations");
  return response.data;
}

export async function getAnalyticsDashboard() {
  const response = await api.get("/api/analytics/dashboard");
  return response.data;
}
