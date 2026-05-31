import React from "react";
import { Card } from "@/components/ui/Card";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ data, columns, emptyMessage = "No data available", onRowClick }: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1F2937] bg-[#0A0A0F]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className={`text-left text-xs font-semibold text-gray-400 uppercase tracking-wide ${
                    index === 0 ? "px-6 py-4" : "px-6 py-3"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-[#1F2937] hover:bg-[#111827]/50 transition-colors cursor-pointer ${
                  index === data.length - 1 ? "border-b-0" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-3 text-gray-300">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </Card>
  );
}
