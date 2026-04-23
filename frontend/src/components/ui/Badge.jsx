"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-700/50 text-gray-200 border border-gray-600/50",
    secondary: "bg-gray-600/50 text-gray-100 border border-gray-500/50",
    destructive: "bg-red-600/20 text-red-300 border border-red-600/40",
    success: "bg-green-600/20 text-green-300 border border-green-600/40",
    warning: "bg-amber-600/20 text-amber-300 border border-amber-600/40",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-105",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;
