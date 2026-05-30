import React from "react";

export function AgentStatusDot({ state }: { state: "complete" | "queued" | "running" }) {
  const color = state === "complete" ? "bg-[#22C55E]" : "bg-[#3B82F6]";
  
  return (
    <div className="mt-1.5 w-3 h-3 rounded-full bg-[#111827] flex items-center justify-center relative z-10">
      <div className={`w-2 h-2 rounded-full ${color}`} />
    </div>
  );
}
