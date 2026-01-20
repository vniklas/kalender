// Swedish holidays calculator
export interface Holiday {
  name: string
  date: string // YYYY-MM-DD format
  type: 'public' | 'flag' // public = röd dag, flag = flaggdag
}

// Calculate Easter Sunday using Computus algorithm
function getEasterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  
  return new Date(year, month - 1, day)
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getSwedishHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = []
  
  // Fixed holidays
  holidays.push(
    { name: 'Nyårsdagen', date: `${year}-01-01`, type: 'public' },
    { name: 'Trettondedag jul', date: `${year}-01-06`, type: 'public' },
    { name: 'Första maj', date: `${year}-05-01`, type: 'public' },
    { name: 'Sveriges nationaldag', date: `${year}-06-06`, type: 'public' },
    { name: 'Midsommarafton', date: formatDate(getMidsommarAfton(year)), type: 'flag' },
    { name: 'Midsommardagen', date: formatDate(getMidsommarDagen(year)), type: 'public' },
    { name: 'Alla helgons dag', date: formatDate(getAllaHelgonsDag(year)), type: 'public' },
    { name: 'Julafton', date: `${year}-12-24`, type: 'flag' },
    { name: 'Juldagen', date: `${year}-12-25`, type: 'public' },
    { name: 'Annandag jul', date: `${year}-12-26`, type: 'public' },
    { name: 'Nyårsafton', date: `${year}-12-31`, type: 'flag' }
  )
  
  // Easter-based holidays
  const easter = getEasterSunday(year)
  holidays.push(
    { name: 'Långfredagen', date: formatDate(addDays(easter, -2)), type: 'public' },
    { name: 'Påskafton', date: formatDate(addDays(easter, -1)), type: 'flag' },
    { name: 'Påskdagen', date: formatDate(easter), type: 'public' },
    { name: 'Annandag påsk', date: formatDate(addDays(easter, 1)), type: 'public' },
    { name: 'Kristi himmelsfärdsdag', date: formatDate(addDays(easter, 39)), type: 'public' },
    { name: 'Pingstdagen', date: formatDate(addDays(easter, 49)), type: 'public' }
  )
  
  return holidays.sort((a, b) => a.date.localeCompare(b.date))
}

// Midsommarafton: Fredag mellan 19-25 juni
function getMidsommarAfton(year: number): Date {
  for (let day = 19; day <= 25; day++) {
    const date = new Date(year, 5, day) // June (month 5)
    if (date.getDay() === 5) { // Friday
      return date
    }
  }
  return new Date(year, 5, 19) // Fallback
}

// Midsommardagen: Lördag mellan 20-26 juni
function getMidsommarDagen(year: number): Date {
  return addDays(getMidsommarAfton(year), 1)
}

// Alla helgons dag: Lördag mellan 31 okt - 6 nov
function getAllaHelgonsDag(year: number): Date {
  // Start from October 31
  const oct31 = new Date(year, 9, 31)
  
  // Find the first Saturday between Oct 31 - Nov 6
  for (let i = 0; i <= 6; i++) {
    const date = addDays(oct31, i)
    if (date.getDay() === 6) { // Saturday
      return date
    }
  }
  
  return new Date(year, 10, 1) // Fallback to Nov 1
}

export function getHolidayForDate(dateStr: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find(h => h.date === dateStr)
}
