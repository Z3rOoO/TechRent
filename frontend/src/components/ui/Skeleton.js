"use client";
import React from "react";
import { cn } from "../../lib/utils";

export const SkeletonCard = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-lg border border-gray-700/30 bg-gray-900/50 p-6 space-y-4",
      className
    )}
    {...props}
  >
    <div className="skeleton h-6 w-3/4 rounded"></div>
    <div className="skeleton h-4 w-full rounded"></div>
    <div className="skeleton h-4 w-5/6 rounded"></div>
    <div className="flex gap-2 pt-4">
      <div className="skeleton h-10 flex-1 rounded-lg"></div>
      <div className="skeleton h-10 flex-1 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonLine = ({ className, ...props }) => (
  <div
    className={cn("skeleton h-4 w-full rounded", className)}
    {...props}
  />
);

export const SkeletonCircle = ({ className, size = 40, ...props }) => (
  <div
    className={cn("skeleton rounded-full", className)}
    style={{ width: size, height: size }}
    {...props}
  />
);

export const SkeletonGrid = ({ count = 6, className }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
