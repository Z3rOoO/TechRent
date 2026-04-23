"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redireciona para /chamados que agora é unificado e detecta o perfil
export default function ChamadosTecnicoRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/chamados");
  }, []);
  return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
