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
  const mechanismName = typeof body.mechanism_name === 'string' ? body.mechanism_name.trim() : ''

  if (!mechanismName) {
    return NextResponse.json(
      { error: 'Mechanism name is required' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      UPDATE mechanisms
      SET mechanism_name = $1
      WHERE mechanism_id = $2
      RETURNING mechanism_id, mechanism_name, removed
    `,
    [mechanismName, id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Mechanism not found' }, { status: 404 })
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
      UPDATE mechanisms
      SET removed = true
      WHERE mechanism_id = $1
      RETURNING mechanism_id, mechanism_name, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Mechanism not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
