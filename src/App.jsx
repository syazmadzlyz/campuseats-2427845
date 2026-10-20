import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'

function App() {
  return (
    <>
      <Header />

      <main className="container">
        <section>
          <h2 className="section-title">Today's vendors</h2>
          <VendorCard />
        </section>
      </main>
    </>
  )
}

export default App