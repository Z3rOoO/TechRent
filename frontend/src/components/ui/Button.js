"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ children, className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const variants = {
      default: "bg-white text-black hover:bg-gray-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold",
      outline: "border-2 border-gray-700 text-gray-200 hover:bg-gray-800/50 hover:border-gray-600 hover:-translate-y-0.5 transition-all",
      ghost: "text-gray-400 hover:bg-gray-800/30 hover:text-gray-200 hover:-translate-y-0.5",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold",
      secondary: "bg-gray-800 text-gray-100 hover:bg-gray-700 hover:-translate-y-0.5 shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-lg",
      xl: "px-8 py-4 text-lg rounded-lg",
    };

    const baseClasses = cn(
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      return React.cloneElement(children, {
        className: baseClasses,
        ...props,
      });
    }

    return (
      <button className={baseClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
