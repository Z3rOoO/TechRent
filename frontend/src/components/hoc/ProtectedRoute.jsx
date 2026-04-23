"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../ui/Spinner";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");

    if (!raw || !token) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(raw);
      setUser(userData);

      // Se não há roles específicas, permite acesso
      if (allowedRoles.length === 0) {
        setAuthorized(true);
      } else if (allowedRoles.includes(userData.nivel_acesso)) {
        setAuthorized(true);
      } else {
        // Acesso negado - redirecionar para home
        router.push("/");
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-100">Acesso Negado</h1>
          <p className="text-slate-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return children;
}
