"use client";

import React, { useState, useEffect } from "react";
// Removed preview drawer/modal - inline dropdown is canonical
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/Button";
import StatusDropdown from "@/components/content/status-dropdown";
import { Select } from "@/components/ui/Select";
import { getContent, generateInfographic, regenerateInfographic, updateContent } from "@/lib/api/content";
import ContentReviewModal from "@/components/content/ContentReviewModal";
import InfographicViewerModal from "@/components/content/InfographicViewerModal";

type ContentItem = {
  id: string;
  trend_id: string;
  trend_title: string;
  hook: string;
  linkedin_post: string;
  cta: string;
  hashtags: string[];
  infographic_prompt: string;
  image_url?: string;
  status: string;
  created_at: string;
};

type StatusFilter = "all" | "draft" | "approved" | "rejected" | "posted";
type PlatformFilter = "all" | "linkedin" | "carousel";

function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function StatusBadge({ status }: { status: "Draft" | "Approved" | "Rejected" | "Posted" }) {
  const styles = {
    Draft: "bg-gray-500/10 text-gray-300",
    Approved: "bg-green-500/10 text-green-400",
    Rejected: "bg-red-500/10 text-red-400",
    Posted: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: "LinkedIn" | "Carousel" }) {
  const styles = {
    LinkedIn: "bg-blue-500/10 text-blue-400",
    Carousel: "bg-purple-500/10 text-purple-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[platform]}`}>
      {platform}
    </span>
  );
}

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingInfographic, setGeneratingInfographic] = useState<string | null>(null);
  const [viewingInfographic, setViewingInfographic] = useState<ContentItem | null>(null);
  const [isInfographicModalOpen, setIsInfographicModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const handleGenerateInfographic = async (contentId: string) => {
    console.log("[INFOGRAPHIC] Generate clicked");
    setGeneratingInfographic(contentId);
    try {
      const response = await generateInfographic(contentId);
      console.log("[INFOGRAPHIC] Response:", response);
      
      if (response.cached) {
        console.log("[INFOGRAPHIC] Cache hit");
      } else {
        console.log("[INFOGRAPHIC] Cache miss - OpenAI generation started");
      }
      
      // Refresh content after generation
      const data = await getContent();
      setContent(data.content || []);
      
      // Find the updated content item
      const updatedContent = data.content?.find((item: ContentItem) => item.id === contentId);
      
      if (updatedContent) {
        console.log("[INFOGRAPHIC] Image saved");
        console.log("[INFOGRAPHIC] URL stored:", updatedContent.image_url);
        console.log("[INFOGRAPHIC] Returning image");
        
        // Open infographic viewer modal
        setViewingInfographic(updatedContent);
        setIsInfographicModalOpen(true);
      }
    } catch (err) {
      console.error("[INFOGRAPHIC] Failed to generate infographic:", err);
      showToast("Failed to generate infographic");
    } finally {
      setGeneratingInfographic(null);
    }
  };

  const handleRegenerateInfographic = async (contentId: string) => {
    console.log("[INFOGRAPHIC] Regenerate clicked");
    setGeneratingInfographic(contentId);
    try {
      const response = await regenerateInfographic(contentId);
      console.log("[INFOGRAPHIC] Regenerate response:", response);
      
      // Refresh content after regeneration
      const data = await getContent();
      setContent(data.content || []);
      
      // Find the updated content item
      const updatedContent = data.content?.find((item: ContentItem) => item.id === contentId);
      
      if (updatedContent) {
        console.log("[INFOGRAPHIC] Image regenerated");
        console.log("[INFOGRAPHIC] New URL stored:", updatedContent.image_url);
        
        // Update the modal with the new image
        setViewingInfographic(updatedContent);
      }
      
      showToast("Infographic regenerated successfully!");
    } catch (err) {
      console.error("[INFOGRAPHIC] Failed to regenerate infographic:", err);
      showToast("Failed to regenerate infographic");
    } finally {
      setGeneratingInfographic(null);
    }
  };

  const handleDownloadInfographic = (content: ContentItem) => {
    if (!content.image_url) return;
    
    console.log("[INFOGRAPHIC] Download clicked for:", content.id);
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = content.image_url;
    link.download = `lawgpt_infographic_${content.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("[INFOGRAPHIC] Download initiated");
  };

  const handleStatusChange = async (
  contentId: string,
  newStatus: string
) => {
  try {
    console.log("Updating status", {
      contentId,
      newStatus,
    });

    setUpdatingStatus(contentId);

    await updateContent(contentId, {
      status: newStatus,
    });

    setContent((prev) =>
      prev.map((item) =>
        item.id === contentId
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    showToast(`Status updated to ${newStatus}`);
  } catch (err) {
    console.error("Failed to update status:", err);
    showToast("Failed to update status");
  } finally {
    setUpdatingStatus(null);
  }
};

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getContent();
        console.log("CONTENT API Response:", data);
        console.log("CONTENT API Payload:", data.content);
        setContent(data.content || []);

        console.log(
        "FIRST CONTENT ITEM",
        data.content?.[0]
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading) {
    return <LoadingState message="Loading content..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  console.log("CONTENT API DATA", content);

  const drafts = content.filter((item: ContentItem) => item.status.toLowerCase() === "draft").length;
  const approved = content.filter((item: ContentItem) => item.status.toLowerCase() === "approved").length;
  const rejected = content.filter((item: ContentItem) => item.status.toLowerCase() === "rejected").length;
  const posted = content.filter((item: ContentItem) => item.status.toLowerCase() === "posted").length;

  const filteredData = content.filter((item: ContentItem) => {
    const statusMatch =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    return statusMatch;
  });

  const columns: Column<any>[] = [
    {
      key: "trend_title",
      header: "Title",
      render: (_, row) => (
      <div className="max-w-xs text-gray-300">
      {truncateText(
        row.trend_title || "N/A",
        80
      )}
    </div>
  ),
},
    {
      key: "hook",
      header: "Hook",
      render: (value, row) => (
        <div className="max-w-md text-gray-300">
          {truncateText(value as string, 80)}
        </div>
      ),
    },
    {
      key: "linkedin_post",
      header: "LinkedIn Post",
      render: (_, row) => {
      console.log("LINKEDIN ROW", row);

      return (
      <div className="max-w-lg text-gray-300">
        {row.linkedin_post
          ? truncateText(row.linkedin_post, 120)
          : "N/A"}
      </div>
    );
  },
  },
    {
      key: "image_url",
      header: "Infographic",
      render: (value, row) => (
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleGenerateInfographic(row.id);
            }}
            disabled={generatingInfographic === row.id}
          >
            {generatingInfographic === row.id ? "Generating..." : "Generate"}
          </Button>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value, row) => (
        <StatusDropdown
          value={value as string}
          contentId={row.id}
            onChange={(newStatus) => {
            console.log("Status clicked:", newStatus);
            console.log("Content ID:", row.id);

            setContent((prev) =>
           prev.map((item) =>
           item.id === row.id ? {...item, status: newStatus,}: item
    )
  );

  handleStatusChange(
    row.id,
    newStatus
  );
}}
          onToast={showToast}
        />
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (value) => <span className="text-gray-400 text-sm">{formatDate(value as string)}</span>,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <PageHeader title="Content" subtitle="Marketing content review center. Click any row to preview" />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="DRAFTS"
              value={drafts.toString()}
            />
            <StatCard
              title="APPROVED"
              value={approved.toString()}
            />
            <StatCard
              title="REJECTED"
              value={rejected.toString()}
            />
            <StatCard
              title="POSTED"
              value={posted.toString()}
            />
          </div>

          {/* Filters Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Status:</span>
              <Select
                variant="default"
                value={statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                onChange={(value) => setStatusFilter(value.toLowerCase() as StatusFilter)}
                options={[
                  { value: "All", label: "All" },
                  { value: "Draft", label: "Draft" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                  { value: "Posted", label: "Posted" },
                ]}
              />
            </div>
          </div>

          {/* Table Section */}
              <DataTable
              columns={columns}
              data={filteredData}
              emptyMessage="No content items match the selected filters."
              onRowClick={(row) => {
              console.log("Row clicked:", row);

              setSelectedContent(row);

              setIsModalOpen(true);
              }}
              />

                  <ContentReviewModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    content={selectedContent}
                    onToast={showToast}
                  />

          {/* Infographic Viewer Modal */}
          <InfographicViewerModal
            open={isInfographicModalOpen}
            onClose={() => setIsInfographicModalOpen(false)}
            content={viewingInfographic}
            onDownload={() => viewingInfographic && handleDownloadInfographic(viewingInfographic)}
            onRegenerate={() => viewingInfographic && handleRegenerateInfographic(viewingInfographic.id)}
            isRegenerating={generatingInfographic === viewingInfographic?.id}
          />

          {/* Preview drawer and modals removed; use inline table and dropdowns only */}

          {/* Toast Notification */}
          {toast.visible && (
            <div className="fixed bottom-4 right-4 bg-[#0A0A0F] border border-[#1F2937] rounded-lg shadow-lg px-4 py-3 z-50 animate-slide-up">
              <p className="text-green-400 text-sm">{toast.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
