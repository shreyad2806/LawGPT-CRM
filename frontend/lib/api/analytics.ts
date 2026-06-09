import { api } from "./client";

export async function getAnalyticsHashtags() {
  console.log("Fetching from: /api/analytics/hashtags");
  const response = await api.get("/api/analytics/hashtags");
  console.log("Analytics API Response:", response.data);
  return response.data;
}

export async function getAnalyticsPerformers() {
  console.log("Fetching from: /api/analytics/performers");
  const response = await api.get("/api/analytics/performers");
  console.log("Analytics API Response:", response.data);
  return response.data;
}

export async function getAnalyticsEngagement() {
  console.log("Fetching from: /api/analytics/engagement");
  const response = await api.get("/api/analytics/engagement");
  console.log("Analytics API Response:", response.data);
  return response.data;
}

export async function getAnalyticsTrends() {
  console.log("Fetching from: /api/analytics/trends");
  const response = await api.get("/api/analytics/trends");
  console.log("Analytics API Response:", response.data);
  return response.data;
}

export async function getAnalyticsTopics() {
  console.log("Fetching from: /api/analytics/topics");
  const response = await api.get("/api/analytics/topics");
  console.log("Analytics API Response:", response.data);
  return response.data;
}

export async function getAnalyticsRecommendations() {
  console.log("Fetching from: /api/analytics/recommendations");
  const response = await api.get("/api/analytics/recommendations");
  console.log("Analytics API Response:", response.data);
  return response.data;
}

export async function getAnalyticsDashboard() {
  console.log("Fetching from: /api/analytics/dashboard");
  const response = await api.get("/api/analytics/dashboard");
  console.log("Analytics Dashboard Response:", response.data);
  return response.data;
}
