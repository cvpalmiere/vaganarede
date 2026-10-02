"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function AtivarPush() {
  const [status, setStatus] = useState<"inicial" | "ativando" | "ativo" | "negado">("inicial");

  async function ativar() {
    setStatus("ativando");
    try {
      const permissao = await Notification.requestPermission();
      if (permissao !== "granted") {
        setStatus("negado");
        return;
      }

      const registro = await navigator.serviceWorker.ready;
      const subscription = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch("/api/candidato/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setStatus("ativo");
    } catch {
      setStatus("negado");
    }
  }

  if (status === "ativo") {
    return <p className="text-sm text-green-700 flex items-center gap-2"><Bell className="w-4 h-4" /> Notificações ativadas</p>;
  }

  return (
    <button onClick={ativar} disabled={status === "ativando"} className="flex items-center gap-2 text-sm font-semibold text-deep-black hover:text-electric-yellow-dark transition">
      <Bell className="w-4 h-4" />
      {status === "ativando" ? "Ativando..." : status === "negado" ? "Permissão negada — tente de novo" : "Ativar notificações"}
    </button>
  );
}