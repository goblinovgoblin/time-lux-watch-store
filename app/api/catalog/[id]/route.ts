import { NextResponse } from 'next/server'
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

type RouteContext = {
  params: Promise<{
    id: string
  }>
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

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const result = await query<CatalogWatchRow>(
      `
        SELECT
          wi.instance_id,
          wm.model_id,
          b.brand_name,
          wm.model_name,
          wm.reference_code,
          c.category_name,
          m.mechanism_name,
          wi.serial_number,
          wi.price,
          wi.status,
          s.store_name,
          s.city,
          wm.image_url
        FROM watch_instances wi
        JOIN watch_models wm ON wm.model_id = wi.model_id
        JOIN brands b ON b.brand_id = wm.brand_id
        JOIN categories c ON c.category_id = wm.category_id
        JOIN mechanisms m ON m.mechanism_id = wm.mechanism_id
        JOIN stores s ON s.store_id = wi.store_id
        WHERE wi.instance_id = $1
          AND wi.removed = false
          AND wm.removed = false
          AND b.removed = false
          AND c.removed = false
          AND m.removed = false
          AND s.removed = false
        LIMIT 1
      `,
      [id]
    )

    const watch = result.rows[0]

    if (!watch) {
      return NextResponse.json(
        { error: 'Catalog watch not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(toCatalogWatch(watch))
  } catch (error) {
    console.error('Failed to fetch catalog watch', error)
    return NextResponse.json(
      { error: 'Failed to fetch catalog watch' },
      { status: 500 }
    )
  }
}
