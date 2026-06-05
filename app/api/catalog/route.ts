import { NextResponse, type NextRequest } from 'next/server'
import { query } from '@/lib/db'

type CatalogWatchRow = {
  instance_id: string
  model_id: string
  brand_name: string
  model_name: string
  reference_code: string
  category_name: string
  mechanism_name: string
  serial_number: string
  price: string | number
  status: string
  store_name: string
  city: string
  image_url: string | null
}

function getNullableParam(searchParams: URLSearchParams, name: string) {
  const value = searchParams.get(name)
  return value && value.trim() ? value.trim() : null
}

function getNullableNumberParam(searchParams: URLSearchParams, name: string) {
  const value = getNullableParam(searchParams, name)
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function getAvailableOnly(searchParams: URLSearchParams) {
  const value = getNullableParam(searchParams, 'availableOnly')
  if (!value) {
    return true
  }

  return value.toLowerCase() === 'true'
}

function toCatalogWatch(row: CatalogWatchRow) {
  return {
    instance_id: row.instance_id,
    model_id: row.model_id,
    brand_name: row.brand_name,
    model_name: row.model_name,
    reference_code: row.reference_code,
    category_name: row.category_name,
    mechanism_name: row.mechanism_name,
    serial_number: row.serial_number,
    price: row.price,
    status: row.status,
    store_name: row.store_name,
    city: row.city,
    image_url: row.image_url,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const params = [
    getNullableParam(searchParams, 'search'),
    getNullableParam(searchParams, 'brandId'),
    getNullableParam(searchParams, 'categoryId'),
    getNullableParam(searchParams, 'mechanismId'),
    getNullableParam(searchParams, 'city'),
    getNullableNumberParam(searchParams, 'minPrice'),
    getNullableNumberParam(searchParams, 'maxPrice'),
    getAvailableOnly(searchParams),
  ]

  try {
    const result = await query<CatalogWatchRow>(
      `
        SELECT sw.*, wi.serial_number
        FROM search_watches($1, $2, $3, $4, $5, $6, $7, $8) sw
        JOIN watch_instances wi ON wi.instance_id = sw.instance_id
      `,
      params
    )

    return NextResponse.json(result.rows.map(toCatalogWatch))
  } catch (error) {
    console.error('Failed to fetch catalog watches', error)
    return NextResponse.json(
      { error: 'Failed to fetch catalog watches' },
      { status: 500 }
    )
  }
}
