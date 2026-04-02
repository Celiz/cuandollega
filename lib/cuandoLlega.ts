const BASE_URL = "/api/cuando";

async function post(accion: string, params: Record<string, string> = {}) {
  const body = new URLSearchParams({ accion, ...params }).toString();
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// --- Types ---
export interface Linea {
  CodigoLineaParada: string;
  Descripcion: string;
  CodigoEntidad: string;
  CodigoEmpresa: number;
}

export interface Interseccion {
  Codigo: string;
  Descripcion: string;
}

export interface Parada {
  Codigo: string;
  Identificador: string;
  AbreviaturaBandera: string;
  LatitudParada: string | null;
  LongitudParada: string | null;
}

export interface Arribo {
  DescripcionLinea: string;
  DescripcionBandera: string;
  DescripcionCartelBandera: string;
  Arribo: string;
  CodigoLineaParada: string;
  DesvioHorario: string;
  EsAdaptado: string;
  IdentificadorChofer: string;
  IdentificadorCoche: string;
  Latitud: string;
  LatitudParada: string;
  Longitud: string;
  LongitudParada: string;
  UltimaFechaHoraGPS: string;
  MensajeError: string;
}

export interface Favorito {
  id: string;
  nombre: string;
  identificadorParada: string;
  codigoLineaParada: string;
  descripcionLinea: string;
  descripcionBandera: string;
}

// --- API calls ---
export async function getLineas(): Promise<Linea[]> {
  const data = await post("RecuperarLineaPorCuandoLlega");
  return data.lineas ?? [];
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

export interface PuntoRecorrido {
  Descripcion: string;
  AbreviaturaBanderaSMP: string;
  AbreviaturaLineaSMP: string;
  IsPuntoPaso: boolean;
  Latitud: number;
  Longitud: number;
}

export async function getRecorrido(codLinea: string): Promise<PuntoRecorrido[]> {
  const data = await post("RecuperarRecorridoParaMapaAbrevYAmpliPorEntidadYLinea", {
    codLinea,
    isSublinea: "0",
  });
  return data.puntos ?? [];
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

export function isFavorito(id: string): boolean {
  return getFavoritos().some((f) => f.id === id);
}
