"use client";

import React from "react";
import Select from "@/components/ui/Select";

interface Props {
  value: string;
  contentId: string | number;
  onChange: (newStatus: string) => void;
  onToast?: (msg: string) => void;
}

export default function StatusDropdown({
  value,
  contentId,
  onChange,
}: Props) {
  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Posted", label: "Posted" },
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Select
        value={value}
        options={statusOptions}
        variant="badge"
        onChange={(newStatus) => {
          console.log("Status changed:", newStatus);
          onChange(newStatus);
        }}
      />
    </div>
  );
}