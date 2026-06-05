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
        wm.model_id,
        wm.brand_id,
        b.brand_name,
        wm.category_id,
        c.category_name,
        wm.mechanism_id,
        m.mechanism_name,
        wm.model_name,
        wm.reference_code,
        wm.image_url,
        wm.removed
      FROM watch_models wm
      JOIN brands b ON b.brand_id = wm.brand_id
      JOIN categories c ON c.category_id = wm.category_id
      JOIN mechanisms m ON m.mechanism_id = wm.mechanism_id
      ORDER BY wm.model_id
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
  const brandId = body.brand_id
  const categoryId = body.category_id
  const mechanismId = body.mechanism_id
  const modelName = typeof body.model_name === 'string' ? body.model_name.trim() : ''
  const referenceCode = typeof body.reference_code === 'string' ? body.reference_code.trim() : ''
  const imageUrl = typeof body.image_url === 'string' ? body.image_url.trim() : ''

  if (!brandId || !categoryId || !mechanismId || !modelName || !referenceCode) {
    return NextResponse.json(
      { error: 'Required watch model fields are missing' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      INSERT INTO watch_models (
        brand_id,
        category_id,
        mechanism_id,
        model_name,
        reference_code,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING model_id, brand_id, category_id, mechanism_id, model_name, reference_code, image_url, removed
    `,
    [brandId, categoryId, mechanismId, modelName, referenceCode, imageUrl || null]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
