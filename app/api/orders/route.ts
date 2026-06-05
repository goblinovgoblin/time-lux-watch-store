import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

type AuthUserRow = {
  user_id: string
  role_name: string
}

type CreateOrderRow = {
  order_id: string | number
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Не удалось оформить заказ'
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('timelux_user_id')?.value

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Войдите, чтобы оформить заказ' },
      { status: 401 }
    )
  }

  let body: { instanceId?: unknown }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', message: 'Некорректные данные заказа' },
      { status: 400 }
    )
  }

  const instanceId = Number(body.instanceId)

  if (!Number.isInteger(instanceId) || instanceId <= 0) {
    return NextResponse.json(
      { error: 'Invalid instanceId', message: 'Некорректный идентификатор часов' },
      { status: 400 }
    )
  }

  try {
    const userResult = await query<AuthUserRow>(
      `
        SELECT
          u.user_id,
          r.role_name
        FROM users u
        JOIN roles r ON r.role_id = u.role_id
        WHERE u.user_id = $1
          AND u.removed = false
          AND r.removed = false
        LIMIT 1
      `,
      [userId]
    )

    const user = userResult.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Войдите, чтобы оформить заказ' },
        { status: 401 }
      )
    }

    const roleName = user.role_name.toUpperCase()

    if (roleName !== 'CUSTOMER' && roleName !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'У вас нет прав для оформления заказа' },
        { status: 403 }
      )
    }

    const orderResult = await query<CreateOrderRow>(
      'SELECT create_customer_order($1, $2) AS order_id;',
      [user.user_id, instanceId]
    )

    return NextResponse.json({
      success: true,
      order_id: orderResult.rows[0]?.order_id,
    })
  } catch (error) {
    console.error('Failed to create order', error)
    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: getErrorMessage(error),
      },
      { status: 400 }
    )
  }
}
