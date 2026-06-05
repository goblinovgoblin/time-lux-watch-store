import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { query } from '@/lib/db'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin()

  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await context.params
  const result = await query(
    `
      UPDATE orders
      SET removed = true
      WHERE order_id = $1
      RETURNING order_id, customer_id, order_date, status, total_amount, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
