"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { getContent } from "@/lib/api/content";
import StatusDropdown from "@/components/content/status-dropdown";

export function RecentContentTable() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        console.log("Fetching content...");
        const data = await getContent();
        console.log("Response:", data);
        setContent(data);
      } catch (err) {
        console.error("Content API Error:", err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading) {
    return (
      <Card className="flex flex-col mt-4">
        <div className="p-4 text-gray-400">
          Loading content...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col mt-4">
        <div className="p-4 text-red-400">
          {error}
        </div>
      </Card>
    );
  }

  const contentData = content?.content || [];

  const normalizeStatus = (s: any) => {
    if (!s) return "Draft";
    const str = String(s);
    const lower = str.toLowerCase();
    if (lower === "draft") return "Draft";
    if (lower === "approved") return "Approved";
    if (lower === "rejected") return "Rejected";
    if (lower === "posted") return "Posted";
    // fallback
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="flex flex-col mt-4">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">Recent Content</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {contentData.map((item: any) => (
          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div className="flex items-center gap-3">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt="Infographic"
                  className="w-12 h-12 rounded object-cover border border-[#1F2937]"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-[#1F2937] flex items-center justify-center border border-[#374151]">
                  <span className="text-gray-500 text-xs">No image</span>
                </div>
              )}
              <div>
                <h3 className="text-[13px] font-medium text-white mb-1">{item.hook}</h3>
                <p className="text-[11px] text-gray-500 font-medium">{item.platform}</p>
              </div>
            </div>
            <div>
              <StatusDropdown
                value={normalizeStatus(item.status)}
                contentId={item.id}
                onChange={(newStatus: string) => {
                  // optimistic local update
                  setContent((prev: any) => {
                    if (!prev) return prev;
                    return { ...prev, content: (prev.content || []).map((c: any) => (c.id === item.id ? { ...c, status: newStatus } : c)) };
                  });
                }}
                onToast={(msg: string) => console.log(msg)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
