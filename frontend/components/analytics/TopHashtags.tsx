"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface TopCompaniesProps {
  topCompanies: any[];
}

export function TopHashtags({ topCompanies }: TopCompaniesProps) {
  if (!topCompanies || topCompanies.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Top Companies
        </h3>
        <div className="text-gray-400 text-xs">No company data available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Top Companies
      </h3>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-400 border-b border-[#1F2937] pb-2">
          <div>Company</div>
          <div className="text-right">Lead Count</div>
        </div>
        {topCompanies.map((item: any, index: number) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-2 text-xs"
          >
            <div className="text-white truncate">{item.company}</div>
            <div className="text-green-400 text-right font-medium">{item.count}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
