import React from "react";
import { Card } from "@/components/ui/Card";

interface FilterTabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterTabs({ items, active, onChange }: FilterTabsProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              active === item
                ? "bg-[#3B82F6] text-white"
                : "bg-[#1F2937] text-gray-400 hover:bg-[#2D3748]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </Card>
  );
}
