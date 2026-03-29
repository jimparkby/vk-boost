import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { createPayment } from "@/lib/payment";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Старт",
    price: 490,
    priceUSDT: "5.50",
    period: "за заказ",
    desc: "Идеально для первого теста",
    features: ["До 500 подписчиков", "Плавная накрутка за 24ч", "Базовая поддержка", "Гарантия от списаний"],
    highlighted: false,
    amount: 500,
    jap_service_id: 278,
  },
  {
    name: "Про",
    price: 1490,
    priceUSDT: "16.50",
    period: "за заказ",
    desc: "Для серьёзного продвижения",
    features: ["До 3 000 подписчиков", "Активность в чатах", "Лайки + комментарии", "Приоритетная поддержка", "Панель аналитики"],
    highlighted: true,
    amount: 3000,
    jap_service_id: 278,
  },
  {
    name: "Бизнес",
    price: 4990,
    priceUSDT: "55.00",
    period: "в месяц",
    desc: "Полный комплекс услуг",
    features: ["Безлимит подписчиков", "Все виды активности", "Персональный менеджер", "API доступ", "Отчёты и аналитика"],
    highlighted: false,
    amount: 99999,
    jap_service_id: 278,
  },
];

const PricingSection = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user, session } = useAuthContext();
  const navigate = useNavigate();

  const handlePay = async (plan: typeof plans[0]) => {
    if (!user || !session) { navigate("/auth"); return; }

    setLoadingPlan(plan.name);
    try {
      const { pay_url, order_id } = await createPayment({
        name: `Тариф ${plan.name}`,
        amount: plan.amount,
        price: parseFloat(plan.priceUSDT),
        currency: "USDT",
        jap_service_id: plan.jap_service_id,
      }, session.access_token);

      // Сохраняем order_id и редиректим на оплату
      localStorage.setItem('pending_order_id', order_id);
      window.location.href = pay_url;
    } catch (err) {
      alert("Ошибка создания платежа. Попробуйте позже.");
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="relative py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Простые и честные цены</h2>
          <p className="text-muted-foreground text-lg">Оплата криптовалютой — быстро и анонимно</p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm text-primary font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            Принимаем USDT, TON, BTC, ETH и другие
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl p-6 flex flex-col ${plan.highlighted ? "bg-primary/5 border-2 border-primary/30 glow-box" : "card-shine"}`}
            >
              {plan.highlighted && <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">⭐ Популярный</div>}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-black tracking-tight">{plan.price.toLocaleString()}₽</span>
                <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
              </div>
              <div className="text-sm text-muted-foreground mb-6">≈ <span className="text-foreground font-medium">{plan.priceUSDT} USDT</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-secondary-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePay(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {loadingPlan === plan.name ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Создаём счёт...</>
                ) : (
                  <>{user ? "Оплатить криптой" : "Войти и оплатить"}</>
                )}
              </button>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          Оплата через @CryptoBot — безопасно и мгновенно. После оплаты заказ активируется автоматически.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
