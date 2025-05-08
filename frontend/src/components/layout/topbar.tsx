import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../contexts/auth-context";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageSwitcher } from "../ui/language-switcher";
import { useLanguage } from "../../contexts/language-context";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const [date, setDate] = useState(new Date());
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { language, t } = useLanguage();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTodayClick = () => {
    setDate(new Date());
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className="topbar">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm">{formatDate(date)}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleTodayClick}>
          {t('common.today')}
        </Button>
        <LanguageSwitcher variant="minimal" />
        <ThemeToggle />
        <div className="relative">
          <Avatar
            onClick={toggleUserMenu}
            className="cursor-pointer"
          >
            <AvatarImage src={user?.avatar_url || "https://github.com/shadcn.png"} alt="User" />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <p>{user?.name || t('common.user')}</p>
                <p>{user?.email}</p>
              </div>
              <button
                className="user-menu-item danger"
                onClick={handleSignOut}
              >
                <LogOut />
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
