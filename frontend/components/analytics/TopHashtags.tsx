"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { getAnalyticsHashtags } from "@/lib/api/analytics";

export function TopHashtags() {
  const [hashtags, setHashtags] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHashtags() {
      try {
        const data = await getAnalyticsHashtags();
        console.log("HASHTAGS API:", data);
        setHashtags(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load hashtags");
      } finally {
        setLoading(false);
      }
    }

    loadHashtags();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Top Hashtags
        </h3>
        <div className="text-gray-400 text-xs">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Top Hashtags
        </h3>
        <div className="text-red-400 text-xs">{error}</div>
      </Card>
    );
  }

  const hashtagsData = hashtags?.hashtags || [];

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Top Hashtags
      </h3>
      <div className="flex flex-wrap gap-2">
        {hashtagsData.map((item: any) => (
          <span
            key={item.tag}
            className="px-3 py-1 bg-[#1F2937] text-blue-400 rounded-full text-xs font-medium hover:bg-[#2D3748] transition-colors cursor-pointer"
          >
            {item.tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
