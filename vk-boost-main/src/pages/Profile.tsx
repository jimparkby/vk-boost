import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, LogOut, User, Mail, Calendar, Shield, ShoppingBag, TrendingUp, Clock } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  service: string
  amount: number
  price: number
  currency: string
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  created_at: string
  paid_at: string | null
}

const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
  paid:      { text: 'Выполнен',  color: '#16a34a', bg: 'rgba(34,197,94,0.1)' },
  pending:   { text: 'Ожидает',   color: '#2563eb', bg: 'rgba(59,130,246,0.1)' },
  expired:   { text: 'Истёк',     color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  cancelled: { text: 'Отменён',   color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
}

export default function Profile() {
  const { user, profile, loading, session, signOut } = useAuthContext()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) navigate('/auth')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user || !session) return
    const fetchOrders = async () => {
      setOrdersLoading(true)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/orders?user_id=eq.${user.id}&order=created_at.desc`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            }
          }
        )
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (e) {
        console.error('Orders fetch error:', e)
      } finally {
        setOrdersLoading(false)
      }
    }
    fetchOrders()
  }, [user, session])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? 'Пользователь'
  const displayEmail = profile?.email ?? user?.email ?? ''
  const displayAvatar = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const totalSpent = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + Number(o.price), 0)
  const activeOrders = orders.filter(o => o.status === 'pending').length

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">VKBoost</span>
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-5">
              {displayAvatar ? (
                <img src={displayAvatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">{displayName}</h1>
                <p className="text-muted-foreground text-sm mt-0.5 truncate">{displayEmail}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-500 font-medium">Активен</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <ShoppingBag className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
              <div className="text-xl font-bold">{orders.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Заказов</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
              <div className="text-xl font-bold">{totalSpent.toFixed(2)} $</div>
              <div className="text-xs text-muted-foreground mt-0.5">Потрачено</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
              <div className="text-xl font-bold">{activeOrders}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Активных</div>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Email</span>
              </div>
              <p className="text-sm font-medium truncate">{displayEmail}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Регистрация</span>
              </div>
              <p className="text-sm font-medium">{joinedDate}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Имя</span>
              </div>
              <p className="text-sm font-medium truncate">{displayName}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Вход через</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <p className="text-sm font-medium">Google</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-base">История заказов</h2>
              <span className="text-xs text-muted-foreground">{orders.length} заказов</span>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 px-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7 text-primary opacity-60" />
                </div>
                <p className="font-semibold text-base mb-1">Заказов пока нет</p>
                <p className="text-sm text-muted-foreground mb-5">
                  Выберите тариф и начните продвижение своего сообщества прямо сейчас
                </p>
                <a
                  href="/#pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all"
                >
                  Перейти к тарифам →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => {
                  const s = statusLabel[order.status] ?? statusLabel.pending
                  const date = new Date(order.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })
                  return (
                    <div key={order.id} className="px-5 py-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{order.service}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {date} · {order.amount.toLocaleString()} ед.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ color: s.color, background: s.bg }}
                        >
                          {s.text}
                        </span>
                        <span className="text-sm font-semibold">{order.price} {order.currency}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Новый заказ</p>
              <p className="text-xs text-muted-foreground mt-0.5">Выбери тариф и начни продвижение</p>
            </div>
            <a
              href="/#pricing"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all"
            >
              Тарифы
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
