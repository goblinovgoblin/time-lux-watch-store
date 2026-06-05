import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { query } from '@/lib/db'

type RouteContext = {
  params: Promise<{ id: string }>
}

const allowedStatuses = ['AVAILABLE', 'RESERVED', 'SOLD']

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin()

  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await context.params
  const body = await request.json()
  const modelId = body.model_id
  const storeId = body.store_id
  const serialNumber = typeof body.serial_number === 'string' ? body.serial_number.trim() : ''
  const price = Number(body.price)
  const status = typeof body.status === 'string' ? body.status.trim().toUpperCase() : ''

  if (!modelId || !storeId || !serialNumber || !Number.isFinite(price) || price < 0 || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: 'Required watch instance fields are missing' },
      { status: 400 }
    )
  }

  const result = await query(
    `
      UPDATE watch_instances
      SET
        model_id = $1,
        store_id = $2,
        serial_number = $3,
        price = $4,
        status = $5
      WHERE instance_id = $6
      RETURNING instance_id, model_id, store_id, serial_number, price, status, removed
    `,
    [modelId, storeId, serialNumber, price, status, id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Watch instance not found' }, { status: 404 })
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
      UPDATE watch_instances
      SET removed = true
      WHERE instance_id = $1
      RETURNING instance_id, model_id, store_id, serial_number, price, status, removed
    `,
    [id]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Watch instance not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
