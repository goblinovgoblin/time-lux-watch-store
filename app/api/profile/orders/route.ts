import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

type CustomerOrderRow = {
  order_id: string | number
  order_date: string
  order_status: string
  total_amount: string | number
  instance_id: string | number
  brand_name: string
  model_name: string
  reference_code: string
  serial_number: string
  item_price: string | number
  store_name: string
  city: string
  image_url: string | null
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('timelux_user_id')?.value

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const result = await query<CustomerOrderRow>(
      'SELECT * FROM get_customer_order_history($1);',
      [userId]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch customer order history', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer order history' },
      { status: 500 }
    )
  }
}
