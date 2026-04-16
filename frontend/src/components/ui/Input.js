"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={cn(
      "w-full px-4 py-2.5 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-100 text-sm placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 hover:border-slate-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed backdrop-blur-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
