import { useState, useEffect } from 'react'
import { ScheduleEvent } from '../App'
import './EventForm.css'

interface EventFormProps {
  onAddEvent: (event: Omit<ScheduleEvent, 'id'>) => void
  initialEvent?: ScheduleEvent
  isEditing?: boolean
  onCancel?: () => void
}

const EventForm = ({ onAddEvent, initialEvent, isEditing = false, onCancel }: EventFormProps) => {
  const [title, setTitle] = useState(initialEvent?.title || '')
  const [date, setDate] = useState(initialEvent?.date || '')
  const [time, setTime] = useState(initialEvent?.time || '')
  const [description, setDescription] = useState(initialEvent?.description || '')
  const [parent, setParent] = useState<'mom' | 'dad'>(initialEvent?.parent || 'mom')
  const [type, setType] = useState<ScheduleEvent['type']>(initialEvent?.type || 'other')

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title)
      setDate(initialEvent.date)
      setTime(initialEvent.time)
      setDescription(initialEvent.description)
      setParent(initialEvent.parent)
      setType(initialEvent.type)
    }
  }, [initialEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !date || !time) {
      alert('Vänligen fyll i alla obligatoriska fält')
      return
    }

    onAddEvent({
      title,
      date,
      time,
      description,
      parent,
      type,
    })

    // Reset form only if not editing
    if (!isEditing) {
      setTitle('')
      setDate('')
      setTime('')
      setDescription('')
      setParent('mom')
      setType('other')
    }
  }

  return (
    <div className="event-form-container">
      <h2>{isEditing ? 'Redigera händelse' : 'Lägg till ny händelse'}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Händelse *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="t.ex. Fotbollsträning"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Datum *</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Tid *</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="parent">Ansvarig förälder</label>
            <select
              id="parent"
              value={parent}
              onChange={(e) => setParent(e.target.value as 'mom' | 'dad')}
            >
              <option value="mom">Mamma</option>
              <option value="dad">Pappa</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Typ av händelse</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ScheduleEvent['type'])}
            >
              <option value="pickup">Hämtning</option>
              <option value="dropoff">Lämning</option>
              <option value="activity">Aktivitet</option>
              <option value="appointment">Möte</option>
              <option value="other">Övrigt</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Beskrivning</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ytterligare detaljer..."
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Uppdatera händelse' : 'Lägg till händelse'}
        </button>
        {isEditing && onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Avbryt
          </button>
        )}
      </form>
    </div>
  )
}

export default EventForm
