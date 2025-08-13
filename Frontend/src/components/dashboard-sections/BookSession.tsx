import { useState } from "react";

type SessionData = {
  date: string, // ISO String
  duration: number,
  trainerEmail: string
}

export function BookSession() {
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [duration, setDuration] = useState<number>(60)
  const [trainerEmail, setTrainerEmail] = useState<string>('')

  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<boolean>(false)


const bookSession = async (sessionData: SessionData) => {
  try {
    const res = await fetch('http://localhost:4000/api/client/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(sessionData)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    setError(false)
    setMessage('Session booked successfully')

    setDate('')
    setTime('')
    setDuration(60)
    setTrainerEmail('')

  } catch(e: unknown) {
    console.error(e)
    setError(true)
    if (e instanceof Error) setMessage(e.message)
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!date || !time || !trainerEmail) {
      setError(true)
      setMessage('All fields are required')
      return
  }

  if (duration < 30 || duration > 120) {
    setError(true)
    setMessage('Duration must be set between 30 and 120 minutes')
    return
  }

  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const fullDate = new Date(year, month-1, day, hours, minutes)

  const sessionData: SessionData = {
    date: fullDate.toISOString(),
    duration,
    trainerEmail
  }

  bookSession(sessionData)
}


    return (
    <div className="dashboard-section dashboard-book-session-container">
      <h2>Book a New Session</h2>

      <form className="book-session-form" onSubmit={handleSubmit}>

        <li>
          <h4>Date</h4>
          <input onChange={(e)=>setDate(e.target.value)} value={date}
            type="date" name="date" required />
        </li>

        <li>
          <h4>Time</h4>
          <input onChange={(e)=>setTime(e.target.value)} value={time}
            type="time" name="time" required />
        </li>

        <li>
          <h4>Duration (minutes)</h4>
          <input onChange={(e)=>setDuration(Number(e.target.value))} value={duration}
            type="number" name="duration" min="30" max="120" step="15" placeholder="60" required />
        </li>

        <li>
          <h4>Trainer Email</h4>
          <input onChange={(e)=>setTrainerEmail(e.target.value)} value={trainerEmail}
            type="email" name="trainerEmail" placeholder="trainer@example.com" required />
        </li>

        { message && <p className={error ? 'error-message' : 'success-message'}> {message} </p>}

        <li style={{ textAlign: "center" }}>
          <button type="submit" className="dashboard-button">
            Book Session
          </button>
        </li>

      </form>
    </div>
  );
}