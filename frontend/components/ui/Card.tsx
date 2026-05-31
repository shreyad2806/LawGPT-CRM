import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111827] border border-[#1F2937] rounded-lg ${className}`}>
      {children}
    </div>
  );
}
