"use client";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <div className="flex flex-1 w-full">
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
