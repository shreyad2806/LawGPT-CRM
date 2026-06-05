"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { useRecentTrends } from "@/hooks/useRecentTrends";
import { Trend } from "@/types/trend";

function formatTimeAgo(iso?: string) {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function urgencyBadge(urgency?: string) {
  switch ((urgency || "").toLowerCase()) {
    case "high":
    case "hot":
      return { label: "🔥 Hot", cls: "text-[#FFEDD5] bg-[#7C2D12]/20" };
    case "rising":
      return { label: "📈 Rising", cls: "text-[#DBEAFE] bg-[#1E3A8A]/20" };
    default:
      return { label: "🌱 Emerging", cls: "text-[#D1FAE5] bg-[#065F46]/20" };
  }
}

export function RecentTrends() {
  const { data, isLoading, isError } = useRecentTrends();

  return (
    <Card className="p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-white">Recent Trends</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 bg-[#0B1220] rounded-lg animate-pulse h-40" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 text-sm text-red-400">Failed to load trends.</div>
      ) : !data || data.length === 0 ? (
        <div className="p-6 text-sm text-gray-400">No trends available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {data.slice(0, 6).map((t: Trend) => {
            const ub = urgencyBadge(t.urgency);
            return (
              <article
                key={t.id}
                className="bg-[#0B1220] border border-[#1F2937] rounded-lg p-6 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-200"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded ${ub.cls}`}>{ub.label}</span>
                    <span className="text-xs text-gray-400">{formatTimeAgo(t.created_at || t.published_at)}</span>
                  </div>

                  <h3 className="text-lg lg:text-xl font-semibold text-white leading-tight mb-2">{t.title}</h3>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">{t.summary}</p>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-[12px] text-gray-400">
                      <span className="px-2 py-0.5 bg-[#111827] rounded text-gray-300">{t.category}</span>
                      <span className="font-medium">Score: {t.trend_score ?? "—"}</span>
                    </div>

                    <a href={t.url ?? "#"} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#3B82F6] hover:text-blue-400">Read Article ↗</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}
