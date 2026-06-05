import { categoryLabels, mechanismLabels, watches } from '@/lib/data'
import type { Watch } from '@/lib/types'

export interface CatalogFilters {
  search?: string | null
  brandId?: string | null
  categoryId?: string | null
  mechanismId?: string | null
  city?: string | null
  minPrice?: number | string | null
  maxPrice?: number | string | null
  availableOnly?: boolean | null
}

export interface CatalogWatch {
  instance_id: string
  model_id: string
  brand_name: string
  model_name: string
  reference_code: string
  category_name: string
  mechanism_name: string
  serial_number: string
  price: number | string
  status: string
  store_name: string
  city: string
  image_url: string | null
}

export interface CustomerOrderHistoryRow {
  order_id: string | number
  order_date: string
  order_status: string
  total_amount: number | string
  instance_id: string | number
  brand_name: string
  model_name: string
  reference_code: string
  serial_number: string
  item_price: number | string
  store_name: string
  city: string
  image_url: string | null
}

function appendParam(
  params: URLSearchParams,
  name: string,
  value: string | number | boolean | null | undefined
) {
  if (value === null || value === undefined || value === '') {
    return
  }

  params.set(name, String(value))
}

function mapMockWatchToCatalogWatch(watch: Watch): CatalogWatch {
  return {
    instance_id: watch.id,
    model_id: watch.id,
    brand_name: watch.brand,
    model_name: watch.name,
    reference_code: watch.id,
    category_name: categoryLabels[watch.category] ?? watch.category,
    mechanism_name: mechanismLabels[watch.mechanism] ?? watch.mechanism,
    serial_number: `MOCK-${watch.id}`,
    price: watch.price,
    status: watch.inStock ? 'available' : 'unavailable',
    store_name: 'TimeLux',
    city: 'Москва',
    image_url: watch.image,
  }
}

export const mockCatalogWatches = watches.map(mapMockWatchToCatalogWatch)

export async function getCatalog(filters: CatalogFilters = {}) {
  const params = new URLSearchParams()

  appendParam(params, 'search', filters.search)
  appendParam(params, 'brandId', filters.brandId)
  appendParam(params, 'categoryId', filters.categoryId)
  appendParam(params, 'mechanismId', filters.mechanismId)
  appendParam(params, 'city', filters.city)
  appendParam(params, 'minPrice', filters.minPrice)
  appendParam(params, 'maxPrice', filters.maxPrice)
  appendParam(params, 'availableOnly', filters.availableOnly ?? true)

  const queryString = params.toString()
  const response = await fetch(`/api/catalog${queryString ? `?${queryString}` : ''}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to load catalog')
  }

  return response.json() as Promise<CatalogWatch[]>
}

export async function getWatchById(id: string) {
  const response = await fetch(`/api/catalog/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to load watch')
  }

  return response.json() as Promise<CatalogWatch>
}

export async function createOrder(instanceId: number | string) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ instanceId: Number(instanceId) }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Не удалось оформить заказ')
  }

  return result as {
    success: true
    order_id: string | number
  }
}

export async function getCustomerOrders() {
  const response = await fetch('/api/profile/orders', {
    cache: 'no-store',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to load customer orders')
  }

  return response.json() as Promise<CustomerOrderHistoryRow[]>
}

export function getMockWatchById(id: string) {
  return mockCatalogWatches.find(watch => watch.instance_id === id)
}
