import { ScheduleEvent } from '../App'
import './EventList.css'

interface EventListProps {
  events: ScheduleEvent[]
  onDeleteEvent: (id: string) => void
  onEditEvent: (event: ScheduleEvent) => void
}

const EventList = ({ events, onDeleteEvent, onEditEvent }: EventListProps) => {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`)
    const dateB = new Date(`${b.date} ${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  const getEventIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'pickup':
        return '🚗'
      case 'dropoff':
        return '🏫'
      case 'activity':
        return '⚽'
      case 'appointment':
        return '👨‍⚕️'
      default:
        return '📅'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="event-list">
      <h2>Kommande händelser</h2>
      {events.length === 0 ? (
        <div className="empty-state">
          <p>Inga händelser inlagda än.</p>
          <p>Klicka på "Lägg till händelse" för att komma igång!</p>
        </div>
      ) : (
        <div className="events">
          {sortedEvents.map((event) => (
            <div key={event.id} className={`event-card ${event.parent}`}>
              <div className="event-header">
                <span className="event-icon">{getEventIcon(event.type)}</span>
                <div className="event-title-group">
                  <h3>{event.title}</h3>
                  <span className={`event-badge ${event.parent}`}>
                    {event.parent === 'mom' ? '👩 Mamma' : '👨 Pappa'}
                  </span>
                </div>
                <div className="event-actions">
                  <button 
                    className="btn btn-edit btn-small"
                    onClick={() => onEditEvent(event)}
                    title="Redigera händelse"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => onDeleteEvent(event.id)}
                    title="Ta bort händelse"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="event-details">
                <div className="event-datetime">
                  <span className="date">📅 {formatDate(event.date)}</span>
                  <span className="time">🕐 {event.time}</span>
                </div>
                <span className="event-type">{event.type}</span>
              </div>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventList
