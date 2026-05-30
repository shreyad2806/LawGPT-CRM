"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { 
  Menu, 
  MoreVertical, 
  LayoutDashboard,
  FileText, 
  Users,
  MessageSquare,
  BarChart2
} from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Followups", href: "/followups", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
      <div className="flex h-16 items-center px-4 md:px-6">
        
        {/* Mobile Menu Button */}
        <button className="mr-4 md:hidden p-2 text-slate-400 hover:text-slate-200">
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">
              L
            </div>
            <span className="hidden lg:inline-block font-semibold text-lg text-slate-100">
              LawGPT CRM
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-1 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-slate-200 whitespace-nowrap ${
                  isActive ? "text-blue-400" : "text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xl:inline-block">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Search and More Menu */}
        <div className="flex items-center space-x-4 ml-auto md:ml-4">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
