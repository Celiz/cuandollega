"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// Leaflet can't run on the server – dynamic import with ssr:false is mandatory
const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        fontSize: 14,
        gap: 10,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          border: "2px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin-slow 0.8s linear infinite",
        }}
      />
      Cargando mapa…
    </div>
  ),
});

export default function RecorridoClient() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <header
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text-dim)",
            textDecoration: "none",
            transition: "border-color 0.15s ease, color 0.15s ease",
            flexShrink: 0,
          }}
          title="Volver al inicio"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 900,
              fontSize: 20,
              color: "var(--text)",
              letterSpacing: 0.5,
              lineHeight: 1.1,
            }}
          >
            Recorrido <span style={{ color: "var(--accent)" }}>521</span>
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-dim)",
              marginTop: 2,
            }}
          >
            Playa Serena → Mar Chiquita
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            background: "rgba(245,166,35,0.12)",
            border: "1px solid rgba(245,166,35,0.3)",
            borderRadius: 8,
            padding: "4px 10px",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--accent)",
            flexShrink: 0,
          }}
        >
          MAPA
        </div>
      </header>

      {/* ── Map fills remaining height ──────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <RouteMap
          geojsonUrl="/serena-marChiquita.geojson"
          routeName="Playa Serena → Mar Chiquita"
          accentColor="#f5a623"
        />
      </div>
    </div>
  );
}
