import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Shield, Clock, BarChart3, Zap, Loader2, X, ArrowRight, Link } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { createPayment } from "@/lib/payment";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Users, title: "Рост аудитории", desc: "Ваше сообщество получает новых участников естественным образом — без резких скачков, которые настораживают алгоритмы." },
  { icon: TrendingUp, title: "Вовлечённость", desc: "Лайки, репосты и просмотры увеличивают охват постов — алгоритм ВК начинает продвигать контент шире." },
  { icon: Zap, title: "Социальное доказательство", desc: "Сообщество с активной аудиторией привлекает новых реальных подписчиков. Люди доверяют популярным страницам." },
  { icon: Shield, title: "Безопасно для страницы", desc: "Плавный прирост имитирует органический рост. Мы соблюдаем лимиты платформы — риски минимальны." },
  { icon: Clock, title: "Быстрый старт", desc: "Заказ оформляется за 2 минуты. Первые результаты видны уже через несколько часов." },
  { icon: BarChart3, title: "Прозрачная аналитика", desc: "Личный кабинет с историей заказов, статусами выполнения и статистикой по каждой кампании." },
];

const SERVICES = [
  {
    emoji: "👥",
    name: "Подписчики",
    desc: "На сообщество ВКонтакте",
    tag: "Популярно",
    tagColor: "text-blue-400 bg-blue-400/10",
    jap_service_id: 278,
    pricePerK: 0.825,
    min: 100,
    max: 10000,
    step: 100,
    defaultQty: 500,
    linkPlaceholder: "https://vk.com/your_group",
    linkHint: "Ссылка на сообщество или страницу",
  },
  {
    emoji: "❤️",
    name: "Лайки",
    desc: "На посты и фотографии",
    tag: "Быстро",
    tagColor: "text-green-400 bg-green-400/10",
    jap_service_id: 3756,
    pricePerK: 2.2278,
    min: 50,
    max: 5000,
    step: 50,
    defaultQty: 200,
    linkPlaceholder: "https://vk.com/wall-123456_789",
    linkHint: "Ссылка на пост или фото",
  },
  {
    emoji: "👁",
    name: "Просмотры",
    desc: "Видео, клипы и посты",
    tag: "Дёшево",
    tagColor: "text-amber-400 bg-amber-400/10",
    jap_service_id: 3762,
    pricePerK: 0.0313,
    min: 500,
    max: 50000,
    step: 500,
    defaultQty: 5000,
    linkPlaceholder: "https://vk.com/video-123456_789",
    linkHint: "Ссылка на видео или пост",
  },
  {
    emoji: "🎵",
    name: "Прослушивания",
    desc: "Плейлисты и аудиозаписи",
    tag: "Новинка",
    tagColor: "text-purple-400 bg-purple-400/10",
    jap_service_id: 3765,
    pricePerK: 0.0313,
    min: 500,
    max: 50000,
    step: 500,
    defaultQty: 5000,
    linkPlaceholder: "https://vk.com/music/playlist/-123456_1",
    linkHint: "Ссылка на плейлист или трек",
  },
];

// Модальное окно заказа
function OrderModal({ service, onClose }: { service: typeof SERVICES[0], onClose: () => void }) {
  const [qty, setQty] = useState(service.defaultQty);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, session } = useAuthContext();
  const navigate = useNavigate();

  const priceUSDT = (service.pricePerK / 1000) * qty * 1.5;
  const priceRub = Math.round(priceUSDT * 90);

  const handlePay = async () => {
    if (!link.trim()) { setError("Введите ссылку ВКонтакте"); return; }
    if (!link.includes("vk.com")) { setError("Ссылка должна быть с vk.com"); return; }
    if (!user || !session) { navigate("/auth"); return; }

    setError("");
    setLoading(true);
    try {
      const { pay_url, order_id } = await createPayment({
        name: `${service.name} × ${qty.toLocaleString()}`,
        amount: qty,
        price: parseFloat(priceUSDT.toFixed(4)),
        currency: "USDT",
        jap_service_id: service.jap_service_id,
        vk_link: link.trim(),
        quantity: qty,
      }, session.access_token);

      localStorage.setItem("pending_order_id", order_id);
      // Идём на страницу оплаты — там уже готовый счёт
      navigate(`/order?order_id=${order_id}&pay_url=${encodeURIComponent(pay_url)}`);
    } catch (e: any) {
      setError(e.message ?? "Ошибка создания заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "hsl(240 12% 8%)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.emoji}</span>
            <div>
              <h3 className="font-bold text-base">{service.name}</h3>
              <p className="text-xs text-muted-foreground">{service.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Ссылка */}
          <div>
            <label className="text-sm font-medium block mb-2 flex items-center gap-2">
              <Link className="w-3.5 h-3.5 text-primary" />
              Ссылка ВКонтакте
            </label>
            <input
              type="url"
              value={link}
              onChange={e => { setLink(e.target.value); setError(""); }}
              placeholder={service.linkPlaceholder}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none text-foreground placeholder-muted-foreground/50"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <p className="text-xs text-muted-foreground mt-1.5">{service.linkHint}</p>
          </div>

          {/* Количество */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Количество</label>
              <span className="text-sm font-bold text-primary">{qty.toLocaleString()} шт.</span>
            </div>
            <input
              type="range"
              min={service.min}
              max={service.max}
              step={service.step}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{service.min.toLocaleString()}</span>
              <span>{service.max.toLocaleString()}</span>
            </div>
          </div>

          {/* Итог */}
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "rgba(79,127,255,0.06)", border: "1px solid rgba(79,127,255,0.15)" }}>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Итого к оплате</p>
              <p className="text-2xl font-black">{priceRub.toLocaleString()} ₽</p>
              <p className="text-xs text-muted-foreground">≈ {priceUSDT.toFixed(4)} USDT</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Оплата криптой</p>
              <p>через @CryptoBot</p>
              <p className="text-green-400 mt-1">Старт сразу</p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 px-1">{error}</p>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 text-base"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Создаём счёт...</>
            ) : (
              <>Перейти к оплате <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center -mt-2">
            После оплаты заказ запустится автоматически
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(service.defaultQty);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const priceUSDT = (service.pricePerK / 1000) * qty * 1.5;
  const priceRub = Math.round(priceUSDT * 90);

  const handleClick = () => {
    if (!user) { navigate("/auth"); return; }
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card-shine rounded-2xl p-5 flex flex-col gap-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.emoji}</span>
            <div>
              <h3 className="font-bold text-base">{service.name}</h3>
              <p className="text-xs text-muted-foreground">{service.desc}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${service.tagColor}`}>
            {service.tag}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Количество</span>
            <span className="text-sm font-bold">{qty.toLocaleString()} шт.</span>
          </div>
          <input
            type="range"
            min={service.min}
            max={service.max}
            step={service.step}
            value={qty}
            onChange={e => setQty(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div>
            <p className="text-lg font-black">{priceRub.toLocaleString()} ₽</p>
            <p className="text-xs text-muted-foreground">≈ {priceUSDT.toFixed(4)} USDT</p>
          </div>
          <button
            onClick={handleClick}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {user ? "Купить" : "Войти и купить"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <OrderModal service={service} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}

const FeaturesSection = () => {
  return (
    <>
      <section id="services" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Выберите услугу</h2>
            <p className="text-muted-foreground text-lg">Укажите количество и ссылку — заказ запустится сразу после оплаты</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(s => <ServiceCard key={s.name} service={s} />)}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Почему выбирают VKBoost</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Инструменты для роста, которые работают в 2026 году</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="card-shine rounded-2xl p-6 transition-all duration-300 hover:border-primary/20 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
