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
        store_id,
        store_name,
        city,
        removed
      FROM stores
      ORDER BY store_id
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
  const storeName = typeof body.store_name === 'string' ? body.store_name.trim() : ''
  const city = typeof body.city === 'string' ? body.city.trim() : ''

  if (!storeName || !city) {
    return NextResponse.json(
      { error: 'Store name and city are required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      INSERT INTO stores (store_name, city)
      VALUES ($1, $2)
      RETURNING store_id, store_name, city, removed
    `,
    [storeName, city]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
