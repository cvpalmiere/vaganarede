import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://vagasnarede.com.br", lastModified: new Date(), priority: 1 },
    { url: "https://vagasnarede.com.br/cadastro", lastModified: new Date(), priority: 0.8 },
    { url: "https://vagasnarede.com.br/login", lastModified: new Date(), priority: 0.5 },
    { url: "https://vagasnarede.com.br/termos", lastModified: new Date(), priority: 0.3 },
    { url: "https://vagasnarede.com.br/privacidade", lastModified: new Date(), priority: 0.3 },
  ];
}