// src/types/index.ts

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  salePrice?: number
  category: {
    _id: string
    name: string
    slug: string
  }
  images: {
    url: string
    alt?: string
    isDefault: boolean
  }[]
  inventory: {
    quantity: number
    sku: string
  }
  ratings: {
    average: number
    count: number
  }
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest'

export interface Filter {
  categories: string[]
  types: string[]
}

export interface FilterState {
  categories: string[]
  priceRange: {
    min?: number
    max?: number
  }
  search?: string
}