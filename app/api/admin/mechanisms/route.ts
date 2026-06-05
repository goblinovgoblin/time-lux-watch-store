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
        mechanism_id,
        mechanism_name,
        removed
      FROM mechanisms
      ORDER BY mechanism_id
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
  const mechanismName = typeof body.mechanism_name === 'string' ? body.mechanism_name.trim() : ''

  if (!mechanismName) {
    return NextResponse.json(
      { error: 'Mechanism name is required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      INSERT INTO mechanisms (mechanism_name)
      VALUES ($1)
      RETURNING mechanism_id, mechanism_name, removed
    `,
    [mechanismName]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
