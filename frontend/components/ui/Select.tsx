"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
  variant?: "badge" | "default";
}

export function Select({ value, onChange, options, disabled = false, loading = false, variant = "badge" }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; transformOrigin?: string } | null>(null);

  const selectedOption = options.find(opt => opt.value.toLowerCase() === (value || "").toLowerCase());

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  useEffect(() => {
    // Debug: log incoming value changes
    // eslint-disable-next-line no-console
    console.log("Select value prop changed:", value);
  }, [value]);

  // Position the portal menu relative to the trigger
  useEffect(() => {
    if (!isOpen || !selectRef.current) {
      setMenuStyle(null);
      return;
    }

    const rect = selectRef.current.getBoundingClientRect();

    const computePosition = () => {
      const left = rect.left + window.scrollX;
      // default below
      let top = rect.bottom + window.scrollY + 6;
      // temporary set to place; if menu overflows we'll adjust after render
      setMenuStyle({ top, left, transformOrigin: 'top left' });
    };

    computePosition();

    const handleResize = () => {
      const r = selectRef.current!.getBoundingClientRect();
      setMenuStyle({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  // After menu mounts, adjust if it overflows viewport
  useEffect(() => {
    if (!isOpen || !menuRef.current || !menuStyle) return;
    const menuRect = menuRef.current.getBoundingClientRect();
    const buffer = 8;
    let top = menuStyle.top;
    if (menuRect.bottom > window.innerHeight - buffer) {
      // open upwards
      const triggerRect = selectRef.current!.getBoundingClientRect();
      top = triggerRect.top + window.scrollY - menuRect.height - 6;
    }
    // update if changed
    if (Math.abs(top - menuStyle.top) > 1) {
      setMenuStyle((s) => s ? { ...s, top } : { top, left: menuStyle.left });
    }
  }, [isOpen, menuRef.current, menuStyle]);

  const handleSelect = (optionValue: string) => {
    // Debug: log selection
    // eslint-disable-next-line no-console
    console.log("Select clicked option:", optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const buttonStyles = variant === "badge"
    ? `flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
      } ${selectedOption?.color || "bg-gray-500/10 text-gray-400"}`
    : `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border border-[#1F2937] bg-[#0A0A0F] text-gray-300 hover:border-blue-500/50 hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`;

  return (
    <div ref={selectRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && !loading) setIsOpen(!isOpen);
        }}
        disabled={disabled || loading}
        className={buttonStyles}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </span>
        ) : (
          <>
            {selectedOption?.label || value}
            <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
      {isOpen && !disabled && !loading && selectRef.current && (
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "absolute", top: menuStyle ? menuStyle.top : 0, left: menuStyle ? menuStyle.left : 0 }}
            className={"z-[9999] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl min-w-[140px] overflow-hidden"}
          >
            {options.map((option) => (
  <button
    key={option.value}
    onClick={(e) => {
      e.stopPropagation();
      // eslint-disable-next-line no-console
      console.log("click:", option.value);
      handleSelect(option.value);
    }}

      className={`w-full text-left px-3 py-2 text-sm transition-all ${
      option.value.toLowerCase() === (value || "").toLowerCase()
        ? "bg-slate-800 text-white"
        : "text-gray-300"
       } ${
       option.value.toLowerCase() === (value || "").toLowerCase()
        ? ""
        : "hover:bg-slate-800/60"
        }`}
        type="button"
  >
        {option.label}
        </button>
        ))}
          </div>,
          document.body
        )
      )}
    </div>
  );
}

export default Select;
