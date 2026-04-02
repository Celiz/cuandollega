"use client";

import { IconBus } from "./icons/IconBus";

interface HeaderProps {
    tab: "buscar" | "favoritos";
    setTab: (t: "buscar" | "favoritos") => void;
    favCount: number;
}

export function Header({ tab, setTab, favCount }: HeaderProps) {
    return (
        <header style={{
            padding: "16px 20px 0", borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
        }}>
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                        background: "var(--accent)", borderRadius: 8, padding: "5px 8px",
                        color: "#000", display: "flex",
                    }}>
                        <IconBus />
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 22, letterSpacing: 1, lineHeight: 1 }}>
                            ¿CUÁNDO LLEGA?
                        </div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", letterSpacing: 2 }}>
                            MAR DEL PLATA · TIEMPO REAL
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 0 }}>
                    {(["buscar", "favoritos"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            flex: 1, padding: "8px 0", background: "none", border: "none",
                            borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                            color: tab === t ? "var(--accent)" : "var(--text-dim)",
                            fontFamily: "var(--display)", fontWeight: 700, fontSize: 15, letterSpacing: 1,
                            cursor: "pointer", transition: "all 0.15s", textTransform: "uppercase",
                        }}>
                            {t === "buscar" ? "🔍 Buscar" : `⭐ Favoritos (${favCount})`}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}
