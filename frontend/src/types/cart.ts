export interface CartItem {
  id: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

export interface CartSummary {
  subtotal: number
  shippingFee: number
  total: number
}

