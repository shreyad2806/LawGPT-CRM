import React from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AgentStatusDot } from "@/components/ui/AgentStatusDot";

const agents: Array<{
  name: string;
  statusText: string;
  time: string;
  state: "complete" | "queued" | "running";
}> = [
  { name: "Trend Agent", statusText: "Complete - 847 trends scanned", time: "09:02 AM · 4m 12s", state: "complete" },
  { name: "Strategy Agent", statusText: "Complete - 38 strategies formed", time: "09:06 AM · 2m 48s", state: "complete" },
  { name: "Content Agent", statusText: "Complete - 112 posts drafted", time: "09:09 AM · 6m 03s", state: "complete" },
  { name: "Analytics Agent", statusText: "Complete - Engagement scored", time: "09:15 AM · 1m 22s", state: "complete" },
  { name: "Lead Discovery Agent", statusText: "Complete - 294 leads found", time: "09:17 AM · 3m 55s", state: "complete" },
  { name: "Lead Qualification Agent", statusText: "Complete - 89 qualified", time: "09:21 AM · 2m 10s", state: "complete" },
  { name: "Followup Agent", statusText: "Complete - 63 messages queued", time: "09:23 AM · 58s", state: "queued" },
];

export function AgentTimeline() {
  return (
    <Card className="p-5 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold text-white">Agent Execution Timeline</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 flex items-center transition-colors">
          View logs <ArrowRight className="w-3 h-3 ml-1" />
        </a>
      </div>
      <div className="space-y-5 relative flex-1">
        {/* Vertical Line */}
        <div className="absolute left-[5.5px] top-2 bottom-0 w-px bg-gradient-to-b from-transparent via-[#1F2937] to-transparent z-0" />
        
        {agents.map((agent) => (
          <div key={agent.name} className="relative flex items-start gap-4">
            <AgentStatusDot state={agent.state} />
            <div>
              <h3 className="text-[13px] font-medium text-white mb-0.5">{agent.name}</h3>
              <p className={`text-[11px] ${agent.state === "complete" ? "text-[#22C55E]" : "text-[#3B82F6]"} mb-0.5`}>
                {agent.statusText}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">{agent.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
