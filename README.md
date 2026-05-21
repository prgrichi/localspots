# Localspots App

Localspots ist eine mobile-first Vue-3-Webapp zum Erfassen, Verwalten und Auffinden von Orten ("Spots") in persönlichen Collections.

Die App richtet sich an kleine Gruppen/Freundeskreise: Spots werden pro Collection organisiert, können gefiltert und auf der Karte visualisiert werden.

## Inhaltlicher Überblick

- Collections als organisatorischer Rahmen (z. B. "City-Trips", "Lost Places", "Cafés")
- Spots mit Stammdaten: Name, Kategorie, Beschreibung
- Detailansicht für einzelne Spots
- Kartenansicht mit Marker-basiertem Überblick
- Dashboard mit Kennzahlen und zuletzt eingetragenen Spots
- Login-geschützter Zugriff

## Tech Stack

- Vue 3 (`<script setup>`) + TypeScript
- Vite 7
- Pinia für State Management
- Vue Router 4
- Naive UI + TailwindCSS 4
- PocketBase als Backend (Auth + Daten)
- Leaflet / `@vue-leaflet/vue-leaflet` für Karten
- PWA via `vite-plugin-pwa`

## Architektur

### Frontend-Struktur (`src/`)

- `pages/`: Routing-Ziele (`DashboardPage`, `EntryPage`, `SpotPage`, `MapPage`, `SpotDetailPage`, `LoginPage`)
- `components/`: wiederverwendbare UI-Bausteine
  - `collection/`: Filter, Header, Card, Create-Drawer
  - `spotdetail/`: Spot-Details, Bearbeiten, Standort-Modal/Karte
  - `menu/` + `navigation/`: Drawer, Bottom Navigation
- `stores/`: Pinia Stores (`authStore`, `collectionStore`, `spotStore`)
- `composables/`: fachliche Ableitungen und UI-Logik (`useSpotFilters`, `useSpotMap`, `useDashboardStats`, ...)
- `services/pocketbase.ts`: zentrale PocketBase-Instanz
- `types/`: zentrale TS-Modelle

### Routing und Zugriffsschutz

- Definiert in `src/router/index.ts`
- Routen mit `meta.requiresAuth: true` sind durch `beforeEach` geschützt
- Nicht eingeloggte Nutzer werden auf `/login` umgeleitet

### State Management (Pinia)

- `authStore`: Login/Logout und Synchronisierung mit `pb.authStore`
- `collectionStore`: Laden, Erstellen, Aktualisieren, Löschen und aktive Collection
- `spotStore`: CRUD für Spots, Laden collection-spezifischer und globaler Spot-Listen, Standort-Updates

## Datenmodell (vereinfacht)

### Spot

- `id: string`
- `name: string`
- `category: string`
- `collection: string`
- `description: string`
- `locationLat?: number | null`
- `locationLng?: number | null`
- `locationUpdatedAt?: string | null`
- `created`, `updated`

### Collection

- `id: string`
- `name: string`
- `owner`, `members` (in PocketBase verwaltet)

## Voraussetzungen

- Node.js: `^20.19.0` oder `>=22.12.0`
- laufender PocketBase-Server

## Setup

1. Abhängigkeiten installieren:

```bash
npm install
```

2. `.env` anlegen (oder vorhandene Werte prüfen):

```env
VITE_PB_URL=http://127.0.0.1:8091
VITE_THUNDERFOREST_API_KEY=<dein_thunderforest_api_key>
```

3. Entwicklungsserver starten:

```bash
npm run dev
```

4. Build erzeugen:

```bash
npm run build
```

5. Preview lokal testen:

```bash
npm run preview
```

## Qualitätssicherung

- Lint + Auto-Fixes:

```bash
npm run lint
```

- Type-Check:

```bash
npm run type-check
```

- Formatierung:

```bash
npm run format
```

## PWA-Hinweise

- PWA ist über `vite-plugin-pwa` konfiguriert (`vite.config.js`)
- `registerType: 'autoUpdate'`
- `devOptions.enabled: false` verhindert Service-Worker-Cache-Effekte in der lokalen Entwicklung

## Aktueller Fokus im Code

- mobile-first Layout mit Bottom-Navigation
- schnelle Spot-Erfassung
- filterbare Collection-Ansicht
- Kartenfokus auf vorhandene Spot-Standorte

## Mögliche nächste Ausbaustufen

- Rollen-/Rechtemodell pro Collection (Owner, Member, Readonly)
- Offline-Strategie für Spot-Erfassung
- Tests (Unit für Composables/Stores, E2E für Kernflows)
- Import/Export von Spots
