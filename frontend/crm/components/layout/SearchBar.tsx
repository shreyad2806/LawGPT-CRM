"use client";

import React from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full p-2 pl-10 text-sm text-slate-200 bg-slate-800 border border-slate-700 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
        placeholder="Search..."
      />
    </div>
  );
}
