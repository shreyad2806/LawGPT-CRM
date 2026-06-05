"use client";

import { useQuery } from "@tanstack/react-query";
import { Trend } from "@/types/trend";

async function fetchRecentTrends(): Promise<Trend[]> {
  const url = typeof window !== 'undefined' ? window.location.origin + "/api/trends/recent" : "http://localhost:8000/api/trends/recent";
  // Prefer backend server if running separately in dev
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const fetchUrl = backendUrl + "/api/trends/recent";
  const res = await fetch(fetchUrl);
  if (!res.ok) throw new Error("Failed to fetch recent trends");
  const data = await res.json();
  return data as Trend[];
}

export function useRecentTrends() {
  return useQuery<Trend[], Error>({
    queryKey: ["recentTrends"],
    queryFn: fetchRecentTrends,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
