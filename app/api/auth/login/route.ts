import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

type AuthUserRow = {
  user_id: string
  full_name: string
  email: string
  role_name: string
  password_hash: string | null
}

const demoPasswords: Record<string, string> = {
  'admin@timelux.ru': 'admin123',
  'user@timelux.ru': 'user123',
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await query<AuthUserRow>(
      `
        SELECT
          u.user_id,
          u.full_name,
          u.email,
          u.password_hash,
          r.role_name
        FROM users u
        JOIN roles r ON r.role_id = u.role_id
        WHERE LOWER(u.email) = LOWER($1)
          AND u.removed = false
          AND r.removed = false
        LIMIT 1
      `,
      [email]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const expectedDemoPassword = demoPasswords[email]
    const isPasswordValid = expectedDemoPassword
      ? password === expectedDemoPassword
      : password === user.password_hash

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('timelux_user_id', user.user_id, cookieOptions)
    cookieStore.set('timelux_role_name', user.role_name, cookieOptions)

    return NextResponse.json({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role_name: user.role_name,
    })
  } catch (error) {
    console.error('Failed to login', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
