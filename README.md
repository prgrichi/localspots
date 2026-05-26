# Localspots App

Localspots ist eine mobile-first Vue-3-Webapp zum Erfassen, Organisieren und Teilen von Orten ("Spots") in Collections.

## Features

- Login-geschützter Zugriff mit PocketBase Auth
- Spots pro Collection anlegen, bearbeiten, löschen
- Spot-Detailseite inkl. Standortverwaltung
- Kartenansicht mit Leaflet-Markern pro aktiver Collection
- Collection-Verwaltung (eigene / alle, beitreten, verlassen, umbenennen)
- Aktivitäten-Startseite als zentrale Home-Ansicht
- Mobile Bottom-Navigation mit Route-Transitions
- PWA-Konfiguration für installierbare App

## Tech Stack

- Vue 3 (`<script setup>`) + TypeScript
- Vite 7
- Pinia
- Vue Router 4
- Naive UI
- Tailwind CSS 4
- PocketBase
- Leaflet + `@vue-leaflet/vue-leaflet`
- `vite-plugin-pwa`

## Projektstruktur

```text
src/
  components/        UI-Komponenten (collections, spot-detail, menu, navigation)
  composables/       Feature-/UI-Logik (z. B. map, filters, stats)
  layouts/           AppLayout mit Route-spezifischer Höhenlogik
  pages/             Seiten (Activities, Spots, Map, Collections, Login, ...)
  router/            Routen, Guards, Transition-Logik
  services/          externe Services (PocketBase-Client)
  stores/            Pinia Stores (auth, collections, spots, follows)
  types/             zentrale TS-Typen
```

## Routing und Zugriff

Routen sind in `src/router/index.ts` definiert.

- Geschützte Routen nutzen `meta.requiresAuth: true`
- Globaler `beforeEach` leitet unauthentifizierte Nutzer auf `/login`
- Main-Nav-Routen bekommen Slide-Transitions (`slide-left` / `slide-right`), sonst `fade`

Aktuelle Hauptseiten:

- `/` (`activities`)
- `/spots`
- `/add`
- `/map`
- `/collections`
- `/all-collections`
- `/my-collections`
- `/friends`
- `/friends-all`
- `/login`

## State Management (Pinia)

- `authStore`: Login/Logout, Sync mit `pb.authStore`, `isAuthReady`
- `collectionStore`: eigene + alle Collections, active collection, subscribe/unsubscribe
- `spotStore`: collection-spezifische Spots, globale Spots, CRUD + Standort-Updates
- `followStore`: Follow-Daten/Beziehungen für Social-Bereiche

## Datenmodell (vereinfacht)

### Collection

- `id`
- `name`
- `owner`
- `members[]`
- `created`, `updated`

### Spot

- `id`
- `name`
- `category`
- `description`
- `collection`
- `user`
- `locationLat`, `locationLng`
- `locationUpdatedAt`
- `created`, `updated`

## Voraussetzungen

- Node.js `^20.19.0 || >=22.12.0`
- laufender PocketBase-Server

## Environment

Lege eine `.env` im Projektroot an:

```env
VITE_PB_URL=http://127.0.0.1:8091
VITE_THUNDERFOREST_API_KEY=<dein_thunderforest_api_key>
```

Für den Seed-Script-Lauf werden zusätzlich benötigt:

```env
PB_ADMIN_EMAIL=<pocketbase_admin_email>
PB_ADMIN_PASSWORD=<pocketbase_admin_passwort>
```

## Entwicklung

```bash
npm install
npm run dev
```

Weitere Befehle:

```bash
npm run build
npm run preview
npm run lint
npm run type-check
npm run format
```

## Seed-Daten (optional)

Im Repo liegt ein Demo-Seed in `scripts/pocketbase/data.json`.

Ausführen:

```bash
npx tsx scripts/pocketbase/seed.ts
```

Der Script:

- authentifiziert als PocketBase Superuser
- erstellt Demo-User
- erstellt Collections pro User
- erstellt Spots inkl. optionaler Geokoordinaten

## PWA

Konfiguration in `vite.config.js`:

- `registerType: 'autoUpdate'`
- `workbox.navigateFallback: '/index.html'`
- `devOptions.enabled: false` (kein SW-Cache in lokaler Entwicklung)

## Hinweise zum aktuellen Stand

- Home-Route ist derzeit `ActivitiesPage` (nicht `DashboardPage`)
- Layout-Höhenlogik ist route-spezifisch (u. a. für Login und Map)
- App ist klar mobile-first ausgerichtet
