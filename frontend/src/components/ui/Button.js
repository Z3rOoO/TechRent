"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ children, className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const variants = {
      default: "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95",
      outline: "border-2 border-slate-600 text-slate-100 hover:bg-slate-800 hover:border-slate-500",
      ghost: "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100",
      destructive: "bg-linear-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl active:scale-95",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-lg",
    };

    const baseClasses = cn(
      "inline-flex items-center justify-center font-semibold transition-all duration-200 active:duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed",
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
