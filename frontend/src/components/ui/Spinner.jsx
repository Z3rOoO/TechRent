"use client";
import React from "react";
import { cn } from "../../lib/utils";

const Spinner = ({ className }) => (
  <div
    className={cn(
      "inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-r-zinc-900",
      className
    )}
  />
);

export default Spinner;
