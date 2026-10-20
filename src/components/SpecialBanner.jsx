function SpecialBanner({ item }) {
  if (!item) {
    return null
  }

  return (
    <aside className="card">
      <p className="tag">Daily special</p>
      <h3>{item.name}</h3>
      <p className="muted">{item.description}</p>
      <p className="price">RM {item.price.toFixed(2)}</p>
    </aside>
  )
}

export default SpecialBanner