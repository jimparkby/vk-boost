import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="relative py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center card-shine rounded-3xl p-12 sm:p-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ textWrap: 'balance' }}>
            Готовы вырастить аудиторию?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Начните прямо сейчас и увидите первые результаты уже через час
          </p>
          <button className="group px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.5)] active:scale-[0.97]">
            Создать заказ
            <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
