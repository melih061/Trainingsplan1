# BUILT BY MELIH

> **Iron Discipline** - Personal Training App

Eine moderne, mobile-first Progressive Web App (PWA) zum Tracken von Workouts, Fortschritt und Fitness-Zielen.

## Features

### Training & Tracking
- **Workout-Logging** - Gewicht, Wiederholungen und Notizen pro Ubung
- **Automatische PR-Erkennung** - Personal Records werden automatisch erkannt
- **Trainings-Historie** - Kompletter Verlauf aller Workouts
- **Progress-Charts** - Visuelle Darstellung des Fortschritts
- **Streak-System** - Motivierende Trainings-Serie

### Timer & Pausen
- **Rest-Timer** - Konfigurierbare Pausenzeiten
- **Audio-Benachrichtigung** - Akustisches Signal bei Timer-Ende
- **Quick-Actions** - +30s schnell hinzufugen

### Organisation
- **Tages-Planung** - Push/Pull/Legs Split vorkonfiguriert
- **Ubungs-Tipps** - Ausfuhrungshinweise pro Ubung
- **Tagliche Challenges** - Extra-Motivation
- **Inspirations-Zitate** - Tagliche Motivations-Quotes

### Technisch
- **PWA** - Installierbar auf Homescreen
- **Offline-Fahig** - Funktioniert ohne Internet
- **Lokale Speicherung** - Daten bleiben auf dem Gerat
- **Responsive** - Optimiert fur Mobile

---

## Installation

### Voraussetzungen

- Node.js 18+
- npm oder pnpm

### Setup

```bash
# Repository klonen
git clone https://github.com/melihdonmez/trainingsplan.git
cd trainingsplan

# Dependencies installieren
npm install

# Development-Server starten
npm run dev
```

Die App lauft jetzt auf `http://localhost:3000`

### Production Build

```bash
# Produktions-Build erstellen
npm run build

# Build lokal testen
npm run preview
```

---

## Projektstruktur

```
trainingsplan/
├── index.html              # Haupt-HTML
├── package.json            # Projekt-Konfiguration
├── vite.config.js          # Build-Konfiguration
├── public/
│   ├── manifest.json       # PWA Manifest
│   ├── sw.js              # Service Worker
│   ├── icons/             # App-Icons
│   └── images/            # Statische Bilder
├── src/
│   ├── components/        # UI-Komponenten
│   │   └── App.js         # Haupt-App-Logik
│   ├── data/
│   │   └── exercises.js   # Ubungen & Trainingsplane
│   ├── services/
│   │   ├── storage.js     # Daten-Persistenz
│   │   ├── timer.js       # Timer-Funktionalitat
│   │   └── charts.js      # Chart-Rendering
│   ├── styles/
│   │   ├── index.css      # Style-Entry
│   │   ├── variables.css  # CSS-Variablen
│   │   ├── base.css       # Basis-Styles
│   │   ├── components.css # Komponenten-Styles
│   │   └── workout.css    # Workout-Styles
│   └── utils/
│       ├── helpers.js     # Hilfsfunktionen
│       └── animations.js  # Animationen
├── tests/                 # Tests
└── docs/                  # Dokumentation
```

---

## Konfiguration

### Trainingsplan anpassen

Die Ubungen und Trainingstage findest du in `src/data/exercises.js`:

```javascript
export const TRAINING_DAYS = {
  push: {
    id: 'push',
    name: 'PUSH',
    focus: 'Chest, Shoulders, Triceps',
    color: '#C4956A',
    exercises: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        sets: '4x8-10',
        tip: 'Squeeze your shoulder blades together.'
      },
      // ... weitere Ubungen
    ]
  },
  // ... weitere Tage
};
```

### Wochenplan anpassen

```javascript
export const WEEKLY_SCHEDULE = [
  { dayIndex: 0, dayName: 'Mo', training: 'push' },
  { dayIndex: 1, dayName: 'Di', training: 'pull' },
  { dayIndex: 2, dayName: 'Mi', training: 'legs' },
  { dayIndex: 3, dayName: 'Do', training: 'rest' },
  { dayIndex: 4, dayName: 'Fr', training: 'upper' },
  { dayIndex: 5, dayName: 'Sa', training: 'push' },
  { dayIndex: 6, dayName: 'So', training: 'rest' }
];
```

---

## API Reference

### Storage Service

