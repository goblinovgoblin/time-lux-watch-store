import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

type RoleRow = {
  role_id: string
  role_name: string
}

type RegisteredUserRow = {
  user_id: string
  full_name: string
  email: string
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
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const confirmPassword = typeof body.confirmPassword === 'string' ? body.confirmPassword : ''

    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUser = await query(
      `
        SELECT user_id
        FROM users
        WHERE LOWER(email) = LOWER($1)
          AND removed = false
        LIMIT 1
      `,
      [email]
    )

    if (existingUser.rows[0]) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      )
    }

    const roleResult = await query<RoleRow>(
      `
        SELECT role_id, role_name
        FROM roles
        WHERE role_name = $1
          AND removed = false
        LIMIT 1
      `,
      ['CUSTOMER']
    )
    const customerRole = roleResult.rows[0]

    if (!customerRole) {
      return NextResponse.json(
        { error: 'Customer role not found' },
        { status: 500 }
      )
    }

    const userResult = await query<RegisteredUserRow>(
      `
        INSERT INTO users (role_id, full_name, email, password_hash, removed)
        VALUES ($1, $2, $3, $4, false)
        RETURNING user_id, full_name, email
      `,
      [customerRole.role_id, fullName, email, password]
    )
    const user = userResult.rows[0]

    const cookieStore = await cookies()
    cookieStore.set('timelux_user_id', user.user_id, cookieOptions)
    cookieStore.set('timelux_role_name', customerRole.role_name, cookieOptions)

    return NextResponse.json({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role_name: customerRole.role_name,
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to register', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}
