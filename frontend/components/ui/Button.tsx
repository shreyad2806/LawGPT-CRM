import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, variant = "primary", size = "md", className = "", onClick, disabled = false }: ButtonProps) {
  const variantStyles = {
    primary: "bg-[#3B82F6] text-white hover:bg-blue-600",
    secondary: "bg-[#1F2937] text-white hover:bg-gray-700",
    ghost: "bg-transparent text-gray-300 hover:bg-[#1F2937]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} rounded-md font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
