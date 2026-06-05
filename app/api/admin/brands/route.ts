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
        brand_id,
        brand_name,
        removed
      FROM brands
      ORDER BY brand_id
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
  const brandName = typeof body.brand_name === 'string' ? body.brand_name.trim() : ''

  if (!brandName) {
    return NextResponse.json(
      { error: 'Brand name is required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      INSERT INTO brands (brand_name)
      VALUES ($1)
      RETURNING brand_id, brand_name, removed
    `,
    [brandName]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
