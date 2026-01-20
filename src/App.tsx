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

// Generate initial schedule for Aston
const generateInitialSchedule = (): ScheduleEvent[] => {
  const events: ScheduleEvent[] = []
  const today = new Date()
  
  // Find the most recent Monday
  const currentDay = today.getDay()
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay
  const thisMonday = new Date(today)
  thisMonday.setDate(today.getDate() + daysToMonday)
  
  // Week 1: Dad Monday -> Monday (7 days)
  const week1Start = new Date(thisMonday)
  events.push({
    id: 'initial-1',
    title: 'Aston hos pappa',
    date: formatDate(week1Start),
    time: '18:00',
    description: 'En vecka hos pappa',
    parent: 'dad',
    type: 'other'
  })
  
  // Week 2: Mom Monday -> Friday (4 days)
  const week2Start = new Date(week1Start)
  week2Start.setDate(week1Start.getDate() + 7)
  events.push({
    id: 'initial-2',
    title: 'Aston hos mamma',
    date: formatDate(week2Start),
    time: '18:00',
    description: 'Måndag till fredag hos mamma',
    parent: 'mom',
    type: 'other'
  })
  
  // Week 2: Dad Friday -> Friday (7 days)
  const week2Friday = new Date(week2Start)
  week2Friday.setDate(week2Start.getDate() + 4)
  events.push({
    id: 'initial-3',
    title: 'Aston hos pappa',
    date: formatDate(week2Friday),
    time: '18:00',
    description: 'En vecka hos pappa (fredag till fredag)',
    parent: 'dad',
    type: 'other'
  })
  
  // Week 3: Mom Friday -> Monday (3 days weekend)
  const week3Friday = new Date(week2Friday)
  week3Friday.setDate(week2Friday.getDate() + 7)
  events.push({
    id: 'initial-4',
    title: 'Aston hos mamma',
    date: formatDate(week3Friday),
    time: '18:00',
    description: 'Helg hos mamma (fredag till måndag)',
    parent: 'mom',
    type: 'other'
  })
  
  return events
}

function App() {
  const [events, setEvents] = useState<ScheduleEvent[]>(generateInitialSchedule())
  const [showForm, setShowForm] = useState(false)

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents([...events, newEvent])
    setShowForm(false)
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
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
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Avbryt' : '+ Lägg till händelse'}
          </button>
        </div>

        {showForm && <EventForm onAddEvent={addEvent} />}

        <div className="content-grid">
          <div className="calendar-section">
            <Calendar events={events} />
          </div>
          <div className="events-section">
            <EventList events={events} onDeleteEvent={deleteEvent} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
