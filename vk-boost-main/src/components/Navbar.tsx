import { motion } from "framer-motion";
import { Zap, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const { user, profile, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">VKBoost</span>
        </div>

        <div className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Услуги</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Цены</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-all"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <span className="text-sm font-medium hidden sm:block">
                {profile?.full_name?.split(" ")[0] ?? "Профиль"}
              </span>
            </button>
            <button
              onClick={handleSignOut}
              title="Выйти"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-200 hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] active:scale-[0.97]"
          >
            Войти
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
