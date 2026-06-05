import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { query } from '@/lib/db'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin()

  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await context.params
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
      UPDATE watch_models
      SET
        brand_id = $1,
        category_id = $2,
        mechanism_id = $3,
        model_name = $4,
        reference_code = $5,
        image_url = $6
      WHERE model_id = $7
      RETURNING model_id, brand_id, category_id, mechanism_id, model_name, reference_code, image_url, removed
    `,
    [brandId, categoryId, mechanismId, modelName, referenceCode, imageUrl || null, id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Watch model not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin()

  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await context.params
  const result = await query(
    `
      UPDATE watch_models
      SET removed = true
      WHERE model_id = $1
      RETURNING model_id, brand_id, category_id, mechanism_id, model_name, reference_code, image_url, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Watch model not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
