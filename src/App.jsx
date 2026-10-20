import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuItemCard from './components/MenuItemCard.jsx'

function App() {
  return (
    <>
      <Header />

      <main className="container">
        <section>
          <h2 className="section-title">Today's vendors</h2>
          <VendorCard />
        </section>

        <section>
          <h2 className="section-title">Popular items</h2>

          <div className="grid">
            <MenuItemCard />
          </div>
        </section>
      </main>
    </>
  )
}

export default App