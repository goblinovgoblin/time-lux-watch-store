'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, User, Watch } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const isAdmin = user?.role_name === 'ADMIN'

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Watch className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-semibold tracking-tight">TimeLux</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Каталог
          </Link>
          {user && (
            <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Профиль
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Админка
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Админ-панель
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link href="/register" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Регистрация
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Войти
                </Button>
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/catalog" onClick={() => setOpen(false)} className="text-lg font-medium">
                Каталог
              </Link>
              {user && (
                <Link href="/profile" onClick={() => setOpen(false)} className="text-lg font-medium">
                  Профиль
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="text-lg font-medium">
                  Админка
                </Link>
              )}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full mb-2">
                          Админ-панель
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      Выйти
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Регистрация
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="h-4 w-4" />
                        Войти
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
