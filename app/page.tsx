"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    getLineas, getIntersecciones, getParadas, getArribos,
    getFavoritos, saveFavorito, removeFavorito, isFavorito,
    type Linea, type Interseccion, type Parada, type Arribo, type Favorito,
} from "@/lib/cuandoLlega";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FavoritesList } from "@/components/FavoritesList";
import { SearchFlow } from "@/components/SearchFlow";

export default function Home() {
    const [tab, setTab] = useState<"buscar" | "favoritos">("buscar");

    // data
    const [lineas, setLineas] = useState<Linea[]>([]);
    const [intersecciones, setIntersecciones] = useState<Interseccion[]>([]);
    const [paradas, setParadas] = useState<Parada[]>([]);
    const [arribos, setArribos] = useState<Arribo[]>([]);
    const [favoritos, setFavoritos] = useState<Favorito[]>([]);
    const [calles, setCalles] = useState<{ value: string; label: string }[]>([]);

    // selected
    const [codLinea, setCodLinea] = useState("");
    const [codCalle, setCodCalle] = useState("");
    const [codInterseccion, setCodInterseccion] = useState("");
    const [paradaId, setParadaId] = useState("");
    const [paradaLinea, setParadaLinea] = useState("");
    const [selectedRamal, setSelectedRamal] = useState("TODOS");

    // loading/error
    const [loadingLineas, setLoadingLineas] = useState(true);
    const [loadingCalles, setLoadingCalles] = useState(false);
    const [loadingInter, setLoadingInter] = useState(false);
    const [loadingParadas, setLoadingParadas] = useState(false);
    const [loadingArribos, setLoadingArribos] = useState(false);
    const [error, setError] = useState("");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // auto-refresh
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [isConsulting, setIsConsulting] = useState(false);

    // load líneas
    useEffect(() => {
        getLineas()
            .then(setLineas)
            .catch(() => setError("No se pudieron cargar las líneas"))
            .finally(() => setLoadingLineas(false));
        setFavoritos(getFavoritos());
    }, []);

    // when línea changes: reset downstream, load calles
    useEffect(() => {
        setCodCalle(""); setCodInterseccion(""); setParadaId(""); setParadaLinea("");
        setIntersecciones([]); setParadas([]); setArribos([]); setCalles([]);
        setIsConsulting(false); setSelectedRamal("TODOS");
        if (!codLinea) return;
        setLoadingCalles(true);
        fetch("/api/cuando", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ accion: "RecuperarCallesPrincipalPorLinea", codLinea }).toString(),
        })
            .then(r => r.json())
            .then(data => {
                const raw: { Codigo: string; Descripcion: string }[] = data.calles ?? [];
                setCalles(raw.map(c => ({
                    value: c.Codigo,
                    label: c.Descripcion.replace(/ - MAR DEL PLATA$/, "").replace(/ - BARRIO .+$/, ""),
                })));
            })
            .catch(() => setError("Error al cargar calles"))
            .finally(() => setLoadingCalles(false));
    }, [codLinea]);

    // when calle changes: load intersecciones
    useEffect(() => {
        setCodInterseccion("");
        setParadaId("");
        setParadaLinea("");
        setParadas([]);
        setArribos([]);
        setIsConsulting(false);
        setSelectedRamal("TODOS");
        if (!codLinea || !codCalle) return;
        setLoadingInter(true);
        getIntersecciones(codLinea, codCalle)
            .then(setIntersecciones)
            .catch(() => setError("Error al cargar intersecciones"))
            .finally(() => setLoadingInter(false));
    }, [codLinea, codCalle]);

    // when interseccion changes: load paradas
    useEffect(() => {
        setParadaId("");
        setParadaLinea("");
        setParadas([]);
        setArribos([]);
        setIsConsulting(false);
        setSelectedRamal("TODOS");
        if (!codLinea || !codCalle || !codInterseccion) return;
        setLoadingParadas(true);
        getParadas(codLinea, codCalle, codInterseccion)
            .then(setParadas)
            .catch(() => setError("Error al cargar paradas"))
            .finally(() => setLoadingParadas(false));
    }, [codLinea, codCalle, codInterseccion]);

    const fetchArribos = useCallback(async (pid: string, pl: string) => {
        if (!pid || !pl) return;
        setLoadingArribos(true);
        setError("");
        try {
            const data = await getArribos(pid, pl);
            setArribos(data);
            setLastUpdate(new Date());
        } catch {
            setError("Error al consultar arribos");
        } finally {
            setLoadingArribos(false);
        }
    }, []);

    // fetch arrivals only when isConsulting is true
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!isConsulting || !paradaId || !codLinea) { setArribos([]); return; }
        fetchArribos(paradaId, codLinea);
        intervalRef.current = setInterval(() => fetchArribos(paradaId, codLinea), 30000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isConsulting, paradaId, codLinea, fetchArribos]);

    const handleConsultar = () => {
        if (!paradaId) return;
        setIsConsulting(true);
    };

    const handleFavFromArribos = (arribo: Arribo) => {
        const id = `${paradaId}_${arribo.CodigoLineaParada}`;
        if (isFavorito(id)) {
            removeFavorito(id);
        } else {
            saveFavorito({
                id,
                nombre: `${arribo.DescripcionLinea} — ${arribo.DescripcionCartelBandera}`,
                identificadorParada: paradaId,
                codigoLineaParada: arribo.CodigoLineaParada,
                descripcionLinea: arribo.DescripcionLinea,
                descripcionBandera: arribo.DescripcionCartelBandera,
            });
        }
        setFavoritos(getFavoritos());
    };

    const fetchFavArribos = async (fav: Favorito) => {
        setTab("buscar");
        setArribos([]);
        setParadaId(fav.identificadorParada);
        setParadaLinea(fav.codigoLineaParada);
        setCodLinea(fav.id.split("_")[1]); // Try to recover linea from ID if possible
        setIsConsulting(true);
    };

    const removeFav = (id: string) => {
        removeFavorito(id);
        setFavoritos(getFavoritos());
    };

    const lineaOptions = lineas.map(l => ({ value: l.CodigoLineaParada, label: l.Descripcion }));
    const interOptions = intersecciones.map(i => ({
        value: i.Codigo,
        label: i.Descripcion.replace(/ - MAR DEL PLATA$/, "").replace(/ - BARRIO .+$/, ""),
    }));

    const destinosRaw = Array.from(new Set(paradas.map(p => p.Identificador)));
    const destinoOptions = destinosRaw.map(id => {
        const first = paradas.find(p => p.Identificador === id);
        return { value: id, label: first?.AbreviaturaBandera ?? id };
    });

    const selectedParada = paradas.find(p => p.Identificador === paradaId);

    const ramalesRaw = paradas.filter(p => p.Identificador === paradaId);
    const ramalOptions = [
        { value: "TODOS", label: "Todos" },
        ...ramalesRaw.map(r => ({ value: r.AbreviaturaBandera, label: r.AbreviaturaBandera }))
    ];

    const displayArribos = selectedRamal === "TODOS"
        ? arribos
        : arribos.filter(a => a.DescripcionBandera === selectedRamal);

    return (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <Header tab={tab} setTab={setTab} favCount={favoritos.length} />

            <main style={{ flex: 1, padding: "20px", maxWidth: 520, margin: "0 auto", width: "100%" }}>
                {tab === "buscar" ? (
                    <SearchFlow 
                        codLinea={codLinea} setCodLinea={setCodLinea}
                        codCalle={codCalle} setCodCalle={setCodCalle}
                        codInterseccion={codInterseccion} setCodInterseccion={setCodInterseccion}
                        paradaId={paradaId} setParadaId={setParadaId}
                        selectedRamal={selectedRamal} setSelectedRamal={setSelectedRamal}
                        isConsulting={isConsulting} setIsConsulting={setIsConsulting}
                        lineaOptions={lineaOptions} calles={calles} interOptions={interOptions} 
                        destinoOptions={destinoOptions} ramalOptions={ramalOptions}
                        loadingLineas={loadingLineas} loadingCalles={loadingCalles} 
                        loadingInter={loadingInter} loadingParadas={loadingParadas} 
                        loadingArribos={loadingArribos} error={error} setError={setError}
                        displayArribos={displayArribos} selectedParada={selectedParada}
                        lastUpdate={lastUpdate} handleConsultar={handleConsultar}
                        fetchArribos={fetchArribos} handleFavFromArribos={handleFavFromArribos}
                    />
                ) : (
                    <FavoritesList 
                        favoritos={favoritos} 
                        onView={fetchFavArribos} 
                        onRemove={removeFav} 
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}