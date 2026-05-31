import React from "react";

interface HeaderProps {
  title: string;
  description?: string;
  variant?: "page" | "dashboard";
}

export function Header({ title, description, variant = "page" }: HeaderProps) {
  if (variant === "dashboard") {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
        {description && <p className="text-xs text-gray-500 font-medium">{description}</p>}
      </div>
    );
  }

  return (
    <div className="border-b border-[#1F2937] bg-[#0A0A0F] px-6 py-4">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      {description && <p className="text-gray-400 text-sm">{description}</p>}
    </div>
  );
}
