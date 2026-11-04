import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section className="card">
      <h2>404 — Page not found</h2>
      <p>The address you opened does not match a page.</p>
      <Link to="/">Back to vendors</Link>
    </section>
  )
}

export default NotFoundPage