// app/recorrido/page.tsx
// Static route – no server data needed; the map is fully client-side.

import type { Metadata } from "next";
import RecorridoClient from "./RecorridoClient";

export const metadata: Metadata = {
    title: "Recorridos de Colectivos MDP",
    description: "Mirá el mapa completo con todos los recorridos y paradas de las líneas de colectivos en Mar del Plata. Mapa interactivo actualizado de MGP.",
    alternates: {
        canonical: "/recorrido",
    },
};

export default function RecorridoPage() {
    return <RecorridoClient />;
}
