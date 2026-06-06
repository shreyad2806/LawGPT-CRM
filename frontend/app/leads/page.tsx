"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getLeads, searchLeads } from "@/lib/api/leads";
import { LeadDetailDrawer } from "@/components/leads/LeadDetailDrawer";
import { SearchInput } from "@/components/shared/SearchInput";

type Lead = {
  id: string;
  name: string;
  company: string;
  role: string;
  platform: string;
  engagement: string;
  score: number;
  category: string;
  status: string;
  recommended_action?: string;
  priority?: string;
  tags?: string[];
};

type PlatformFilter = "all" | "linkedin" | "twitter";
type CategoryFilter = "all" | "partner" | "c-level" | "associate";
type PriorityFilter = "all" | "hot" | "warm" | "cold";
type TagFilter = string | "all";

function PlatformBadge({ platform }: { platform: "LinkedIn" | "Twitter/X" }) {
  const styles = {
    LinkedIn: "bg-blue-500/10 text-blue-400",
    "Twitter/X": "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[platform]}`}>
      {platform}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "Hot" | "Warm" | "Cold" }) {
  const styles = {
    Hot: "bg-red-500/10 text-red-400",
    Warm: "bg-orange-500/10 text-orange-400",
    Cold: "bg-blue-500/10 text-blue-400",
  };

  const emojis = {
    Hot: "🔥",
    Warm: "🟠",
    Cold: "🔵",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
      {emojis[priority]} {priority}
    </span>
  );
}

