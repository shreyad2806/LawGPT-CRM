"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getLeads } from "@/lib/api/leads";

export function TopQualifiedLeadsTable() {
  const [leads, setLeads] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getLeads();
        console.log("TOP LEADS API:", data);
        setLeads(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  if (loading) {
    return (
      <Card className="flex flex-col mt-4">
        <LoadingState message="Loading top leads..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col mt-4">
        <ErrorState message={error} />
      </Card>
    );
  }

  const topQualifiedLeads = leads
    .filter((lead: any) => lead.status.toLowerCase() === "qualified")
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  return (
    <Card className="flex flex-col mt-4">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">Top Qualified Leads</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {topQualifiedLeads.map((lead: any) => (
          <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div>
              <h3 className="text-[13px] font-medium text-white mb-1">{lead.name}</h3>
              <p className="text-[11px] text-gray-500 font-medium">{lead.company}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              lead.score >= 90 ? "text-[#22C55E] bg-green-500/10" :
              lead.score >= 80 ? "text-[#F59E0B] bg-amber-500/10" :
              "text-[#3B82F6] bg-blue-500/10"
            }`}>
              Score: {lead.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
