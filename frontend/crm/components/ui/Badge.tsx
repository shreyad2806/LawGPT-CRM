import React from "react";

interface BadgeProps {
  priority: "High" | "Med" | "Low";
}

export function Badge({ priority }: BadgeProps) {
  const styles = {
    High: "text-[#EF4444] bg-red-500/10",
    Med: "text-[#F59E0B] bg-amber-500/10",
    Low: "text-gray-400 bg-gray-800"
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${styles[priority]}`}>
      {priority}
    </span>
  );
}
