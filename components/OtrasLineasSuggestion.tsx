import { Linea } from "@/lib/cuandoLlega.types";
import { memo } from "react";

interface OtrasLineasSuggestionProps {
  lineas: Linea[];
  loading: boolean;
  onSelect: (linea: Linea) => void;
}

export const OtrasLineasSuggestion = memo(function OtrasLineasSuggestion({
  lineas,
  loading,
  onSelect,
}: OtrasLineasSuggestionProps) {
  if (!loading && lineas.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 16,
        padding: "16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ display: "flex", color: "var(--text-dim)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M3 9h18"/><path d="M8 19v-3m8 3v-3"/><path d="M7 19h10"/><circle cx="7.5" cy="14.5" r=".5" fill="currentColor"/><circle cx="16.5" cy="14.5" r=".5" fill="currentColor"/></svg>
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-dim)",
            letterSpacing: 1.5,
            fontWeight: 600,
          }}
        >
          OTRAS LÍNEAS EN ESTA PARADA
        </span>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {/* Skeleton chips */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="blink"
              style={{
                background: "var(--surface2)",
                height: 32,
                width: 60,
                borderRadius: 8,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {lineas.map((linea) => (
            <button
              key={linea.CodigoLineaParada}
              onClick={() => onSelect(linea)}
              style={{
                background: "rgba(245, 166, 35, 0.1)",
                color: "var(--accent)",
                border: "1px solid rgba(245, 166, 35, 0.3)",
                borderRadius: 8,
                padding: "6px 12px",
                fontFamily: "var(--display)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--accent)";
                el.style.color = "#000";
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(245, 166, 35, 0.1)";
                el.style.color = "var(--accent)";
                el.style.transform = "translateY(0)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {linea.Descripcion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
