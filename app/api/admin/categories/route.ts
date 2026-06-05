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
        category_id,
        category_name,
        removed
      FROM categories
      ORDER BY category_id
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
  const categoryName = typeof body.category_name === 'string' ? body.category_name.trim() : ''

  if (!categoryName) {
    return NextResponse.json(
      { error: 'Category name is required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      INSERT INTO categories (category_name)
      VALUES ($1)
      RETURNING category_id, category_name, removed
    `,
    [categoryName]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
