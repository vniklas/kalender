# Astons Schema

En webbapplikation för att organisera och koordinera Astons schema mellan mamma och pappa.

## Funktioner
- 📅 Kalendervyn med veckonummer
- ➕ Lägg till och redigera händelser/aktiviteter
- 🔄 Automatiskt upprepande schema för 5 månader framåt
- 📱 Exportera till Apple Kalender (iOS/macOS)
- 👨‍👩‍👧 Dela schema mellan föräldrar
- 🇸🇪 Helt på svenska

## Exportera till Apple Kalender

1. Klicka på "📅 Exportera till Kalender" knappen
2. En fil `astons-schema.ics` kommer att laddas ner
3. **På Mac**: Dubbelklicka på filen så öppnas den automatiskt i Kalender-appen
4. **På iPhone/iPad**: 
   - Öppna filen från nedladdningar
   - Tryck "Lägg till alla"
   - Välj vilken kalender du vill lägga till händelserna i

## Kom igång

### Förutsättningar
- Node.js (v16 eller högre)
- npm eller yarn

### Installation

```bash
npm install
```

### Utveckling

```bash
npm run dev
```

### Bygg för produktion

```bash
npm run build
```

## Teknisk stack
- Frontend: React med TypeScript
- Styling: CSS
- Byggverktyg: Vite
- Kalenderexport: iCalendar (.ics) format

## Astons Schema

Appen är förkonfigurerad med Astons återkommande schema (28-dagars cykel):
1. **Pappa**: Måndag → Måndag (7 dagar) - vecka + helg
2. **Mamma**: Måndag → Fredag (4 dagar) - endast vardagar
3. **Pappa**: Fredag → Fredag (7 dagar) - helg + vecka
4. **Mamma**: Fredag → Måndag (10 dagar) - helg + vecka + helg

Schemat upprepar sig automatiskt i 28-dagars (4 veckor) cykler och genereras 5 månader framåt.
