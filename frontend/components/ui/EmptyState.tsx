import React from "react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
