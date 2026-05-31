"use client";

import React from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Menu, MoreVertical, Bell } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2937] bg-[#0A0A0F] h-16">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        
        {/* Left: Mobile Menu Button + Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-7 h-7 bg-[#3B82F6] rounded flex items-center justify-center font-bold text-white text-sm">
              L
            </div>
            <span className="hidden sm:inline-block font-semibold text-base text-white">
              LawGPT CRM
            </span>
          </Link>
        </div>

        {/* Right Side: Search, Notification, and Profile Menu */}
        <div className="flex items-center space-x-3 ml-auto">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          
          {/* Notification Icon */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1F2937] rounded-md transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* More Menu */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1F2937] rounded-md transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
