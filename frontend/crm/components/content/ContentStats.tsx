import React from "react";
import { Card } from "@/components/ui/Card";

export function ContentStats() {
  const stats = [
    { label: "DRAFTS", value: "142" },
    { label: "APPROVED", value: "187" },
    { label: "REJECTED", value: "29" },
    { label: "POSTED", value: "384" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
