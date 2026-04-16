"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "./Button";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("techrent_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("techrent_token");
    localStorage.removeItem("techrent_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <nav className="max-w-full px-4 md:px-6 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-bold text-lg text-slate-100 hover:text-slate-50 transition-colors duration-300 tracking-tight"
        >
          TechRent
        </Link>

        <div className="flex-1" />

        {mounted && user ? (
          <UserMenu user={user} onLogout={handleLogout} />
        ) : (
          <Button asChild size="sm">
            <Link href="/login">Entrar</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
