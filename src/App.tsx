import { useState } from 'react'
import './App.css'
import Calendar from './components/Calendar'
import EventForm from './components/EventForm'
import EventList from './components/EventList'

export interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  description: string
  parent: 'mom' | 'dad'
  type: 'pickup' | 'dropoff' | 'activity' | 'appointment' | 'other'
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Generate initial schedule for Aston - repeating for 5 months
const generateInitialSchedule = (): ScheduleEvent[] => {
  const events: ScheduleEvent[] = []
  const today = new Date()
  
  // Find the most recent Monday (ensuring we get the right day)
  const currentDay = today.getDay()
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay
  const startMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToMonday)
  startMonday.setHours(12, 0, 0, 0)
  
  // Calculate end date (5 months from now)
  const endDate = new Date(today)
  endDate.setMonth(today.getMonth() + 5)
  
  console.log('Start Monday:', startMonday.toDateString(), 'End Date:', endDate.toDateString())
  
  // The pattern repeats every 28 days (4 weeks):
  // 1. Dad: Monday -> Monday (7 days) - week + weekend
  // 2. Mom: Monday -> Friday (4 days) - weekdays only
  // 3. Dad: Friday -> Friday (7 days) - weekend + week
  // 4. Mom: Friday -> Monday (10 days) - weekend + week + weekend
  
  let eventId = 1
  let cycleStart = new Date(startMonday)
  
  while (cycleStart <= endDate) {
    // 1. Dad Monday -> Monday (7 days)
    const dadMonday = new Date(cycleStart)
    events.push({
      id: `cycle-${eventId++}`,
      title: 'Aston hos pappa',
      date: formatDate(dadMonday),
      time: '18:00',
      description: 'Vecka + helg hos pappa (7 dagar)',
      parent: 'dad',
      type: 'other'
    })
    
    // 2. Mom Monday -> Friday (4 days)
    const momMonday = new Date(cycleStart)
    momMonday.setDate(cycleStart.getDate() + 7)
    if (momMonday <= endDate) {
      events.push({
        id: `cycle-${eventId++}`,
        title: 'Aston hos mamma',
        date: formatDate(momMonday),
        time: '18:00',
        description: 'Vardagar hos mamma (måndag-fredag)',
        parent: 'mom',
        type: 'other'
      })
    }
    
    // 3. Dad Friday -> Friday (7 days)
    const dadFriday = new Date(cycleStart)
    dadFriday.setDate(cycleStart.getDate() + 11) // 7 + 4 = 11
    if (dadFriday <= endDate) {
      events.push({
        id: `cycle-${eventId++}`,
        title: 'Aston hos pappa',
        date: formatDate(dadFriday),
        time: '18:00',
        description: 'Helg + vecka hos pappa (7 dagar)',
        parent: 'dad',
        type: 'other'
      })
    }
    
    // 4. Mom Friday -> Monday (10 days) - 2 weekends + 1 week
    const momFriday = new Date(cycleStart)
    momFriday.setDate(cycleStart.getDate() + 18) // 11 + 7 = 18
    if (momFriday <= endDate) {
      events.push({
        id: `cycle-${eventId++}`,
        title: 'Aston hos mamma',
        date: formatDate(momFriday),
        time: '18:00',
        description: 'Helg + vecka + helg hos mamma (10 dagar)',
        parent: 'mom',
        type: 'other'
      })
    }
    
    // Move to next cycle (28 days later)
    cycleStart.setDate(cycleStart.getDate() + 28)
  }
  
  return events
}

