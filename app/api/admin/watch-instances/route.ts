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
        wi.instance_id,
        wi.model_id,
        b.brand_name,
        wm.model_name,
        wm.reference_code,
        wi.store_id,
        s.store_name,
        s.city,
        wi.serial_number,
        wi.price,
        wi.status,
        wi.removed
      FROM watch_instances wi
      JOIN watch_models wm ON wm.model_id = wi.model_id
      JOIN brands b ON b.brand_id = wm.brand_id
      JOIN stores s ON s.store_id = wi.store_id
      ORDER BY wi.instance_id
    `
  )

  return NextResponse.json(result.rows)
}
