import React from "react";
import { TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "warning";
}

export function StatCard({ title, value, change, trend }: StatCardProps) {
  return (
    <Card className="p-5">
      <h3 className="text-gray-400 text-[10px] font-semibold tracking-wider mb-2 uppercase">{title}</h3>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className={`flex items-center text-[11px] font-medium ${
        trend === "up" ? "text-[#22C55E]" : "text-[#F59E0B]"
      }`}>
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <Clock className="w-3 h-3 mr-1" />
        )}
        {change}
      </div>
    </Card>
  );
}
