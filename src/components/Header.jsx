import { Link, NavLink, useNavigate } from 'react-router'
import { useCart } from '../hooks/useCart.js'
import { useAuth } from '../hooks/useAuth.js'

function Header() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    navigate('/', { replace: true })
    await logout()
  }

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/" className="logo-link">
          CampusEats
        </Link>
      </h1>

      <nav className="nav">
        <NavLink to="/" end>
          Vendors
        </NavLink>

        <NavLink to="/orders">
          My Orders
        </NavLink>

        <NavLink to="/cart" className="cart">
          Cart <span className="badge">{count}</span>
        </NavLink>
        {user ? (
          <>
            <span className="user-name">Hi, {user.displayName || user.email}</span>
            <button type="button" className="link" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  )
}

export default Header