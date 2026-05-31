import React from "react";
import { Card } from "@/components/ui/Card";

interface MetricItem {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    color: string;
  };
}

interface MetricCardProps {
  title: string;
  viewAllLink?: string;
  items: MetricItem[];
}

export function MetricCard({ title, viewAllLink, items }: MetricCardProps) {
  return (
    <Card className="flex flex-col mt-4">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">
            View all
          </a>
        )}
      </div>
      <div className="divide-y divide-[#1F2937]">
        {items.map((item, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div>
              <h3 className="text-[13px] font-medium text-white mb-1">{item.title}</h3>
              {item.subtitle && <p className="text-[11px] text-gray-500 font-medium">{item.subtitle}</p>}
            </div>
            {item.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.badge.color}`}>
                {item.badge.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
