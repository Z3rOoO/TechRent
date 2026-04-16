"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-700 text-slate-100 border border-slate-600",
    secondary: "bg-slate-600 text-slate-200 border border-slate-500",
    destructive: "bg-red-600/30 text-red-200 border border-red-600",
    success: "bg-green-600/30 text-green-200 border border-green-600",
    warning: "bg-yellow-600/30 text-yellow-200 border border-yellow-600",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;
