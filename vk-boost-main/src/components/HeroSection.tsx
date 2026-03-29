import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Heart, Eye, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  { icon: Users, label: "Подписчики", from: "от 150 ₽" },
  { icon: Heart, label: "Лайки", from: "от 60 ₽" },
  { icon: Eye, label: "Просмотры", from: "от 30 ₽" },
  { icon: Music, label: "Прослушивания", from: "от 30 ₽" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/8 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
        >
          <Zap className="w-3.5 h-3.5" />
          Сервис #1 для продвижения ВКонтакте
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6"
          style={{ textWrap: 'balance' }}
        >
          Быстрый рост
          <br />
          <span className="text-gradient">вашего ВКонтакте</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Подписчики, лайки, просмотры — быстро и безопасно.
          Оплата криптовалютой, результат уже через несколько часов.
        </motion.p>

        {/* Карточки услуг */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10"
        >
          {services.map((s, i) => (
            <motion.a
              key={s.label}
              href="#services"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.07 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-4.5 h-4.5 text-primary" style={{width:18,height:18}} />
              </div>
              <div>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-xs text-primary font-medium">{s.from}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#services"
            className="group relative px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base transition-all duration-200 hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.5)] active:scale-[0.97] flex items-center gap-2"
          >
            Выбрать услугу
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <button
            onClick={() => navigate("/auth")}
            className="px-8 py-3.5 rounded-xl border border-border text-foreground font-medium text-base transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
          >
            Войти в кабинет
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-border/50"
        >
          {[
            { value: '2.4М+', label: 'Подписчиков доставлено' },
            { value: '12K+', label: 'Довольных клиентов' },
            { value: '99.3%', label: 'Удержание аудитории' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
