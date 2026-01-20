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

function App() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
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
        <h1>👨‍👩‍👧 Kid Schedule Manager</h1>
        <p>Coordinate your child's activities and schedule</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Event'}
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
