"use client";

import React from "react";

interface TimelineEvent {
  title: string;
  timestamp: string;
  description: string;
}

interface LeadActivityTimelineProps {
  lead: {
    created_at?: string;
    discovery_source?: string;
    lead_score?: number;
    lead_quality?: string;
    qualification_reason?: string[];
    recommended_action?: string;
  };
}

export function LeadActivityTimeline({ lead }: LeadActivityTimelineProps) {
  const formatTimestamp = (dateString: string, offsetSeconds: number = 0): string => {
    if (!dateString) return "Unknown";
    
    try {
      const date = new Date(dateString);
      date.setSeconds(date.getSeconds() + offsetSeconds);
      
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      
      return date.toLocaleDateString("en-US", options);
    } catch {
      return "Unknown";
    }
  };

  const generateTimeline = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    const createdAt = lead.created_at || new Date().toISOString();
    const discoverySource = lead.discovery_source || "Engagement";
    const leadScore = lead.lead_score || 50;
    const leadQuality = lead.lead_quality || "Cold";
    const recommendedAction = lead.recommended_action || "Ready for SDR outreach";

    // Event 1: Engagement Imported
    events.push({
      title: "Engagement Imported",
      timestamp: formatTimestamp(createdAt, 0),
      description: `Imported from ${discoverySource}`,
    });

    // Event 2: AI Analysis Completed
    events.push({
      title: "AI Analysis Completed",
      timestamp: formatTimestamp(createdAt, 2),
      description: `Lead Score: ${leadScore} (${leadQuality})`,
    });

    // Event 3: Lead Created
    events.push({
      title: "Lead Created",
      timestamp: formatTimestamp(createdAt, 3),
      description: "Automatically added to CRM",
    });

    // Event 4: Ready For Follow-up
    events.push({
      title: "Ready For Follow-up",
      timestamp: formatTimestamp(createdAt, 4),
      description: `AI recommends: ${recommendedAction}`,
    });

    return events;
  };

  const timeline = generateTimeline();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        Activity Timeline
      </h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-blue-500/30 to-transparent" />
        
        {/* Timeline Events */}
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={index} className="relative pl-8">
              {/* Circular Icon */}
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              
              {/* Event Content */}
              <div className="space-y-1">
                <div className="text-white font-medium text-sm">
                  {event.title}
                </div>
                <div className="text-gray-500 text-xs">
                  {event.timestamp}
                </div>
                <div className="text-gray-400 text-sm">
                  {event.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
