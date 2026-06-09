"use client"

import React from "react";
import { Button } from "@/components/ui/Button";

export default function DeleteLeadModal({
  open,
  onClose,
  onConfirm,
  leadName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2937] rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Lead?</h2>
        
        <p className="text-gray-300 mb-4">
          This will permanently remove:
        </p>
        
        <ul className="text-gray-400 mb-6 list-disc list-inside space-y-1">
          <li>Lead</li>
          <li>Followups</li>
          <li>Memory</li>
          <li>Activities</li>
        </ul>
        
        {leadName && (
          <p className="text-gray-400 mb-6 text-sm">
            Lead: <span className="text-white font-medium">{leadName}</span>
          </p>
        )}
        
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onConfirm();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
