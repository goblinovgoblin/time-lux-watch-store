export interface Watch {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  description: string
  image: string
  category: 'luxury' | 'sport' | 'classic' | 'smart'
  gender: 'men' | 'women' | 'unisex'
  mechanism: 'automatic' | 'quartz' | 'mechanical'
  caseMaterial: string
  caseSize: number // in mm
  waterResistance: number // in meters
  warranty: number // in years
  inStock: boolean
  featured: boolean
  createdAt: string
}

export interface User {
  id: string
  email: string
  password: string
  role: 'admin' | 'user'
  name: string
}

export interface FilterOptions {
  search: string
  brand: string
  category: string
  gender: string
  mechanism: string
  priceRange: [number, number]
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest'
}
