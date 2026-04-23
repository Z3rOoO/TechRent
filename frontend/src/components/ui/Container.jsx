"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Container = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12", className)}
    {...props}
  />
));

Container.displayName = "Container";

export default Container;
