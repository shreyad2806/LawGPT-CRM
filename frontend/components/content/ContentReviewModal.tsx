"use client"

import React from "react";
import Dialog from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

type ContentItem = {
  id: string;
  trend_title?: string;
  hook?: string;
  linkedin_post?: string;
  cta?: string;
  hashtags?: string[];
  infographic_url?: string;
  status?: string;
  created_at?: string;
};

export default function ContentReviewModal({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content?: ContentItem | null;
}) {
  if (!content) return null;

  return (
    <Dialog open={open} onClose={onClose} title={content.trend_title || "Preview"}>
      <div className="space-y-4">
        {content.infographic_url && (
          <div className="w-full flex justify-center">
            <img src={content.infographic_url} alt="Infographic" className="max-h-72 rounded-md border border-[#1F2937]" />
          </div>
        )}

        <div>
          <h3 className="text-sm text-gray-400 font-medium">Hook</h3>
          <p className="mt-1 text-gray-300">{content.hook}</p>
        </div>

        <div>
          <h3 className="text-sm text-gray-400 font-medium">LinkedIn Post</h3>
          <p className="mt-1 text-gray-300 whitespace-pre-line">{content.linkedin_post}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-400 font-medium">CTA</h3>
            <p className="mt-1 text-gray-300">{content.cta}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 font-medium">Hashtags</h3>
            <p className="mt-1 text-gray-300"> {Array.isArray(content.hashtags)
            ? content.hashtags.join(", ")
            : String(content.hashtags || "")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
          <div className="text-sm text-gray-400">Created: <span className="text-gray-300">{content.created_at}</span></div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">{content.status}</span>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
