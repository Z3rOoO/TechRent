"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={cn(
      "w-full px-4 py-2.5 border border-gray-700/50 rounded-lg bg-gray-800/60 text-gray-100 text-sm placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600/30 hover:border-gray-700 hover:bg-gray-800/80 disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-800 backdrop-blur-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
