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
  const brandName = typeof body.brand_name === 'string' ? body.brand_name.trim() : ''

  if (!brandName) {
    return NextResponse.json(
      { error: 'Brand name is required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      UPDATE brands
      SET brand_name = $1
      WHERE brand_id = $2
      RETURNING brand_id, brand_name, removed
    `,
    [brandName, id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
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
      UPDATE brands
      SET removed = true
      WHERE brand_id = $1
      RETURNING brand_id, brand_name, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
