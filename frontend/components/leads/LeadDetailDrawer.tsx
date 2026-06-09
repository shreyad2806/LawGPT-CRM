"use client";

import React, { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { LeadActivityTimeline } from "@/components/leads/LeadActivityTimeline";
import { getLeadById, getLeadActivities } from "@/lib/api/leads";

type LeadDetail = {
  id: number;
  name: string;
  company: string;
  role: string;
  platform: string;
  lead_score: number;
  lead_quality: string;
  score_reason?: string[];
  intent?: string;
  reason?: string;
  ai_summary?: string;
  recommended_action?: string;
  created_at: string;
  status: string;
  discovery_source?: string;
  qualification_reason?: string[];
  confidence?: number;
  tags?: string[];
};

interface LeadDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  leadId: number | null;
}

export function LeadDetailDrawer({ open, onClose, leadId }: LeadDetailDrawerProps) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && leadId) {
      loadLeadDetails();
      loadActivities();
    } else {
      setLead(null);
      setActivities([]);
      setError("");
    }
  }, [open, leadId]);

  const loadLeadDetails = async () => {
    if (!leadId) return;

    setLoading(true);
    setError("");
    try {
      const data = await getLeadById(leadId);
      setLead(data);
    } catch (err) {
      console.error("Failed to load lead details:", err);
      setError("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    if (!leadId) return;

    try {
      const data = await getLeadActivities(leadId);
      setActivities(data.activities || []);
    } catch (err) {
      console.error("Failed to load activities:", err);
      // Don't set error for activities - it's optional
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Lead Details</h2>
            <p className="text-sm text-gray-400 mt-1">Complete lead profile and analysis</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading lead details...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        ) : lead ? (
          <>
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-[#1F2937] pb-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Name</label>
                  <div className="text-white font-medium mt-1">{lead.name || "N/A"}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Company</label>
                  <div className="text-white mt-1">{lead.company || "N/A"}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Role</label>
                  <div className="text-white mt-1">{lead.role || "N/A"}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Platform</label>
                  <div className="text-white mt-1">{lead.platform || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-[#1F2937] pb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Intelligence */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-[#1F2937] pb-2">
                Lead Intelligence
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Lead Score</label>
                    <div className="text-2xl font-bold text-white mt-1">{lead.lead_score || 0}</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Lead Quality</label>
                    <div className="text-white mt-1">{lead.lead_quality || "N/A"}</div>
                  </div>
                </div>
                {lead.score_reason && lead.score_reason.length > 0 && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Score Reason</label>
                    <ul className="mt-2 space-y-1">
                      {lead.score_reason.map((reason, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {lead.confidence !== undefined && lead.confidence !== null && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Confidence</label>
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-[#1F2937] rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${lead.confidence}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-semibold min-w-[3rem] text-right">
                          {lead.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {lead.intent && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Intent</label>
                    <div className="text-white mt-1">{lead.intent}</div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis */}
            {(lead.ai_summary || lead.recommended_action || lead.reason) && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-[#1F2937] pb-2">
                  AI Analysis
                </h3>
                <div className="space-y-3">
                  {lead.recommended_action && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Recommended Action</label>
                      <div className="mt-2 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-white font-semibold text-lg">{lead.recommended_action}</div>
                      </div>
                    </div>
                  )}
                  {lead.ai_summary && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">AI Summary</label>
                      <div className="text-white mt-1">{lead.ai_summary}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-[#1F2937] pb-2">
                Metadata
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Status</label>
                    <div className="text-white mt-1">{lead.status || "N/A"}</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Created Date</label>
                    <div className="text-white mt-1">{formatDate(lead.created_at)}</div>
                  </div>
                </div>
                {lead.discovery_source && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Engagement Source</label>
                    <div className="text-white mt-1">{lead.discovery_source}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#1F2937]">
              <Button variant="primary">View Followups</Button>
              <Button variant="ghost">Edit Lead</Button>
            </div>

            {/* Timeline */}
            <LeadActivityTimeline lead={lead} />
          </>
        ) : null}
      </div>
    </Drawer>
  );
}

export default LeadDetailDrawer;
