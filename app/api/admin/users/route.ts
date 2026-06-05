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
        u.user_id,
        u.full_name,
        u.email,
        u.role_id,
        r.role_name,
        u.removed
      FROM users u
      JOIN roles r ON r.role_id = u.role_id
      ORDER BY u.user_id
    `
  )

  return NextResponse.json(result.rows)
}
