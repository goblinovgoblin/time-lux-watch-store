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
        wm.model_id,
        wm.brand_id,
        b.brand_name,
        wm.category_id,
        c.category_name,
        wm.mechanism_id,
        m.mechanism_name,
        wm.model_name,
        wm.reference_code,
        wm.image_url,
        wm.removed
      FROM watch_models wm
      JOIN brands b ON b.brand_id = wm.brand_id
      JOIN categories c ON c.category_id = wm.category_id
      JOIN mechanisms m ON m.mechanism_id = wm.mechanism_id
      ORDER BY wm.model_id
    `
  )

  return NextResponse.json(result.rows)
}
