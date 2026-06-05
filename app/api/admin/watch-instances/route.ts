import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { query } from '@/lib/db'

export async function GET() {
  const auth = await requireAdmin()

  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const result = await query(
    `
      SELECT
        wi.instance_id,
        wi.model_id,
        b.brand_name,
        wm.model_name,
        wm.reference_code,
        wi.store_id,
        s.store_name,
        s.city,
        wi.serial_number,
        wi.price,
        wi.status,
        wi.removed
      FROM watch_instances wi
      JOIN watch_models wm ON wm.model_id = wi.model_id
      JOIN brands b ON b.brand_id = wm.brand_id
      JOIN stores s ON s.store_id = wi.store_id
      ORDER BY wi.instance_id
    `
  )

  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const auth = await requireAdmin()

  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await request.json()
  const modelId = body.model_id
  const storeId = body.store_id
  const serialNumber = typeof body.serial_number === 'string' ? body.serial_number.trim() : ''
  const price = Number(body.price)
  const status = typeof body.status === 'string' ? body.status.trim().toUpperCase() : ''

  if (!modelId || !storeId || !serialNumber || !Number.isFinite(price) || price < 0 || !['AVAILABLE', 'RESERVED', 'SOLD'].includes(status)) {
    return NextResponse.json(
      { error: 'Required watch instance fields are missing' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      INSERT INTO watch_instances (
        model_id,
        store_id,
        serial_number,
        price,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING instance_id, model_id, store_id, serial_number, price, status, removed
    `,
    [modelId, storeId, serialNumber, price, status]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
