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

Appen är förkonfigurerad med Astons återkommande schema:
- **Vecka 1**: Hos pappa (måndag → måndag, 7 dagar)
- **Vecka 2**: Hos mamma (måndag → fredag, 4 dagar)
- **Vecka 2-3**: Hos pappa (fredag → fredag, 7 dagar)
- **Vecka 3**: Hos mamma (fredag → måndag, helg)

Schemat upprepar sig automatiskt i 21-dagars cykler och genereras 5 månader framåt.
