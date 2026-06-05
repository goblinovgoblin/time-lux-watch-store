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
  const categoryName = typeof body.category_name === 'string' ? body.category_name.trim() : ''

  if (!categoryName) {
    return NextResponse.json(
      { error: 'Category name is required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      UPDATE categories
      SET category_name = $1
      WHERE category_id = $2
      RETURNING category_id, category_name, removed
    `,
    [categoryName, id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
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
      UPDATE categories
      SET removed = true
      WHERE category_id = $1
      RETURNING category_id, category_name, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
