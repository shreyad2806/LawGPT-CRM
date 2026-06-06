"use client";

import React from "react";

type Activity = {
  id: number;
  activity_type: string;
  description: string;
  metadata?: any;
  created_at: string;
};

interface TimelineProps {
  activities: Activity[];
}

export function Timeline({ activities }: TimelineProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "lead_created":
        return "🎯";
      case "engagement_created":
        return "💬";
      case "ai_qualified":
        return "🤖";
      case "followup_created":
        return "📅";
      case "followup_completed":
        return "✅";
      case "status_updated":
        return "🔄";
      default:
        return "📝";
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case "lead_created":
        return "bg-blue-500/10 text-blue-400";
      case "engagement_created":
        return "bg-green-500/10 text-green-400";
      case "ai_qualified":
        return "bg-purple-500/10 text-purple-400";
      case "followup_created":
        return "bg-amber-500/10 text-amber-400";
      case "followup_completed":
        return "bg-emerald-500/10 text-emerald-400";
      case "status_updated":
        return "bg-cyan-500/10 text-cyan-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-sm">No activity yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.activity_type)}`}>
              {getActivityIcon(activity.activity_type)}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 flex-1 bg-[#1F2937] my-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium">{activity.description}</span>
              <span className="text-gray-500 text-xs">{formatDate(activity.created_at)}</span>
            </div>
            {activity.metadata && (
              <div className="text-gray-400 text-sm mt-1">
                {typeof activity.metadata === 'string' 
                  ? activity.metadata 
                  : Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-gray-500">{key}:</span> {String(value)}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
