export interface Linea {
  CodigoLineaParada: string;
  Descripcion: string;
  CodigoEntidad: string;
  CodigoEmpresa: number;
  isManual?: boolean;
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

export interface HistorialEntry {
  id: string;                  // `${paradaId}_${codLinea}`
  paradaId: string;
  codLinea: string;
  descripcionLinea: string;
  descripcionBandera: string;
  calleLabel?: string;         // Nombre de la calle principal
  interseccionLabel?: string;  // Nombre de la calle intersección
  timestamp: number;           // Date.now()
}

export interface Favorito {
  id: string;
  nombre: string;
  identificadorParada: string;
  codigoLineaParada: string;
  descripcionLinea: string;
  descripcionBandera: string;
}

export interface PuntoRecorrido {
  Descripcion: string;
  AbreviaturaBanderaSMP: string;
  AbreviaturaLineaSMP: string;
  IsPuntoPaso: boolean;
  Latitud: number;
  Longitud: number;
}

/** A single ramal (branch) with its ordered route points. */
export interface RamalData {
  /** Ramal code, e.g. "41" */
  key: string;
  /** Human-readable destination, e.g. "AL FARO" */
  label: string;
  puntos: PuntoRecorrido[];
}

/** A bus stop ready to be rendered on the map. */
export interface ParadaMapa {
  id: string;       // Identificador, e.g. "10028"
  codigo: string;   // Codigo interno
  label: string;    // Human-readable stop name
  lat: number;
  lng: number;
}
