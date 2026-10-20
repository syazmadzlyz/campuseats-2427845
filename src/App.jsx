import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import SpecialBanner from './components/SpecialBanner.jsx'
import Footer from './components/Footer.jsx'
import { Loading, ErrorMessage } from './components/Status.jsx'

function App() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([])

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

  function handleAddToCart(item) {
    setCart((prevCart) => [...prevCart, item])
  }

  let content

  if (loading) {
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
      <Header cartCount={cart.length} />

      <main className="container">
        {content}
      </main>

      <Footer />
    </>
  )
}

export default App