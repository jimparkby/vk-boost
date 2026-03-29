import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, Loader2, ArrowRight, AlertCircle, ExternalLink, TrendingUp, Clock, Users } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { createPayment } from '@/lib/payment'

const SERVICES = [
  { id: 1, name: 'Подписчики ВКонтакте', jap_service_id: 278, min: 100, max: 10000, step: 100, pricePerK: 0.825, emoji: '👥' },
  { id: 2, name: 'Лайки на пост/фото', jap_service_id: 3756, min: 50, max: 5000, step: 50, pricePerK: 2.2278, emoji: '❤️' },
  { id: 3, name: 'Просмотры видео', jap_service_id: 3762, min: 500, max: 50000, step: 500, pricePerK: 0.0313, emoji: '👁' },
  { id: 4, name: 'Просмотры постов', jap_service_id: 3769, min: 500, max: 50000, step: 500, pricePerK: 0.0063, emoji: '📄' },
  { id: 5, name: 'Прослушивания плейлиста', jap_service_id: 3765, min: 500, max: 50000, step: 500, pricePerK: 0.0313, emoji: '🎵' },
]

export default function OrderPage() {
  const { user, session, loading: authLoading } = useAuthContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Получаем данные из URL (если пришли из карточки услуги)
  const urlPayUrl = searchParams.get('pay_url') ? decodeURIComponent(searchParams.get('pay_url')!) : ''
  const urlOrderId = searchParams.get('order_id') || localStorage.getItem('pending_order_id') || ''

  const [step, setStep] = useState<'form' | 'pay' | 'done'>(urlPayUrl ? 'pay' : 'form')
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [vkLink, setVkLink] = useState('')
  const [quantity, setQuantity] = useState(500)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [payUrl, setPayUrl] = useState(urlPayUrl)
  const [orderId, setOrderId] = useState(urlOrderId)

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth')
  }, [user, authLoading])

  useEffect(() => {
    const svc = searchParams.get('service')
    if (svc) {
      const found = SERVICES.find(s => s.jap_service_id === Number(svc))
      if (found) { setSelectedService(found); setQuantity(found.min) }
    }
  }, [])

  const priceUSDT = ((selectedService.pricePerK / 1000) * quantity * 1.5)
  const priceRub = Math.round(priceUSDT * 90)

  const handleCreateOrder = async () => {
    if (!vkLink.trim()) { setError('Введите ссылку ВКонтакте'); return }
    if (!vkLink.includes('vk.com')) { setError('Ссылка должна быть с vk.com'); return }
    if (!user || !session) { navigate('/auth'); return }

    setLoading(true)
    setError('')
    try {
      const { pay_url, order_id } = await createPayment({
        name: `${selectedService.name} × ${quantity.toLocaleString()}`,
        amount: quantity,
        price: parseFloat(priceUSDT.toFixed(4)),
        currency: 'USDT',
        jap_service_id: selectedService.jap_service_id,
        vk_link: vkLink.trim(),
        quantity,
      }, session.access_token)

      setPayUrl(pay_url)
      setOrderId(order_id)
      localStorage.setItem('pending_order_id', order_id)
      setStep('pay')
    } catch (e: any) {
      setError(e.message ?? 'Ошибка создания заказа')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )

  // Страница успеха
  if (step === 'done') return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Анимированная иконка */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Заказ запущен!</h1>
          <p className="text-muted-foreground text-sm">Оплата подтверждена — продвижение началось</p>
        </div>

        {/* Статус карточка */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-500">В процессе выполнения</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Статус</p>
                <p className="text-sm font-medium">Заказ передан в обработку</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Время выполнения</p>
                <p className="text-sm font-medium">Первые результаты через 1-3 часа</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Скорость</p>
                <p className="text-sm font-medium">До 2 000 в день — плавный прирост</p>
              </div>
            </div>
          </div>
        </div>

        {/* Подсказка */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-4 text-sm text-muted-foreground">
          💡 Не удаляйте и не закрывайте сообщество на время выполнения заказа
        </div>

        <button
          onClick={() => { localStorage.removeItem('pending_order_id'); navigate('/profile') }}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Следить за статусом в профиле
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  )

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
          <div className="flex items-center gap-2 text-sm">
            <span className={step === 'form' ? 'text-primary font-semibold' : 'text-muted-foreground'}>1. Настройка</span>
            <span className="text-muted-foreground">→</span>
            <span className={step === 'pay' ? 'text-primary font-semibold' : 'text-muted-foreground'}>2. Оплата</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* ШАГ 1: Форма */}
          {step === 'form' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold">Настройте заказ</h1>
                <p className="text-muted-foreground mt-1 text-sm">Выберите услугу, укажите ссылку — затем перейдёте к оплате</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-sm font-medium mb-3">Услуга</p>
                  <div className="flex flex-col gap-2">
                    {SERVICES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedService(s); setQuantity(s.min) }}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          selectedService.id === s.id ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/20'
                        }`}
                      >
                        <span className="text-xl">{s.emoji}</span>
                        <p className="text-sm font-medium flex-1">{s.name}</p>
                        {selectedService.id === s.id && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Количество</label>
                    <span className="text-sm font-bold text-primary">{quantity.toLocaleString()} шт.</span>
                  </div>
                  <input
                    type="range"
                    min={selectedService.min}
                    max={Math.min(selectedService.max, 10000)}
                    step={selectedService.step}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{selectedService.min.toLocaleString()}</span>
                    <span>{Math.min(selectedService.max, 10000).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <label className="text-sm font-medium block mb-2">Ссылка ВКонтакте</label>
                  <input
                    type="url"
                    value={vkLink}
                    onChange={e => setVkLink(e.target.value)}
                    placeholder="https://vk.com/your_group"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Ссылка на сообщество, пост или видео</p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">К оплате</p>
                    <p className="text-2xl font-black">{priceRub.toLocaleString()} ₽</p>
                    <p className="text-xs text-muted-foreground">≈ {priceUSDT.toFixed(4)} USDT</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{quantity.toLocaleString()} {selectedService.name.split(' ')[0].toLowerCase()}</p>
                    <p>через @CryptoBot</p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </div>
                )}

                <button
                  onClick={handleCreateOrder}
                  disabled={loading || !vkLink.trim()}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)] transition-all"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Создаём счёт...</> : <>Перейти к оплате <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </>
          )}

          {/* ШАГ 2: Оплата */}
          {step === 'pay' && (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Ожидаем оплату
                </div>
                <h1 className="text-2xl font-bold">Оплатите заказ</h1>
                <p className="text-muted-foreground mt-1 text-sm">Нажмите кнопку — откроется @CryptoBot. После оплаты заказ запустится автоматически.</p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={payUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Открыть @CryptoBot и оплатить
                </a>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">После оплаты в Telegram</p>
                      <p className="text-xs text-muted-foreground">Заказ запустится автоматически — не нужно ничего делать</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3 leading-relaxed">
                    1. Оплатите в @CryptoBot в Telegram<br/>
                    2. Система получит подтверждение автоматически<br/>
                    3. Нажмите кнопку ниже чтобы увидеть статус
                  </div>
                </div>

                <button
                  onClick={() => setStep('done')}
                  className="w-full py-3 rounded-xl border border-green-500/30 text-green-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-500/5 transition-colors"
                >
                  ✅ Я оплатил — перейти к результату
                </button>

                <button onClick={() => setStep('form')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
                  ← Изменить заказ
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
