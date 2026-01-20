import { useState } from 'react'
import { ScheduleEvent } from '../App'
import './Calendar.css'

interface CalendarProps {
  events: ScheduleEvent[]
}

const Calendar = ({ events }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get ISO week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    // In Sweden, week starts on Monday (adjust Sunday from 0 to 7)
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    return { daysInMonth, startingDayOfWeek }
  }

  const getEventsForDate = (date: Date) => {
    // Format date as YYYY-MM-DD in local timezone (not UTC)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    return events.filter(event => event.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' })

  const renderCalendarDays = () => {
    const days = []
    const weeks: number[] = []
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = new Date().toDateString() === date.toDateString()
      
      // Track week numbers (one per week)
      const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
      if (dayOfWeek === 0 || day === 1) {
        weeks.push(getWeekNumber(date))
      }

      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <div className="day-number">{day}</div>
          {dayEvents.length > 0 && (
            <div className="day-events">
              {dayEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`event-dot ${event.parent}`}
                  title={`${event.title} - ${event.time}`}
                ></div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return { days, weeks }
  }

  const { days, weeks } = renderCalendarDays()

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={previousMonth} className="nav-btn">‹</button>
        <h2>{monthName}</h2>
        <button onClick={nextMonth} className="nav-btn">›</button>
      </div>
      
      <div className="calendar-wrapper">
        <div className="week-numbers">
          <div className="week-header">V.</div>
          {weeks.map((weekNum, idx) => (
            <div key={idx} className="week-number">
              {weekNum}
            </div>
          ))}
        </div>
        
        <div className="calendar-content">
          <div className="calendar-grid">
            <div className="weekday">Mån</div>
            <div className="weekday">Tis</div>
            <div className="weekday">Ons</div>
            <div className="weekday">Tor</div>
            <div className="weekday">Fre</div>
            <div className="weekday">Lör</div>
            <div className="weekday">Sön</div>
            
            {days}
          </div>
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot mom"></div>
          <span>Mamma</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot dad"></div>
          <span>Pappa</span>
        </div>
      </div>
    </div>
  )
}

export default Calendar
