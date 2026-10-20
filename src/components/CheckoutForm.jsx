import { useState } from 'react'

const MAHALLAHS = [
  'Ali',
  'Aminah',
  'Faruq',
  'Asiah',
  'Bilal',
  'Hafsa',
  'Uthman',
  'Zubair',
]

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 3) {
    errors.name = 'Enter your name (at least 3 characters).'
  }

  if (!MAHALLAHS.includes(values.mahallah)) {
    errors.mahallah = 'Please choose your mahallah.'
  }

  if (
    !values.pickupTime ||
    values.pickupTime < '07:00' ||
    values.pickupTime > '22:00'
  ) {
    errors.pickupTime = 'Choose a pickup time between 7 am and 10 pm.'
  }

  return errors
}

function CheckoutForm({ onPlaceOrder }) {
  const [values, setValues] = useState({
    name: '',
    mahallah: '',
    pickupTime: '',
  })

  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const foundErrors = validate(values)
    setErrors(foundErrors)

    if (Object.keys(foundErrors).length === 0) {
      onPlaceOrder({
        ...values,
        name: values.name.trim(),
      })
    }
  }

  return (
    <form
      className="card form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h3>Checkout</h3>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={handleChange}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? 'name-error' : undefined}
      />

      {errors.name && (
        <p id="name-error" className="field-error">
          {errors.name}
        </p>
      )}

      <label htmlFor="mahallah">Mahallah</label>
      <select
        id="mahallah"
        name="mahallah"
        value={values.mahallah}
        onChange={handleChange}
        aria-invalid={Boolean(errors.mahallah)}
        aria-describedby={
          errors.mahallah ? 'mahallah-error' : undefined
        }
      >
        <option value="">Select your mahallah</option>

        {MAHALLAHS.map((mahallah) => (
          <option key={mahallah} value={mahallah}>
            {mahallah}
          </option>
        ))}
      </select>

      {errors.mahallah && (
        <p id="mahallah-error" className="field-error">
          {errors.mahallah}
        </p>
      )}

      <label htmlFor="pickupTime">Pickup time</label>
      <input
        id="pickupTime"
        name="pickupTime"
        type="time"
        min="07:00"
        max="22:00"
        value={values.pickupTime}
        onChange={handleChange}
        aria-invalid={Boolean(errors.pickupTime)}
        aria-describedby={
          errors.pickupTime ? 'pickup-error' : undefined
        }
      />

      {errors.pickupTime && (
        <p id="pickup-error" className="field-error">
          {errors.pickupTime}
        </p>
      )}

      <button type="submit" className="btn">
        Place order
      </button>
    </form>
  )
}

export default CheckoutForm