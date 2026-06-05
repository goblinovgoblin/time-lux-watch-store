import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

type AuthUserRow = {
  user_id: string
  full_name: string
  email: string
  role_name: string
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
    const result = await query<AuthUserRow>(
      `
        SELECT
          u.user_id,
          u.full_name,
          u.email,
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

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role_name: user.role_name,
    })
  } catch (error) {
    console.error('Failed to get current user', error)
    return NextResponse.json(
      { error: 'Failed to get current user' },
      { status: 500 }
    )
  }
}
