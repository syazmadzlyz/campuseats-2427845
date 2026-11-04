import { Link } from 'react-router'
import { useCart } from '../hooks/useCart.js'

function OrdersPage() {
  const { orders } = useCart()

  if (orders.length === 0) {
    return (
      <section>
        <h2 className="section-title">My orders</h2>
        <p className="muted">
          You have not placed any orders yet.
        </p>
        <Link to="/">Browse vendors</Link>
      </section>
    )
  }

  return (
    <section>
      <h2 className="section-title">My orders</h2>

      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="card">
            <h3>Order for {order.name}</h3>

            <p className="muted">
              Placed: {new Date(order.createdAt).toLocaleString('en-MY')}
            </p>

            <p>Mahallah: {order.mahallah}</p>
            <p>Pickup time: {order.pickupTime}</p>

            <span className="status open">
              {order.status}
            </span>

            <ul>
              {order.items.map((line) => (
                <li key={line.item.id}>
                  {line.item.name} × {line.qty}
                  {' — '}
                  RM {(line.item.price * line.qty).toFixed(2)}
                </li>
              ))}
            </ul>

            <p className="price">
              Total: RM {order.total.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default OrdersPage