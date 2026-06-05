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
      UPDATE stores
      SET store_name = $1, city = $2
      WHERE store_id = $3
      RETURNING store_id, store_name, city, removed
    `,
    [storeName, city, id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 })
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
      UPDATE stores
      SET removed = true
      WHERE store_id = $1
      RETURNING store_id, store_name, city, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