function CategoryBadge({
  category,
}: {
  category: "Partner" | "C-Level" | "Associate";
}) {
  const styles = {
    Partner: "bg-blue-500/10 text-blue-400",
    "C-Level": "bg-purple-500/10 text-purple-400",
    Associate: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[category]}`}>
      {category}
    </span>
  );
}

function RecommendedActionBadge({ action }: { action: string }) {
  const styles: Record<string, string> = {
    "Schedule Demo": "bg-green-500/10 text-green-400",
    "Send Pricing": "bg-blue-500/10 text-blue-400",
    "Send Case Study": "bg-purple-500/10 text-purple-400",
    "Connect on LinkedIn": "bg-cyan-500/10 text-cyan-400",
    "Send Product Deck": "bg-amber-500/10 text-amber-400",
    "Wait 3 Days": "bg-gray-500/10 text-gray-400",
    "Disqualify": "bg-red-500/10 text-red-400",
  };

  const defaultStyle = "bg-gray-500/10 text-gray-400";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[action] || defaultStyle}`}>
      {action}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: "Qualified" | "Review" | "Pending";
}) {
  const styles = {
    Qualified: "bg-green-500/10 text-green-400",
    Review: "bg-amber-500/10 text-amber-400",
    Pending: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function LeadsPage() {
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
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
      // Load all leads if search is empty
      try {
        const data = await getLeads();
        setLeads(data?.leads || []);
      } catch (err) {
        setError("Failed to load leads");
      }
    } else {
      // Search leads
      try {
        const data = await searchLeads(query);
        setLeads(data?.leads || []);
      } catch (err) {
        setError("Failed to search leads");
      }
    }
  };

  if (loading) {
    return <LoadingState message="Loading leads..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  console.log("LEADS API DATA", leads);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((lead: Lead) => lead.status.toLowerCase() === "qualified").length;
  const highIntentLeads = leads.filter((lead: Lead) => lead.score >= 80).length;
  const conversionOpps = leads.filter((lead: Lead) => lead.status.toLowerCase() === "qualified" && lead.score >= 85).length;

  // Get all unique tags from leads
  const allTags = Array.from(
    new Set(leads.flatMap((lead) => lead.tags || []))
  ).sort();

  const filteredData = leads.filter((lead: Lead) => {
    const platformMatch =
      platformFilter === "all" ||
      lead.platform.toLowerCase().replace("/", "") ===
        platformFilter.toLowerCase().replace("/", "");
    const categoryMatch =
      categoryFilter === "all" ||
      lead.category.toLowerCase().replace("-", "") ===
        categoryFilter.toLowerCase().replace("-", "");
    const priorityMatch =
      priorityFilter === "all" ||
      (lead.priority && lead.priority.toLowerCase() === priorityFilter);
    const tagMatch =
      tagFilter === "all" ||
      (lead.tags && lead.tags.includes(tagFilter));
    return platformMatch && categoryMatch && priorityMatch && tagMatch;
  });

  // Sort by priority descending (Hot > Warm > Cold)
  const priorityOrder = { "Hot": 3, "Warm": 2, "Cold": 1 };
  const sortedData = filteredData.sort((a: Lead, b: Lead) => {
    const aPriority = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] || 0 : 0;
    const bPriority = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] || 0 : 0;
    return bPriority - aPriority;
  });

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Name",
      render: (value) => (
        <span 
          className="font-medium"
          dangerouslySetInnerHTML={{ __html: highlightText(value as string, searchQuery) }}
        />
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (value) => (
        <div 
          className="max-w-xs truncate"
          dangerouslySetInnerHTML={{ __html: highlightText(value as string, searchQuery) }}
        />
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (value) => (
        <div 
          className="max-w-xs truncate"
          dangerouslySetInnerHTML={{ __html: highlightText(value as string, searchQuery) }}
        />
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (value) => <PlatformBadge platform={value as "LinkedIn" | "Twitter/X"} />,
    },
    {
      key: "engagement",
      header: "Engagement",
      render: (value) => (
        <div 
          className="max-w-xs truncate"
          dangerouslySetInnerHTML={{ __html: highlightText(value as string, searchQuery) }}
        />
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (value) => <span className="text-white font-semibold">{value as number}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (value) => <CategoryBadge category={value as "Partner" | "C-Level" | "Associate"} />,
    },
    {
      key: "priority",
      header: "Priority",
      render: (value) => value ? <PriorityBadge priority={value as "Hot" | "Warm" | "Cold"} /> : <span className="text-gray-500 text-xs">-</span>,
    },
    {
      key: "tags",
      header: "Tags",
      render: (value) => {
        const tags = value as string[];
        if (!tags || tags.length === 0) return <span className="text-gray-500 text-xs">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300"
                dangerouslySetInnerHTML={{ __html: `#${highlightText(tag, searchQuery)}` }}
              />
            ))}
            {tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{tags.length - 3}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "recommended_action",
      header: "Next Action",
      render: (value) => value ? <RecommendedActionBadge action={value as string} /> : <span className="text-gray-500 text-xs">-</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value as "Qualified" | "Review" | "Pending"} />,
    },
  ];

  const handleRowClick = (lead: Lead) => {
    setSelectedLeadId(parseInt(lead.id));
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedLeadId(null);
  };

  // Helper function to highlight search keywords
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-500/30 text-yellow-300 px-1 rounded">$1</mark>');
  };

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Leads" subtitle="Lead intelligence center - Click any row for full profile" />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Search */}
          <div className="max-w-2xl">
            <SearchInput onSearch={handleSearch} placeholder="Search leads by name, company, role, tags..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="TOTAL LEADS"
              value={totalLeads.toLocaleString()}
              description="1.2% from last mo"
            />
            <StatCard
              title="QUALIFIED LEADS"
              value={qualifiedLeads.toLocaleString()}
              change="+2.1%"
              trend="up"
            />
            <StatCard
              title="HIGH INTENT LEADS"
              value={highIntentLeads.toLocaleString()}
              change="+8.2%"
              trend="up"
            />
            <StatCard
              title="CONVERSION OPPS"
              value={conversionOpps.toLocaleString()}
              description="Ready to contact"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Platform:</span>
              <FilterTabs
                items={["All", "LinkedIn", "Twitter/X"]}
                active={platformFilter === "all" ? "All" : platformFilter === "linkedin" ? "LinkedIn" : "Twitter/X"}
                onChange={(value) => setPlatformFilter(value === "All" ? "all" : value === "LinkedIn" ? "linkedin" : "twitter")}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Category:</span>
              <FilterTabs
                items={["All", "Partner", "C-Level", "Associate"]}
                active={categoryFilter === "all" ? "All" : categoryFilter === "partner" ? "Partner" : categoryFilter === "c-level" ? "C-Level" : "Associate"}
                onChange={(value) => setCategoryFilter(value === "All" ? "all" : value === "Partner" ? "partner" : value === "C-Level" ? "c-level" : "associate")}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Priority:</span>
              <FilterTabs
                items={["All", "Hot", "Warm", "Cold"]}
                active={priorityFilter === "all" ? "All" : priorityFilter === "hot" ? "Hot" : priorityFilter === "warm" ? "Warm" : "Cold"}
                onChange={(value) => setPriorityFilter(value === "All" ? "all" : value === "Hot" ? "hot" : value === "Warm" ? "warm" : "cold")}
              />
            </div>
            {allTags.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Tag:</span>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-1.5 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <DataTable
            columns={columns}
            data={sortedData}
            emptyMessage="No leads match the selected filters."
            onRowClick={handleRowClick}
          />
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
