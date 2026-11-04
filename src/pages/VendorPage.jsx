import { Link, useParams } from 'react-router'
import MenuList from '../components/MenuList.jsx'
import SpecialBanner from '../components/SpecialBanner.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useVendors } from '../hooks/useVendors.js'

function VendorPage() {
  const { id } = useParams()
  const { vendors, loading, error, reload } = useVendors()

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={reload}
      />
    )
  }

  const vendor = vendors.find(
    (vendor) => vendor.id === id
  )

  if (!vendor) {
    return (
      <section className="card">
        <h2>Vendor not found</h2>
        <p>We could not find the stall you requested.</p>
        <Link to="/">Back to vendors</Link>
      </section>
    )
  }

  const specialItem = vendor.menu.find(
    (item) => item.special
  )

  return (
    <section>
      <Link to="/">← Back to vendors</Link>

      <h2 className="section-title">{vendor.name}</h2>
      <p className="muted">{vendor.location}</p>
      <p className="muted">Open: {vendor.openHours}</p>

      <span
        className={
          vendor.isOpen ? 'status open' : 'status closed'
        }
      >
        {vendor.isOpen ? 'Open now' : 'Closed'}
      </span>

      <h3 className="section-title">Daily special</h3>
      <SpecialBanner item={specialItem} />

      <h3 className="section-title">Menu</h3>
      <MenuList items={vendor.menu} />
    </section>
  )
}

export default VendorPage