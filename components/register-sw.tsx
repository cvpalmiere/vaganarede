"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // falha silenciosa - PWA nao pode quebrar a experiencia web normal
      });
    }
  }, []);

  return null;
}
