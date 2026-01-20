import { ScheduleEvent } from '../App'
import './EventList.css'

interface EventListProps {
  events: ScheduleEvent[]
  onDeleteEvent: (id: string) => void
}

const EventList = ({ events, onDeleteEvent }: EventListProps) => {
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
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events scheduled yet.</p>
          <p>Click "Add Event" to get started!</p>
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
                    {event.parent === 'mom' ? '👩 Mom' : '👨 Dad'}
                  </span>
                </div>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => onDeleteEvent(event.id)}
                  title="Delete event"
                >
                  ✕
                </button>
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
