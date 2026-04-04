// app/recorrido/page.tsx
// Static route – no server data needed; the map is fully client-side.

import type { Metadata } from "next";
import RecorridoClient from "./RecorridoClient";

export const metadata: Metadata = {
    title: "Recorrido 221 — Playa Serena · Mar Chiquita | CuándoLlega MDP",
    description:
        "Mapa interactivo del recorrido del colectivo 221 desde Playa Serena hasta Mar Chiquita. Seleccioná cada parada para obtener indicaciones en Google Maps.",
};

export default function RecorridoPage() {
    return <RecorridoClient />;
}
