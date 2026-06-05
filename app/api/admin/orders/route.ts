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
        o.order_id,
        o.customer_id,
        u.full_name AS customer_name,
        u.email AS customer_email,
        o.order_date,
        o.status,
        o.total_amount,
        o.removed
      FROM orders o
      JOIN users u ON u.user_id = o.customer_id
      ORDER BY o.order_date DESC, o.order_id DESC
    `
  )

  return NextResponse.json(result.rows)
}
