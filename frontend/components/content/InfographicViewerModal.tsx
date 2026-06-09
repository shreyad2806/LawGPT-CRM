"use client"

import React from "react";
import { Button } from "@/components/ui/Button";

type ContentItem = {
  id: string;
  image_url?: string;
};

export default function InfographicViewerModal({
  open,
  onClose,
  content,
  onDownload,
  onRegenerate,
  isRegenerating,
}: {
  open: boolean;
  onClose: () => void;
  content?: ContentItem | null;
  onDownload: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  if (!open || !content) return null;

  // Handle URL: if it starts with "/", prepend localhost:8000, otherwise use directly
  const imageUrl = content.image_url?.startsWith("/")
    ? `http://localhost:8000${content.image_url}`
    : content.image_url;

  const handleDownload = () => {
    console.log("[INFOGRAPHIC] Download clicked");
    onDownload();
  };

  const handleRegenerate = () => {
    console.log("[INFOGRAPHIC] Regenerate clicked");
    onRegenerate();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2937] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-[#374151] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Infographic Preview</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("[INFOGRAPHIC] Close clicked");
              onClose();
            }}
          >
            Close
          </Button>
        </div>
        <div className="p-4 flex justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Infographic"
              className="max-w-full rounded"
            />
          ) : (
            <div className="text-gray-400">No image available</div>
          )}
        </div>
        <div className="p-4 border-t border-[#374151] flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            Download
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
