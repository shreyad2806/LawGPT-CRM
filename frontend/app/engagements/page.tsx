"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { AddEngagementModal } from "@/components/engagements/AddEngagementModal";
import { getEngagementLogs, deleteEngagementLog } from "@/lib/api/engagementLogs";

type EngagementLog = {
  id: string;
  platform: string;
  engagement_type: string;
  person_name: string;
  company: string;
  role: string;
  message: string;
  source_post_id?: string;
  source_post_title?: string;
  source_post_url?: string;
  intent?: string;
  lead_score?: number;
  lead_quality?: string;
  ai_summary?: string;
  recommended_action?: string;
  converted_to_lead?: boolean;
  created_at: string;
};

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getLeadQualityColor(quality: string): string {
  switch (quality?.toLowerCase()) {
    case "hot":
      return "bg-red-500/10 text-red-400";
    case "warm":
      return "bg-yellow-500/10 text-yellow-400";
    case "cold":
      return "bg-green-500/10 text-green-400";
    default:
      return "bg-gray-500/10 text-gray-400";
  }
}

function getConvertedToLeadColor(converted: boolean): string {
  return converted ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400";
}

export default function EngagementsPage() {
  const [engagements, setEngagements] = useState<EngagementLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [engagementToDelete, setEngagementToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function loadEngagements() {
      try {
        const data = await getEngagementLogs();
        console.log("ENGAGEMENT LOGS Response:", data);
        setEngagements(data.engagement_logs || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load engagements");
      } finally {
        setLoading(false);
      }
    }

    loadEngagements();
  }, []);

  const handleAddSaved = () => {
    // Reload engagements after saving
    async function loadEngagements() {
      try {
        const data = await getEngagementLogs();
        setEngagements(data.engagement_logs || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadEngagements();
  };

  const handleDeleteClick = (id: string) => {
    setEngagementToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!engagementToDelete) return;

    try {
      await deleteEngagementLog(engagementToDelete);
      setEngagements((prev) => prev.filter((e) => e.id !== engagementToDelete));
      setDeleteConfirmOpen(false);
      setEngagementToDelete(null);
      alert("Engagement deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete engagement");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setEngagementToDelete(null);
  };

  if (loading) {
    return <LoadingState message="Loading engagements..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const columns: Column<EngagementLog>[] = [
    {
      key: "person_name",
      header: "Person",
      render: (value) => <span className="text-gray-300 text-sm">{value || "N/A"}</span>,
    },
    {
      key: "company",
      header: "Company",
      render: (value) => <span className="text-gray-300 text-sm">{value || "N/A"}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (value) => <span className="text-gray-300 text-sm">{value || "N/A"}</span>,
    },
    {
      key: "platform",
      header: "Platform",
      render: (value) => <span className="text-gray-300 text-sm capitalize">{value || "N/A"}</span>,
    },
    {
      key: "engagement_type",
      header: "Type",
      render: (value) => <span className="text-gray-300 text-sm capitalize">{value || "N/A"}</span>,
    },
    {
      key: "intent",
      header: "Intent",
      render: (value) => <span className="text-gray-300 text-sm">{value || "N/A"}</span>,
    },
    {
      key: "lead_score",
      header: "Lead Score",
      render: (value) => (
        <span className="text-gray-300 text-sm font-medium">{value !== undefined ? `${value}/100` : "N/A"}</span>
      ),
    },
    {
      key: "lead_quality",
      header: "Quality",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeadQualityColor(value as string)}`}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "converted_to_lead",
      header: "Converted",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConvertedToLeadColor(value as boolean)}`}>
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (value) => <span className="text-gray-400 text-sm">{formatDate(value as string)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_value, row) => (
        <button
          onClick={() => handleDeleteClick(row.id)}
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      ),
    },
  ];

  // Empty state
  if (engagements.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <PageHeader 
          title="Engagement Inbox" 
          subtitle="Track and analyze incoming engagement from all channels"
        >
          <Button onClick={() => setAddModalOpen(true)}>Add Engagement</Button>
        </PageHeader>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-[#1F2937] rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No engagements yet</h3>
                <p className="text-gray-500 text-sm mb-6">Start tracking your incoming engagement</p>
                <Button onClick={() => setAddModalOpen(true)}>+ Add First Engagement</Button>
              </div>
            </div>
          </div>
        </div>

        <AddEngagementModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSaved={handleAddSaved}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader 
        title="Engagement Inbox" 
        subtitle="Track and analyze incoming engagement from all channels"
      >
        <Button onClick={() => setAddModalOpen(true)}>Add Engagement</Button>
      </PageHeader>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <DataTable
            columns={columns}
            data={engagements}
            emptyMessage="No engagements yet. Click 'Add Engagement' to get started."
          />
        </div>
      </div>

      <AddEngagementModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSaved={handleAddSaved}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDeleteCancel}
          />
          <div className="relative bg-[#0A0A0F] border border-[#1F2937] rounded-lg shadow-2xl w-[400px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Engagement</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to delete this engagement? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={handleDeleteCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