function App() {
  // Load events from localStorage or generate initial schedule
  const loadEvents = (): ScheduleEvent[] => {
    const saved = localStorage.getItem('astons-schema-events')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load saved events:', e)
        return generateInitialSchedule()
      }
    }
    return generateInitialSchedule()
  }

  const [events, setEvents] = useState<ScheduleEvent[]>(loadEvents())
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)

  // Save events to localStorage whenever they change
  const updateEvents = (newEvents: ScheduleEvent[]) => {
    setEvents(newEvents)
    localStorage.setItem('astons-schema-events', JSON.stringify(newEvents))
  }

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: Date.now().toString(),
    }
    updateEvents([...events, newEvent])
    setShowForm(false)
  }

  const updateEvent = (updatedEvent: ScheduleEvent) => {
    updateEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ))
    setEditingEvent(null)
  }

  const deleteEvent = (id: string) => {
    updateEvents(events.filter(event => event.id !== id))
  }

  const startEditing = (event: ScheduleEvent) => {
    setEditingEvent(event)
    setShowForm(false)
  }

  const cleanupFutureEvents = () => {
    const cutoffDateStr = prompt('Ta bort alla händelser från och med datum (ÅÅÅÅ-MM-DD):')
    
    if (!cutoffDateStr) return // Användaren avbröt
    
    // Validera datumet
    const cutoffDate = new Date(cutoffDateStr)
    if (isNaN(cutoffDate.getTime())) {
      alert('Ogiltigt datumformat. Använd ÅÅÅÅ-MM-DD (t.ex. 2026-02-15)')
      return
    }
    
    // Räkna hur många händelser som kommer tas bort
    const eventsToKeep = events.filter(event => new Date(event.date) < cutoffDate)
    const eventsToRemove = events.length - eventsToKeep.length
    
    if (eventsToRemove === 0) {
      alert('Inga händelser att ta bort efter det datumet.')
      return
    }
    
    // Bekräfta med användaren
    if (confirm(`Detta kommer ta bort ${eventsToRemove} händelse(r) från och med ${cutoffDateStr}. Är du säker?`)) {
      updateEvents(eventsToKeep)
      alert(`${eventsToRemove} händelse(r) borttagna!`)
    }
  }

  const continueSchedule = () => {
    if (events.length === 0) {
      alert('Kan inte fortsätta - inget befintligt schema att utgå från')
      return
    }

    // Sortera alla händelser kronologiskt
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    // Hitta alla växlingar (när förälder ändras)
    const switches: { date: Date; parent: 'mom' | 'dad'; daysSinceLast: number }[] = []
    
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i]
      const prevEvent = i > 0 ? sortedEvents[i - 1] : null
      
      // Om det är första händelsen eller om föräldern byts
      if (!prevEvent || prevEvent.parent !== event.parent) {
        const eventDate = new Date(event.date)
        const daysSinceLast = prevEvent 
          ? Math.round((eventDate.getTime() - new Date(prevEvent.date).getTime()) / (1000 * 60 * 60 * 24))
          : 0
        
        switches.push({
          date: eventDate,
          parent: event.parent,
          daysSinceLast
        })
      }
    }
    
    if (switches.length < 2) {
      alert('Behöver minst 2 växlingar i schemat för att kunna fortsätta mönstret')
      return
    }
    
    // Standardmönstret - 28 dagars cykel
    const cyclePattern = [
      { parent: 'dad' as const, days: 7, description: 'Vecka + helg hos pappa' },
      { parent: 'mom' as const, days: 4, description: 'Vardagar hos mamma (måndag-fredag)' },
      { parent: 'dad' as const, days: 7, description: 'Helg + vecka hos pappa' },
      { parent: 'mom' as const, days: 10, description: 'Helg + vecka + helg hos mamma' },
    ]
    
    // Ta reda på var i cykeln vi är baserat på de senaste växlingarna
    const lastSwitch = switches[switches.length - 1]
    
    // Hitta nästa steg i cykeln
    let nextCycleIndex = 0
    
    // Leta igenom cykeln för att hitta vilket mönster vi är i
    for (let i = 0; i < cyclePattern.length; i++) {
      if (cyclePattern[i].parent === lastSwitch.parent) {
        // Kolla om antalet dagar matchar (inom 1 dags marginal)
        if (Math.abs(cyclePattern[i].days - lastSwitch.daysSinceLast) <= 1) {
          nextCycleIndex = (i + 1) % cyclePattern.length
          break
        }
      }
    }
    
    // Om vi inte hittade en matchning, gissa baserat på vem som har barnet nu
    if (nextCycleIndex === 0) {
      // Hitta första mönstret med motsatt förälder
      for (let i = 0; i < cyclePattern.length; i++) {
        if (cyclePattern[i].parent !== lastSwitch.parent) {
          nextCycleIndex = i
          break
        }
      }
    }
    
    // Starta från dagen efter sista händelsen
    const lastEvent = sortedEvents[sortedEvents.length - 1]
    let nextDate = new Date(lastEvent.date)
    
    // Beräkna hur länge nuvarande period ska vara
    const currentPeriodPattern = cyclePattern.find(p => p.parent === lastSwitch.parent) || cyclePattern[0]
    const daysIntoCurrentPeriod = Math.round((nextDate.getTime() - lastSwitch.date.getTime()) / (1000 * 60 * 60 * 24))
    const daysLeftInPeriod = Math.max(1, currentPeriodPattern.days - daysIntoCurrentPeriod)
    
    // Nästa växling
    nextDate.setDate(nextDate.getDate() + daysLeftInPeriod)
    
    // Generera 3 månader framåt
    const endDate = new Date(lastEvent.date)
    endDate.setMonth(endDate.getMonth() + 3)

    const newEvents: ScheduleEvent[] = []
    let eventId = Date.now()
    let cycleIndex = nextCycleIndex
    
    while (nextDate <= endDate) {
      const pattern = cyclePattern[cycleIndex]
      
      newEvents.push({
        id: `continued-${eventId++}`,
        title: `Aston hos ${pattern.parent === 'dad' ? 'pappa' : 'mamma'}`,
        date: formatDate(nextDate),
        time: '18:00',
        description: pattern.description,
        parent: pattern.parent,
        type: 'other'
      })
      
      nextDate = new Date(nextDate)
      nextDate.setDate(nextDate.getDate() + pattern.days)
      cycleIndex = (cycleIndex + 1) % cyclePattern.length
    }

    if (newEvents.length > 0) {
      updateEvents([...events, ...newEvents])
      alert(`Lade till ${newEvents.length} nya händelser till schemat!`)
    } else {
      alert('Inga nya händelser att lägga till')
    }
  }

  const exportToCalendar = () => {
    // Generate ICS file content
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Astons Schema//SE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Astons Schema',
      'X-WR-TIMEZONE:Europe/Stockholm',
    ]

    events.forEach(event => {
      const eventDate = new Date(event.date + 'T' + event.time)
      const endDate = new Date(eventDate)
      endDate.setHours(endDate.getHours() + 1) // 1 hour duration by default

      // Format dates for ICS (YYYYMMDDTHHmmss)
      const formatICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      }

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${event.id}@astons-schema`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(eventDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.parent === 'dad' ? 'Hos pappa' : 'Hos mamma'}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      )
    })

    icsContent.push('END:VCALENDAR')

    // Create and download the ICS file
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'astons-schema.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>👨‍👩‍👧 Astons Schema</h1>
        <p>Koordinera Astons schema mellan mamma och pappa</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setShowForm(!showForm)
              setEditingEvent(null)
            }}
          >
            {showForm ? 'Avbryt' : '+ Lägg till händelse'}
          </button>
          <button 
            className="btn btn-continue" 
            onClick={continueSchedule}
            title="Fortsätt schemat 3 månader framåt"
          >
            ➡️ Fortsätt schema
          </button>
          <button 
            className="btn btn-cleanup" 
            onClick={cleanupFutureEvents}
            title="Ta bort händelser från ett visst datum"
          >
            🧹 Rensa framtida
          </button>
          <button 
            className="btn btn-export" 
            onClick={exportToCalendar}
            title="Exportera till Apple Kalender"
          >
            📅 Exportera till Kalender
          </button>
        </div>

        {showForm && <EventForm onAddEvent={addEvent} />}
        {editingEvent && (
          <EventForm 
            onAddEvent={(event) => updateEvent({ ...event, id: editingEvent.id })} 
            initialEvent={editingEvent}
            isEditing={true}
            onCancel={() => setEditingEvent(null)}
          />
        )}

        <div className="content-grid">
          <div className="calendar-section">
            <Calendar events={events} />
          </div>
          <div className="events-section">
            <EventList 
              events={events} 
              onDeleteEvent={deleteEvent}
              onEditEvent={startEditing}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
