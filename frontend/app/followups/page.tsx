"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getFollowups, Followup, deleteFollowup } from "@/lib/api/followups";
import { FollowupDrawer } from "@/components/followups/FollowupDrawer";

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  if (s === "pending" || s === "needs response") classes = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (s === "ready" || s === "waiting customer") classes = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (s === "demo scheduled") classes = "bg-purple-500/10 text-purple-400 border-purple-500/20";
  if (s === "negotiation") classes = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (s === "won" || s === "completed") classes = "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "lost") classes = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${classes}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-400";
  if (p === "critical") classes = "bg-red-500/20 text-red-400 animate-pulse font-bold border border-red-500/30";
  if (p === "high") classes = "bg-amber-500/10 text-amber-400";
  if (p === "medium") classes = "bg-blue-500/10 text-blue-400";
  if (p === "low") classes = "bg-gray-500/10 text-gray-400";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      {priority}
    </span>
  );
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Drawer state
  const [selectedFollowup, setSelectedFollowup] = useState<Followup | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadFollowups = async () => {
    setLoading(true);
    try {
      const data = await getFollowups();
      console.log("FOLLOWUPS API RESPONSE:", data);
      console.log("FOLLOWUPS:", data.followups);
      console.log("FOLLOWUPS LENGTH:", data.followups?.length || 0);
      setFollowups(data.followups || []);
    } catch (err) {
      console.error("Failed to load followups:", err);
      setError("Failed to load followups. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowups();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this followup?")) return;
    try {
      await deleteFollowup(id);
      loadFollowups();
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete followup");
    }
  };

  const openDrawer = (f: Followup) => {
    setSelectedFollowup(f);
    setIsDrawerOpen(true);
  };

  const filteredData = useMemo(() => {
    const filtered = followups.filter((f) => {
      const matchesSearch = 
        f.lead_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === "All" || f.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" || f.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
    console.log("FILTERED DATA:", filtered);
    console.log("FILTERED DATA LENGTH:", filtered.length);
    console.log("FILTER STATE:", { searchQuery, priorityFilter, statusFilter });
    return filtered;
  }, [followups, searchQuery, priorityFilter, statusFilter]);

  // Derived stats
  const pendingCount = followups.filter(f => f.status !== "Completed").length;
  const overdueCount = followups.filter(f => new Date(f.scheduled_date) < new Date() && f.status !== "Completed").length;
  const completedCount = followups.filter(f => f.status === "Completed").length;
  const criticalCount = followups.filter(f => f.priority === "Critical" && f.status !== "Completed").length;

  if (loading && followups.length === 0) {
    return <LoadingState message="Loading followups..." />;
  }

  if (error && followups.length === 0) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]">
      <PageHeader title="AI Followup Center" subtitle="Smart queue, dynamic priority, and AI-generated replies" />
      
      <div className="flex-1 overflow-auto p-5 space-y-6">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="PENDING" value={pendingCount.toString()} description="Awaiting action" />
          <StatCard title="OVERDUE" value={overdueCount.toString()} description="Requires immediate attention" trend={overdueCount > 0 ? "warning" : undefined} />
          <StatCard title="CRITICAL" value={criticalCount.toString()} description="Highest priority leads" />
          <StatCard title="COMPLETED" value={completedCount.toString()} description="Successfully addressed" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="flex-1 w-full relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search leads or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Priority</span>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Needs Response">Needs Response</option>
                <option value="Waiting Customer">Waiting Customer</option>
                <option value="Completed">Completed</option>
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
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Intent</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Next Action</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No followups match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((f) => {
                    const isOverdue = new Date(f.scheduled_date) < new Date() && f.status !== "Completed";
                    
                    return (
                      <tr 
                        key={f.id} 
                        onClick={() => openDrawer(f)}
                        className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isOverdue ? 'bg-red-500/5' : ''}`}
                      >
                        <td className="px-4 py-3 font-medium text-white">{f.lead_name}</td>
                        <td className="px-4 py-3">{f.company}</td>
                        <td className="px-4 py-3">{f.intent || "-"}</td>
                        <td className="px-4 py-3 font-mono">{f.lead_score}</td>
                        <td className="px-4 py-3"><PriorityBadge priority={f.priority} /></td>
                        <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                        <td className="px-4 py-3 text-purple-300">{f.next_action || f.followup_type}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); openDrawer(f); }}
                              className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => handleDelete(e, f.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FollowupDrawer 
        followup={selectedFollowup} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onRefresh={loadFollowups}
      />
    </div>
  );
}
