import { useState } from 'react'
import { ScheduleEvent } from '../App'
import './EventForm.css'

interface EventFormProps {
  onAddEvent: (event: Omit<ScheduleEvent, 'id'>) => void
}

const EventForm = ({ onAddEvent }: EventFormProps) => {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [parent, setParent] = useState<'mom' | 'dad'>('mom')
  const [type, setType] = useState<ScheduleEvent['type']>('other')

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

    // Reset form
    setTitle('')
    setDate('')
    setTime('')
    setDescription('')
    setParent('mom')
    setType('other')
  }

  return (
    <div className="event-form-container">
      <h2>Lägg till ny händelse</h2>
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
          Lägg till händelse
        </button>
      </form>
    </div>
  )
}

export default EventForm
