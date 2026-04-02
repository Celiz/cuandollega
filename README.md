<div align="center">
  <img src="public/icon-192.png" alt="Cuándo Llega MDP Logo" width="120" />

  <h1>¿Cuándo Llega? MDP</h1>

  <p>
    <strong>Tiempos de arribo de colectivos en tiempo real para Mar del Plata.</strong>
  </p>

  <p>
    <a href="https://cuandollega-tawny.vercel.app/">Demo en Vivo</a> •
    <a href="#-empezar-getting-started">Empezar</a> •
    <a href="CONTRIBUTING.md">Contribuir</a> •
    <a href="#-arquitectura--stack-tecnológico">Arquitectura</a>
  </p>
</div>

---

> [!NOTE]
> Una Progressive Web App (PWA) rápida, moderna y responsiva. Consultá cuándo llega el colectivo a tu parada sin publicidades, sin descargar apps nativas y con posibilidad de funcionar sin conexión (caché).

<div align="center">
  <img src="public/screenshots/results.png" alt="Screenshot de la aplicación" width="400" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />
</div>

## ✨ Funcionalidades

- **Tiempo real (GPS):** Consulta de arribos en tiempo real obteniendo datos del proxy de la Municipalidad de Gral. Pueyrredón.
- **Favoritos:** Guardá tus paradas de uso diario con nombres personalizados (ej. "Casa", "Trabajo").
- **Historial automático:** ¿Recién consultaste una parada? Te queda a un clic de distancia en tu historial reciente.
- **Modo Offline & Caché (PWA):** Instalá la app en tu teléfono (iOS/Android). La información estática (calles, recorridos) se guarda en caché local por 24hs para que la app cargue *instantáneamente*.
- **Compartir por WhatsApp:** Generá un enlace rápido o texto con los tiempos de arribo y la esquina para compartirlo.
- **Mapa Interactivo:** Visualizá los colectivos acercándose a tu parada en tiempo real sobre un mapa.

## 🛠 Arquitectura & Stack Tecnológico

El proyecto está diseñado pensando fuertemente en **performance del lado del cliente** usando las últimas tecnologías de React.

| Tecnología        | Propósito                                                            |
|-------------------|----------------------------------------------------------------------|
| **Next.js 16 (App Router)** | Framework base, optimización de bundles, y Proxy API (Rutas ocultas de CORS). |
| **React 19**      | UI, Hooks, y concurrencia.                                           |
| **TypeScript**    | Tipado estático (podés ver los tipos en `lib/cuandoLlega.types.ts`). |
| **SWR**           | Data fetching, mutaciones, revalidación automática (auto-refresh) y caché en memoria. |
| **Leaflet**       | Motor de mapas liviano para mostrar GPS de colectivos y rutas.       |

### Flujo de Datos

```mermaid
graph LR
  UI[UI Components] --> SWR[SWR Hooks]
  SWR -.-> LocalStorage[(Caché Local 24hs)]
  SWR --> Proxy[Route Handler /api/cuando]
  Proxy --> MGP[API Municipalidad]
```

## 🚀 Empezar (Getting Started)

Estas instrucciones te permitirán obtener una copia del proyecto y ejecutarlo en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

- **Node.js** (v18.x o superior)
- **NPM** (usualmente viene con Node.js)

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Celiz/cuandollega.git
   cd cuandollega
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará corriendo en [http://localhost:3000](http://localhost:3000).

## 📡 API Reference

Toda la comunicación con la MGP pasa a través del un único proxy en nuestro backend para evadir restricciones de CORS y ocultar orígenes.

**Endpoint:** `POST /api/cuando`

El body asume codificación `application/x-www-form-urlencoded`.

### Acciones Comunes

- `RecuperarLineaPorCuandoLlega`: Obtiene lista de líneas.
- `RecuperarCallesPrincipalPorLinea`: Recibe `codLinea`. Retorna calles que recorre.
- `RecuperarInterseccionPorLineaYCalle`: Recibe `codLinea`, `codCalle`. Retorna intersecciones de esa calle en su recorrido.
- `RecuperarParadasConBanderaPorLineaCalleEInterseccion`: Retorna las banderas y el identificador de la parada.
- `RecuperarProximosArribosW`: Recibe `identificadorParada` y `codigoLineaParada`. Retorna la información de tiempo real GPS de arribos.

*(La implementación completa se encuentra en `lib/cuandoLlega.ts` usando la función `post()` base).*

## 🤝 Contribuir

¡Las contribuciones (pull requests, reporte de bugs, sugerencias) son bienvenidas!

Revisá nuestro archivo [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles sobre cómo estructurar el código, hacer un Pull Request o agregar nuevas integraciones.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consultá el archivo [LICENSE](LICENSE) para más detalles.

---

> [!TIP]
> Si la app te es útil, apreciamos una estrella ⭐ en el [repositorio de GitHub](https://github.com/Celiz/cuandollega).
