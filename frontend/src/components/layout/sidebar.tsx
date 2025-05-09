import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, Briefcase, CreditCard, BarChart3 } from "lucide-react";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import { useLanguage } from "../../contexts/language-context";

// Navigation items with translation keys
const navItems = [
  { key: "navigation.dashboard", path: "/dashboard", icon: Calendar },
  { key: "navigation.clients", path: "/clients", icon: Users },
  { key: "navigation.services", path: "/services", icon: Briefcase },
  { key: "navigation.staff", path: "/staff", icon: Users },
  { key: "navigation.income", path: "/income", icon: BarChart3 },
];

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = false }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard">
          <span className="text-xl font-bold text-primary">{t('common.appName')}</span>
        </Link>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const itemName = item.suffix ? t(item.key) + item.suffix : t(item.key);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon />
                  <span>{itemName}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto p-4">
        <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          <div>
            <p className="font-medium">{t('common.appName')}</p>
            <p className="mt-1 text-xs opacity-80">v1.0.0</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
