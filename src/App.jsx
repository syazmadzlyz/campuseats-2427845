import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import SpecialBanner from './components/SpecialBanner.jsx'
import CartPage from './components/CartPage.jsx'
import Footer from './components/Footer.jsx'
import { Loading, ErrorMessage } from './components/Status.jsx'

function App() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([])
  const [view, setView] = useState('menu')
  const [lastOrder, setLastOrder] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadVendors() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/vendors.json', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const data = await response.json()

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No vendors were found.')
        }

        if (controller.signal.aborted) {
          return
        }

        setVendors(data)

        setSelectedVendorId((previousId) =>
          data.some((vendor) => vendor.id === previousId)
            ? previousId
            : data[0].id
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadVendors()

    return () => controller.abort()
  }, [reloadKey])

  const selectedVendor = vendors.find(
    (vendor) => vendor.id === selectedVendorId
  )

  const specialItem = selectedVendor?.menu.find(
    (item) => item.special
  )

  const cartCount = cart.reduce(
    (sum, line) => sum + line.qty,
    0
  )

  function handleAddToCart(item) {
    setCart((previousCart) => {
      const existingLine = previousCart.find(
        (line) => line.item.id === item.id
      )

      if (existingLine) {
        return previousCart.map((line) =>
          line.item.id === item.id
            ? { ...line, qty: line.qty + 1 }
            : line
        )
      }

      return [...previousCart, { item, qty: 1 }]
    })
  }

  function handleChangeQty(itemId, delta) {
    setCart((previousCart) =>
      previousCart
        .map((line) =>
          line.item.id === itemId
            ? { ...line, qty: line.qty + delta }
            : line
        )
        .filter((line) => line.qty > 0)
    )
  }

  function handleRemove(itemId) {
    setCart((previousCart) =>
      previousCart.filter((line) => line.item.id !== itemId)
    )
  }

  function handlePlaceOrder(details) {
    if (cart.length === 0) {
      return
    }

    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0
    )

    setLastOrder({
      ...details,
      items: cart,
      total,
    })

    setCart([])
    setView('done')
  }

  let content

  if (view === 'cart') {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  } else if (view === 'done' && lastOrder) {
    content = (
      <section className="card">
        <h2>Order placed!</h2>
        <p>Thank you, {lastOrder.name}.</p>
        <p>Mahallah: {lastOrder.mahallah}</p>
        <p>Pickup time: {lastOrder.pickupTime}</p>

        <ul>
          {lastOrder.items.map((line) => (
            <li key={line.item.id}>
              {line.item.name} × {line.qty}
            </li>
          ))}
        </ul>

        <p className="price">
          Total: RM {lastOrder.total.toFixed(2)}
        </p>

        <button
          type="button"
          className="btn"
          onClick={() => setView('menu')}
        >
          Back to vendors
        </button>
      </section>
    )
  } else if (loading) {
    content = <Loading />
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    )
  } else if (selectedVendor) {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>

          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            Menu: {selectedVendor.name}
          </h2>

          <SpecialBanner item={specialItem} />

          <MenuList
            items={selectedVendor.menu}
            onAdd={handleAddToCart}
          />
        </section>
      </>
    )
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView('menu')}
        onShowCart={() => setView('cart')}
      />

      <main className="container">
        {content}
      </main>

      <Footer />
    </>
  )
}

export default App