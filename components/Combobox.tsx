"use client";

import { useState, useEffect, useRef } from "react";
import { IconChevron } from "./icons/IconChevron";

export function Combobox({
    placeholder, value, onChange, options, disabled = false, loading = false,
}: {
    placeholder: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[]; disabled?: boolean; loading?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find(o => o.value === value);
    const filtered = query
        ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 40)
        : options.slice(0, 80);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleOpen = () => {
        if (disabled) return;
        setOpen(true);
        setQuery("");
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleSelect = (v: string) => {
        onChange(v);
        setOpen(false);
        setQuery("");
    };

    return (
        <div ref={ref} style={{ position: "relative", width: "100%" }}>
            <button
                onClick={handleOpen}
                disabled={disabled}
                style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", background: "var(--surface2)", border: "1px solid var(--border)",
                    borderRadius: 8, color: selected ? "var(--text)" : "var(--text-dim)",
                    fontFamily: "var(--display)", fontSize: 16, fontWeight: 600, letterSpacing: 0.5,
                    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
                    transition: "border-color 0.15s",
                }}
                onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
                <span>{loading ? "Cargando..." : (selected?.label ?? placeholder)}</span>
                <IconChevron open={open} />
            </button>

            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
                    background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)", overflow: "hidden",
                }}>
                    {options.length > 8 && (
                        <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)" }}>
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Buscar..."
                                style={{
                                    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                                    borderRadius: 6, color: "var(--text)", padding: "6px 10px",
                                    fontFamily: "var(--mono)", fontSize: 13, outline: "none",
                                }}
                            />
                        </div>
                    )}
                    <div style={{ maxHeight: 220, overflowY: "auto" }}>
                        {filtered.length === 0 ? (
                            <div style={{ padding: "12px 14px", color: "var(--text-dim)", fontSize: 14, fontFamily: "var(--mono)" }}>Sin resultados</div>
                        ) : filtered.map(o => (
                            <button
                                key={o.value}
                                onClick={() => handleSelect(o.value)}
                                style={{
                                    width: "100%", textAlign: "left", padding: "9px 14px",
                                    background: o.value === value ? "rgba(245,166,35,0.12)" : "transparent",
                                    color: o.value === value ? "var(--accent)" : "var(--text)",
                                    fontFamily: "var(--display)", fontSize: 15, fontWeight: 600,
                                    border: "none", cursor: "pointer", transition: "background 0.1s",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = o.value === value ? "rgba(245,166,35,0.12)" : "transparent"; }}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