```javascript
import * as storage from './services/storage.js';

// Workout loggen
storage.logWorkoutSet('push', 'bench-press', {
  weight: 80,
  reps: 10,
  notes: 'Felt strong'
});

// Historie abrufen
const history = storage.getExerciseHistory('bench-press', 10);

// PR abrufen
const pr = storage.getPR('bench-press');

// Streak aktualisieren
storage.updateStreak();

// Daten exportieren
const backup = storage.exportData();

// Daten importieren
storage.importData(backup);
```

### Timer Service

```javascript
import * as timer from './services/timer.js';

// Timer starten (count-up)
timer.start(0, {
  onTick: (seconds) => console.log(timer.formatTime(seconds))
});

// Countdown starten
timer.startCountdown(90, {
  onComplete: () => console.log('Rest over!')
});

// Rest-Preset starten
timer.startRest('medium'); // 90 Sekunden

// Timer stoppen
timer.stop();

// Timer zurucksetzen
timer.reset();
```

### Charts Service

```javascript
import * as charts from './services/charts.js';

// Liniendiagramm
charts.lineChart(container, [
  { date: '2024-01-01', value: 60 },
  { date: '2024-01-08', value: 65 },
  { date: '2024-01-15', value: 70 }
]);

// Kreisdiagramm
charts.circularProgress(container, 75, {
  color: '#C4956A',
  size: 100
});

// Sparkline
charts.sparkline(container, [60, 65, 63, 70, 68, 75]);
```

### Helper Utilities

```javascript
import * as helpers from './utils/helpers.js';

// Datum formatieren
helpers.formatDate(new Date()); // "07.04.2026"
helpers.formatRelativeDate(lastWorkout); // "vor 2 Tagen"

// 1RM berechnen
helpers.calculate1RM(80, 10); // ~107kg

// Volumen berechnen
helpers.calculateVolume([
  { weight: 80, reps: 10 },
  { weight: 80, reps: 8 }
]); // 1440kg
```

---

## Design System

### Farben

| Variable | Hex | Verwendung |
|----------|-----|------------|
| `--bg` | `#050505` | Hintergrund |
| `--brz` | `#C4956A` | Bronze Akzent |
| `--sag` | `#5C7A5C` | Sage/Erfolg |
| `--red` | `#8B3A3A` | Rot/Warnung |
| `--lav` | `#7A6B8A` | Lavender |

### Typographie

| Variable | Font | Verwendung |
|----------|------|------------|
| `--fn` | Anton | Headlines |
| `--fb` | DM Sans | Body Text |
| `--fm` | JetBrains Mono | Zahlen/Daten |

---

## Scripts

```bash
# Development
npm run dev          # Dev-Server starten
npm run build        # Production Build
npm run preview      # Build lokal testen

# Code-Qualitat
npm run lint         # ESLint ausfuhren
npm run format       # Prettier formatieren

# Tests
npm run test         # Tests ausfuhren
npm run test:ui      # Test-UI offnen
```

---

## PWA Installation

### iOS (Safari)
1. Seite in Safari offnen
2. Teilen-Button antippen
3. "Zum Home-Bildschirm" wahlen

### Android (Chrome)
1. Seite in Chrome offnen
2. Menu offnen (drei Punkte)
3. "App installieren" wahlen

### Desktop (Chrome/Edge)
1. Seite im Browser offnen
2. Install-Icon in der Adressleiste klicken

---

## Daten & Backup

### Daten exportieren

```javascript
// In der Browser-Konsole:
const data = localStorage.getItem('melih_training_workout_logs');
console.log(data);
// Kopieren und sichern
```

### Daten importieren

```javascript
// In der Browser-Konsole:
localStorage.setItem('melih_training_workout_logs', 'DEIN_BACKUP_STRING');
location.reload();
```

---

## Roadmap

- [ ] Cloud-Sync mit Supabase
- [ ] Multi-User Support
- [ ] Ernahrungstracking Integration
- [ ] Apple Watch App
- [ ] Workout-Templates teilen
- [ ] AI-basierte Empfehlungen
- [ ] Integrierte Ubungsvideos

---

## Lizenz

MIT License - Siehe [LICENSE](LICENSE)

---

## Autor

**Melih Donmez**

- GitHub: [@melihdonmez](https://github.com/melihdonmez)

---

*"Darkness forges strength. Motion is proof of life."*
