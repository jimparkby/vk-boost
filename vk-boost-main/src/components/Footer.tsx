import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary" />
          </div>
          <span className="font-semibold text-sm">VKBoost</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 VKBoost. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
