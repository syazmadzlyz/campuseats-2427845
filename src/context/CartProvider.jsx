import { CartContext } from './cart-context.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('campuseats-cart', [])
  const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

  const count = cart.reduce(
    (sum, line) => sum + line.qty,
    0
  )

  const total = cart.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0
  )

  function addToCart(item) {
    if (!item.available) {
      return
    }

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

  function changeQty(itemId, delta) {
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

  function removeFromCart(itemId) {
    setCart((previousCart) =>
      previousCart.filter(
        (line) => line.item.id !== itemId
      )
    )
  }

  function placeOrder(details) {
    if (cart.length === 0) {
      return null
    }

    const order = {
      ...details,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'Received',
      items: cart.map((line) => ({
        item: { ...line.item },
        qty: line.qty,
      })),
      total,
    }

    setOrders((previousOrders) => [
      order,
      ...previousOrders,
    ])

    setCart([])

    return order
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        count,
        total,
        addToCart,
        changeQty,
        removeFromCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider