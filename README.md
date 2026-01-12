# Beautykuppel Therme - Termin Viewer 🧖‍♂️🌿

Ein automatisiertes System zur Erfassung und Anzeige der nächsten freien Massagetermine der Beautykuppel Therme Bad Aibling.

## ✨ Features

- **Automatischer Scraper**: Ein integriertes Puppeteer-Skript besucht alle 5 Minuten den offiziellen Shop, blättert durch die Termine und speichert freie Slots.
- **Drei spezialisierte Ansichten**:
  - **Dashboard (`/`)**: Interaktive Übersicht mit Filteroptionen und automatischer Aktualisierung.
  - **Digitale Beschilderung (`/signage`)**: Eine elegante, wellness-orientierte Ansicht mit Terminschleife, Uhrzeit und Animationen für TV-Displays im Laden.
  - **Einbettbare Liste (`/list`)**: Eine 1:1 Kopie des Shop-Designs für die nahtlose Einbindung per Iframe in externe Webseiten (z.B. IONOS Baukasten).
- **Intelligente Echtzeit-Filterung**: Termine in der Vergangenheit werden automatisch im Browser ausgeblendet, selbst wenn der Scraper noch nicht erneut gelaufen ist.
- **Automatisierte Bereitstellung**: Hosting auf **GitHub Pages** mit vollautomatischer Aktualisierung der Daten über **GitHub Actions**.
- **UX-Optimiert**: Buchungslinks ohne `dsId` für besseres Fallback-Verhalten im Shop.

## 🚀 Entwicklung & Betrieb

### Voraussetzungen
- Node.js (v20 oder höher)
- npm

### Lokal starten
1. Repository klonen
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
4. Scraper manuell testen:
   ```bash
   node scripts/scrape.js
   ```

### Deployment
Die App wird automatisch bei jedem Push auf den `main` Branch oder durch den eingestellten Zeitplan (Cron) über GitHub Actions gebaut und auf GitHub Pages veröffentlicht.

## 🛠️ Iframe Einbindung
Für die Einbindung in externe Webseiten kann die `/list` Ansicht genutzt werden:

```html
<iframe 
  src="https://[DEIN-USERNAME].github.io/scraper-app/list?noTitle=true" 
  width="100%" 
  height="650px" 
  style="border:none;"
  scrolling="no">
</iframe>
```

---
*Created with ❤️ for Beautykuppel Therme Bad Aibling.*
