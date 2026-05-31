"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  BarChart2,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Followups", href: "/followups", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-16 bottom-0 w-60 bg-[#0F172A] border-r border-[#1F2937] z-40 transform transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full">
          {/* Close Button (Mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Items */}
          <div className="flex-1 pt-6 px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#3B82F6] text-white"
                      : "text-gray-400 hover:bg-[#1F2937] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-[#1F2937]">
            <p className="text-xs text-gray-500 px-4">LawGPT CRM v2.0</p>
          </div>
        </nav>
      </aside>
    </>
  );
}
