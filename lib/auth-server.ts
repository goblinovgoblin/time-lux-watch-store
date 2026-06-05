import 'server-only'

import { cookies } from 'next/headers'
import { query } from '@/lib/db'

export type ServerAuthUser = {
  user_id: string
  full_name: string
  email: string
  role_name: string
}

export type AuthError = {
  error: string
  status: 401 | 403
}

type AuthUserRow = ServerAuthUser

export async function getCurrentUser(): Promise<ServerAuthUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('timelux_user_id')?.value

  if (!userId) {
    return null
  }

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

  return result.rows[0] ?? null
}

export async function requireAdmin(): Promise<
  { user: ServerAuthUser; error?: never; status?: never } | AuthError
> {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: 'Unauthorized',
      status: 401,
    }
  }

  if (user.role_name.toUpperCase() !== 'ADMIN') {
    return {
      error: 'Forbidden',
      status: 403,
    }
  }

  return { user }
}
