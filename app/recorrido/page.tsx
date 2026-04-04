// app/recorrido/page.tsx
// Static route – no server data needed; the map is fully client-side.

import type { Metadata } from "next";
import RecorridoClient from "./RecorridoClient";

export const metadata: Metadata = {
    title: "Recorridos de colectivos | CuándoLlega MDP",
    description:
        "Explorá el mapa interactivo con el recorrido y paradas de todas las líneas de colectivo de Mar del Plata. Seleccioná cualquier línea, cambiá de ramal y obtené indicaciones en Google Maps.",
};

export default function RecorridoPage() {
    return <RecorridoClient />;
}
