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
  image_url?: string;
  status?: string;
  created_at?: string;
};

export default function ContentReviewModal({
  open,
  onClose,
  content,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  content?: ContentItem | null;
  onToast?: (message: string) => void;
}) {
  if (!content) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (onToast) onToast("Copied!");
  };

  return (
    <Dialog open={open} onClose={onClose} title={content.trend_title || "Preview"}>
      <div className="space-y-4">
        {content.image_url && (
          <div className="w-full flex justify-center">
            <img src={content.image_url} alt="Infographic" className="max-h-72 rounded-md border border-[#1F2937]" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-400 font-medium">Hook</h3>
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content.hook || "")}>
            Copy Hook
          </Button>
        </div>
        <p className="mt-1 text-gray-300">{content.hook}</p>

        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-400 font-medium">LinkedIn Post</h3>
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content.linkedin_post || "")}>
            Copy Post
          </Button>
        </div>
        <p className="mt-1 text-gray-300 whitespace-pre-line">{content.linkedin_post}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-400 font-medium">CTA</h3>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content.cta || "")}>
                Copy CTA
              </Button>
            </div>
            <p className="mt-1 text-gray-300">{content.cta}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-400 font-medium">Hashtags</h3>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(Array.isArray(content.hashtags) ? content.hashtags.join(" ") : String(content.hashtags || ""))}>
                Copy Hashtags
              </Button>
            </div>
            <p className="mt-1 text-gray-300"> {Array.isArray(content.hashtags)
            ? content.hashtags.join(", ")
            : String(content.hashtags || "")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(`${content.hook}\n\n${content.linkedin_post}\n\n${content.cta}\n\n${Array.isArray(content.hashtags) ? content.hashtags.join(" ") : String(content.hashtags || "")}`)}>
            Copy Full Post
          </Button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">{content.status}</span>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
