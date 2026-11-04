import { Link } from 'react-router'
import VendorCard from '../components/VendorCard.jsx'
import SpecialBanner from '../components/SpecialBanner.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useVendors } from '../hooks/useVendors.js'

function HomePage() {
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

  if (vendors.length === 0) {
    return <p className="muted">No vendors available yet.</p>
  }

  const specials = vendors.flatMap((vendor) =>
    vendor.menu
      .filter((item) => item.special)
      .map((item) => ({ vendor, item }))
  )

  return (
    <>
      <section>
        <h2 className="section-title">Choose a vendor</h2>

        <div className="vendor-grid">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Today's specials</h2>

        {specials.length === 0 ? (
          <p className="muted">
            No specials available today.
          </p>
        ) : (
          <div className="grid">
            {specials.map(({ vendor, item }) => (
              <div key={item.id}>
                <p>
                  <Link to={`/vendor/${vendor.id}`}>
                    {vendor.name} — View menu
                  </Link>
                </p>

                <SpecialBanner item={item} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage