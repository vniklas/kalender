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
      alert('Please fill in all required fields')
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
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Soccer Practice"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
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
            <label htmlFor="parent">Responsible Parent</label>
            <select
              id="parent"
              value={parent}
              onChange={(e) => setParent(e.target.value as 'mom' | 'dad')}
            >
              <option value="mom">Mom</option>
              <option value="dad">Dad</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Event Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ScheduleEvent['type'])}
            >
              <option value="pickup">Pickup</option>
              <option value="dropoff">Drop-off</option>
              <option value="activity">Activity</option>
              <option value="appointment">Appointment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details..."
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Event
        </button>
      </form>
    </div>
  )
}

export default EventForm
