import CartItem from './CartItem.jsx'

function CartPage({ cart, onChangeQty, onRemove }) {
  if (cart.length === 0) {
    return (
      <section>
        <h2 className="section-title">Your cart</h2>
        <p className="muted">
          Your cart is empty. Pick something from a menu first.
        </p>
      </section>
    )
  }

  const total = cart.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0
  )

  return (
    <section>
      <h2 className="section-title">Your cart</h2>

      <div className="card">
        <ul className="cart-list">
          {cart.map((line) => (
            <CartItem
              key={line.item.id}
              line={line}
              onChangeQty={onChangeQty}
              onRemove={onRemove}
            />
          ))}
        </ul>

        <p className="cart-total">
          Total: RM {total.toFixed(2)}
        </p>
      </div>
    </section>
  )
}

export default CartPage