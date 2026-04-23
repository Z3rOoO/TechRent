"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Container = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12", className)}
    {...props}
  />
));

Container.displayName = "Container";

export default Container;
