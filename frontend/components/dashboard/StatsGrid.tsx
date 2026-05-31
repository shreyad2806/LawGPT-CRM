import React from "react";
import { StatCard, StatCardProps } from "@/components/shared/StatCard";

const stats: StatCardProps[] = [
  {
    title: "TRENDS ANALYZED",
    value: "2,847",
    change: "+18.4% this week",
    trend: "up",
  },
  {
    title: "CONTENT GENERATED",
    value: "384",
    change: "+31 today",
    trend: "up",
  },
  {
    title: "QUALIFIED LEADS",
    value: "1,029",
    change: "+9.2% this month",
    trend: "up",
  },
  {
    title: "FOLLOWUPS PENDING",
    value: "63",
    change: "12 due today",
    trend: "warning",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
