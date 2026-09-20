import type { Metadata } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-sw";

export const metadata: Metadata = {
  title: "Vagas na Rede",
  description: "Matching inteligente entre candidatos e vagas",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}