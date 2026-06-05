'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/data'
import type { CustomerOrderHistoryRow } from '@/lib/api'
import { getCustomerOrders } from '@/lib/api'

type GroupedOrder = {
  order_id: string | number
  order_date: string
  order_status: string
  total_amount: string | number
  items: CustomerOrderHistoryRow[]
}

function groupOrders(rows: CustomerOrderHistoryRow[]) {
  const orders = new Map<string, GroupedOrder>()

  for (const row of rows) {
    const key = String(row.order_id)
    const existingOrder = orders.get(key)

    if (existingOrder) {
      existingOrder.items.push(row)
      continue
    }

    orders.set(key, {
      order_id: row.order_id,
      order_date: row.order_date,
      order_status: row.order_status,
      total_amount: row.total_amount,
      items: [row],
    })
  }

  return Array.from(orders.values())
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<CustomerOrderHistoryRow[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      if (!user) {
        return
      }

      setIsOrdersLoading(true)
      setOrdersError('')

      try {
        const customerOrders = await getCustomerOrders()

        if (isMounted) {
          setOrders(customerOrders)
        }
      } catch {
        if (isMounted) {
          setOrders([])
          setOrdersError('Не удалось загрузить историю заказов')
        }
      } finally {
        if (isMounted) {
          setIsOrdersLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [user])

  const groupedOrders = useMemo(() => groupOrders(orders), [orders])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Профиль
            </h1>
            <p className="text-muted-foreground">
              Данные текущей учебной сессии TimeLux
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">
                  {user.full_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Роль</p>
                  <Badge variant="secondary">{user.role_name}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{user.user_id}</p>
                </div>
              </CardContent>
            </Card>

            <section>
              <div className="mb-4">
                <h2 className="font-heading text-2xl font-bold">История заказов</h2>
              </div>

              {ordersError && (
                <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {ordersError}
                </div>
              )}

              {isOrdersLoading ? (
                <div className="rounded-lg border border-border/50 p-8 text-center text-muted-foreground">
                  Загрузка заказов...
                </div>
              ) : groupedOrders.length === 0 ? (
                <div className="rounded-lg border border-border/50 p-8 text-center text-muted-foreground">
                  У вас пока нет заказов
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedOrders.map(order => (
                    <Card key={String(order.order_id)}>
                      <CardHeader>
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <CardTitle className="font-heading text-xl">
                              Заказ #{order.order_id}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.order_date)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary">{order.order_status}</Badge>
                            <p className="font-semibold">
                              {formatPrice(Number(order.total_amount))}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {order.items.map(item => (
                          <div
                            key={`${order.order_id}-${item.instance_id}`}
                            className="grid gap-4 rounded-lg border border-border/50 p-4 md:grid-cols-[120px_1fr]"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/30">
                              <Image
                                src={item.image_url || '/placeholder.svg'}
                                alt={`${item.brand_name} ${item.model_name}`}
                                fill
                                className="object-cover"
                                sizes="120px"
                              />
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="text-xs text-primary font-medium uppercase tracking-wider">
                                  {item.brand_name}
                                </p>
                                <h3 className="font-heading text-lg font-semibold">
                                  {item.model_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Ref. {item.reference_code}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Serial: {item.serial_number}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Цена</p>
                                  <p className="font-semibold">
                                    {formatPrice(Number(item.item_price))}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Магазин</p>
                                  <p className="font-medium">{item.store_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Город</p>
                                  <p className="font-medium">{item.city}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
