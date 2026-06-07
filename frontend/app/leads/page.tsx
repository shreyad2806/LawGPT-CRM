"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getLeads, searchLeads } from "@/lib/api/leads";
import { LeadDetailDrawer } from "@/components/leads/LeadDetailDrawer";

type Lead = {
  id: string;
  name: string;
  company: string;
  role: string;
  platform: string;
  engagement: string;
  score: number;
  status: string;
  recommended_action?: string;
  priority?: string;
  tags?: string[];
};

function PlatformBadge({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-400";
  if (p === "linkedin" || p.includes("linkedin")) classes = "bg-blue-500/10 text-blue-400";
  if (p === "twitter" || p.includes("twitter")) classes = "bg-gray-500/10 text-gray-400";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      {platform}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority?.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-400";
  if (p === "hot") classes = "bg-red-500/10 text-red-400";
  if (p === "warm") classes = "bg-orange-500/10 text-orange-400";
  if (p === "cold") classes = "bg-blue-500/10 text-blue-400";

  const emojis = {
    Hot: "🔥",
    Warm: "🟠",
    Cold: "🔵",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      {priority ? `${emojis[priority as keyof typeof emojis] || ""} ${priority}` : "-"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  if (s === "qualified") classes = "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "review") classes = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (s === "pending") classes = "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${classes}`}>
      {status}
    </span>
  );
}

export default function LeadsPage() {
  const [platformFilter, setPlatformFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getLeads();
        console.log("LEADS API - full response:", data);
        console.log("LEADS API - leads array:", data?.leads);
        console.log("LEADS API - leads length:", data?.leads?.length ?? 0);
        setLeads(data?.leads || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim() === "") {
      try {
        const data = await getLeads();
        setLeads(data?.leads || []);
      } catch (err) {
        setError("Failed to load leads");
      }
    } else {
      try {
        const data = await searchLeads(query);
        setLeads(data?.leads || []);
      } catch (err) {
        setError("Failed to search leads");
      }
    }
  };

  const filteredData = useMemo(() => {
    return leads.filter((lead: Lead) => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = platformFilter === "All" || lead.platform === platformFilter;
      const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;
      return matchesSearch && matchesPlatform && matchesPriority;
    });
  }, [leads, searchQuery, platformFilter, priorityFilter]);

  // Sort by priority descending (Hot > Warm > Cold)
  const priorityOrder = { "Hot": 3, "Warm": 2, "Cold": 1 };
  const sortedData = filteredData.sort((a: Lead, b: Lead) => {
    const aPriority = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] || 0 : 0;
    const bPriority = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] || 0 : 0;
    return bPriority - aPriority;
  });

  const handleRowClick = (lead: Lead) => {
    setSelectedLeadId(parseInt(lead.id));
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedLeadId(null);
  };

  if (loading) {
    return <LoadingState message="Loading leads..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((lead: Lead) => lead.status.toLowerCase() === "qualified").length;
  const highIntentLeads = leads.filter((lead: Lead) => lead.score >= 80).length;
  const conversionOpps = leads.filter((lead: Lead) => lead.status.toLowerCase() === "qualified" && lead.score >= 85).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]">
      <PageHeader title="Leads" subtitle="Lead intelligence center - Click any row for full profile" />
      
      <div className="flex-1 overflow-auto p-5 space-y-6">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="TOTAL LEADS" value={totalLeads.toLocaleString()} description="1.2% from last mo" />
          <StatCard title="QUALIFIED LEADS" value={qualifiedLeads.toLocaleString()} change="+2.1%" trend="up" />
          <StatCard title="HIGH INTENT LEADS" value={highIntentLeads.toLocaleString()} change="+8.2%" trend="up" />
          <StatCard title="CONVERSION OPPS" value={conversionOpps.toLocaleString()} description="Ready to contact" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="flex-1 w-full relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search leads by name, company, role..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Platform</span>
              <select 
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter/X">Twitter/X</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Priority</span>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Data Table */}
        <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-500 uppercase bg-black/20 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Platform</th>
                  <th className="px-4 py-3 font-medium">Engagement</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No leads match your criteria.
                    </td>
                  </tr>
                ) : (
                  sortedData.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleRowClick(lead)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                      <td className="px-4 py-3">{lead.company}</td>
                      <td className="px-4 py-3">{lead.role}</td>
                      <td className="px-4 py-3"><PlatformBadge platform={lead.platform} /></td>
                      <td className="px-4 py-3 max-w-xs truncate">{lead.engagement}</td>
                      <td className="px-4 py-3 font-mono">{lead.score}</td>
                      <td className="px-4 py-3"><PriorityBadge priority={lead.priority || ""} /></td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRowClick(lead); }}
                            className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LeadDetailDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        leadId={selectedLeadId}
      />
    </div>
  );
}

