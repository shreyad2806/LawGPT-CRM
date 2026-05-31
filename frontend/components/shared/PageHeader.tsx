import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-[#1F2937] bg-[#0A0A0F] px-6 py-4">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}
