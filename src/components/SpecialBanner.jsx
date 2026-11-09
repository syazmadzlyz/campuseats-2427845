import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

function getSecondsRemaining() {
  const now = new Date()
  const endTime = new Date()

  endTime.setHours(22, 0, 0, 0)

  return Math.max(
    0,
    Math.ceil((endTime.getTime() - now.getTime()) / 1000)
  )
}

function formatCountdown(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
}

function SpecialCountdown({ item, name }) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    getSecondsRemaining
  )

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining(getSecondsRemaining())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <aside className="card">
      <p className="tag">Today’s special for {name}</p>
      <h3>{item.name}</h3>
      <p className="muted">{item.description}</p>
      <p className="price">RM {item.price.toFixed(2)}</p>

      {secondsRemaining > 0 ? (
        <p>
          Ends at 10:00 pm · Time left:{' '}
          <strong>{formatCountdown(secondsRemaining)}</strong>
        </p>
      ) : (
        <p className="muted">Today's special has ended.</p>
      )}
    </aside>
  )
}

function SpecialBanner({ item }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading || !item) {
    return null
  }

  if (!user) {
    return (
      <aside className="card">
        <Link to="/login" state={{ from: location.pathname }}>
          Log in to see today’s special
        </Link>
      </aside>
    )
  }

  const name = user.displayName || user.email?.split('@')[0] || 'there'
  return <SpecialCountdown item={item} name={name} />
}

export default SpecialBanner