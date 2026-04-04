import { Arribo, Favorito, HistorialEntry, Interseccion, Linea, Parada, ParadaMapa, PuntoRecorrido, RamalData } from "./cuandoLlega.types";

const BASE_URL = "/api/cuando";

export async function post(accion: string, params: Record<string, string> = {}) {
  const body = new URLSearchParams({ accion, ...params }).toString();
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Generic fetcher for SWR. 
 * Key format: [action, paramsObject]
 */
export class MgpError extends Error {
  constructor(message: string, public readonly isNetwork: boolean) {
    super(message);
    this.name = "MgpError";
  }
}

export const swrFetcher = async ([accion, params]: [string, Record<string, string>]) => {
  try {
    return await post(accion, params);
  } catch (err: any) {
    // Network error, timeout, or server totally unreachable
    if (err instanceof TypeError || err?.name === "AbortError" || err?.message?.startsWith("Failed to fetch")) {
      throw new MgpError("El servidor de la Municipalidad no responde. Verificá tu conexión e intentá de nuevo.", true);
    }
    // HTTP error propagated from post()
    throw new MgpError(`Error del servidor (${err?.message ?? "desconocido"}). Intentá de nuevo en unos momentos.`, false);
  }
};

// --- API calls ---
export async function getLineas(): Promise<Linea[]> {
  const data = await post("RecuperarLineaPorCuandoLlega");
  return data.lineas ?? [];
}

export async function getCalles(codLinea: string): Promise<{ value: string; label: string }[]> {
  const data = await post("RecuperarCallesPrincipalPorLinea", { codLinea });
  const raw: { Codigo: string; Descripcion: string }[] = data.calles ?? [];
  return raw.map(c => ({
    value: c.Codigo,
    label: c.Descripcion, // We'll clean this in the component or here with a helper if we import it
  }));
}

export async function getIntersecciones(
  codLinea: string,
  codCalle: string
): Promise<Interseccion[]> {
  const data = await post("RecuperarInterseccionPorLineaYCalle", {
    codLinea,
    codCalle,
  });
  return data.calles ?? [];
}

export async function getParadas(
  codLinea: string,
  codCalle: string,
  codInterseccion: string
): Promise<Parada[]> {
  const data = await post(
    "RecuperarParadasConBanderaPorLineaCalleEInterseccion",
    { codLinea, codCalle, codInterseccion }
  );
  return data.paradas ?? [];
}

export async function getArribos(
  identificadorParada: string,
  codigoLineaParada: string
): Promise<Arribo[]> {
  const data = await post("RecuperarProximosArribosW", {
    identificadorParada,
    codigoLineaParada,
  });
  return data.arribos ?? [];
}



export async function getRecorrido(codLinea: string): Promise<PuntoRecorrido[]> {
  const data = await post("RecuperarRecorridoParaMapaAbrevYAmpliPorEntidadYLinea", {
    codLinea,
    isSublinea: "0",
  });
  return data.puntos ?? [];
}

/**
 * Returns all ramales (branches) for a line, each with their ordered route points.
 * The API returns all puntos in a flat array; we group them by Descripcion
 * which has the format "ramalId;labelIda;labelVuelta".
 */
export async function getRecorridoRamales(codLinea: string): Promise<RamalData[]> {
  const data = await post("RecuperarRecorridoParaMapaAbrevYAmpliPorEntidadYLinea", {
    codLinea,
    isSublinea: "0",
  });
  const puntos: PuntoRecorrido[] = data.puntos ?? [];

  // Group by Descripcion, preserving insertion order (= route order)
  const byDesc = new Map<string, PuntoRecorrido[]>();
  for (const p of puntos) {
    if (!byDesc.has(p.Descripcion)) byDesc.set(p.Descripcion, []);
    byDesc.get(p.Descripcion)!.push(p);
  }

  return Array.from(byDesc.entries()).map(([desc, pts]) => {
    const parts = desc.split(";");
    const key = parts[0] ?? desc;          // e.g. "41"
    const label = parts[1] ?? desc;        // e.g. "AL FARO"
    return { key, label, puntos: pts } satisfies RamalData;
  });
}

/**
 * Returns all bus stops for a line as a flat, de-duplicated array.
 * The API returns a dict keyed by Identificador; each value is an array
 * of entries per bandera (the stop itself is the same location for all).
 */
export async function getParadasParaMapa(codLinea: string): Promise<ParadaMapa[]> {
  const data = await post("RecuperarParadasConBanderaYDestinoPorLinea", {
    codLinea,
    isSublinea: "0",
  });

  type RawEntry = {
    Codigo: string;
    Identificador: string;
    Descripcion: string;
    AbreviaturaBandera: string;
    LatitudParada: string | null;
    LongitudParada: string | null;
  };
  const raw: Record<string, RawEntry[]> = data.paradas ?? {};

  const result: ParadaMapa[] = [];
  for (const [id, entries] of Object.entries(raw)) {
    if (!entries.length) continue;
    const first = entries[0];
    const lat = parseFloat(first.LatitudParada ?? "");
    const lng = parseFloat(first.LongitudParada ?? "");
    if (isNaN(lat) || isNaN(lng)) continue;

    // Use Descripcion only when it looks like a human name (has a space),
    // otherwise fall back to the Identificador.
    const label = /\s/.test(first.Descripcion) ? first.Descripcion : id;

    result.push({ id, codigo: first.Codigo, label, lat, lng });
  }
  return result;
}

// --- Favoritos (localStorage) ---
const FAV_KEY = "cuandollega_favoritos";

export function getFavoritos(): Favorito[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveFavorito(fav: Favorito): void {
  const favs = getFavoritos();
  if (favs.find((f) => f.id === fav.id)) return;
  localStorage.setItem(FAV_KEY, JSON.stringify([...favs, fav]));
}

export function removeFavorito(id: string): void {
  const favs = getFavoritos().filter((f) => f.id !== id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export function updateFavorito(id: string, name: string): void {
  const favs = getFavoritos().map((f) => {
    if (f.id === id) {
      return { ...f, nombre: name };
    }
    return f;
  });
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export function isFavorito(id: string): boolean {
  return getFavoritos().some((f) => f.id === id);
}

// --- Historial (localStorage) ---
const HIST_KEY = "cuandollega_historial";
const HIST_MAX = 10;

export function getHistorial(): HistorialEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HIST_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Adds or promotes an entry to the top of the historial.
 * Entries are keyed by id (paradaId_codLinea), so re-consulting the same
 * stop just moves it to the top instead of duplicating it.
 */
export function pushHistorial(entry: HistorialEntry): void {
  const prev = getHistorial().filter((h) => h.id !== entry.id);
  const next = [entry, ...prev].slice(0, HIST_MAX);
  localStorage.setItem(HIST_KEY, JSON.stringify(next));
}

export function removeHistorialEntry(id: string): void {
  const next = getHistorial().filter((h) => h.id !== id);
  localStorage.setItem(HIST_KEY, JSON.stringify(next));
}

export function clearHistorial(): void {
  localStorage.removeItem(HIST_KEY);
}
