"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Header */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </main>
      </div>
    </div>
  );
}
