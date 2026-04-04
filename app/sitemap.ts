import { MetadataRoute } from "next";
export const revalidate = 3600; // Cachear por 1 hora

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://cuandollega-tawny.vercel.app";

    return [
        {
            url: baseUrl,
            lastModified: new Date("2026-04-03"),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/recorrido`,
            lastModified: new Date("2026-04-03"),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];
}
