"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { getContent } from "@/lib/api/content";

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

  return (
    <Card className="flex flex-col mt-4">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">Recent Content</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {contentData.map((item: any) => (
          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div>
              <h3 className="text-[13px] font-medium text-white mb-1">{item.hook}</h3>
              <p className="text-[11px] text-gray-500 font-medium">{item.platform}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              item.status === "Draft" ? "text-[#F59E0B] bg-amber-500/10" :
              item.status === "Approved" ? "text-[#3B82F6] bg-blue-500/10" :
              "text-[#22C55E] bg-green-500/10"
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
