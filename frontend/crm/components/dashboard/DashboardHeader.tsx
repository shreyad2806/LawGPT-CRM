import React from "react";

export function DashboardHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-xs text-gray-500 font-medium">
        AI pipeline overview · Last run 14 min ago
      </p>
    </div>
  );
}
