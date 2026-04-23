"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-700/50 border border-slate-600 text-slate-200",
    destructive: "bg-red-900/20 border border-red-700 text-red-200",
    success: "bg-green-900/20 border border-green-700 text-green-200",
  };

  return (
    <div
      ref={ref}
      className={cn("rounded-lg p-4 backdrop-blur-sm transition-all duration-200", variants[variant], className)}
      {...props}
    />
  );
});

Alert.displayName = "Alert";

export default Alert;
