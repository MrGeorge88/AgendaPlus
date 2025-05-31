import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, Briefcase, CreditCard, BarChart3, DollarSign, X, TrendingUp, ChevronLeft, ChevronRight, Menu, MessageCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../lib/translations";
import { useIsMobile, useIsTouchDevice } from "../../hooks/use-media-query";
import { useEffect, useRef, useState } from "react";

// Navigation items with translation keys
const navItems = [
  { key: "navigation.agenda", path: "/agenda", icon: Calendar },
  { key: "navigation.overview", path: "/dashboard", icon: BarChart3 },
  { key: "navigation.analytics", path: "/analytics", icon: TrendingUp },
  { key: "navigation.clients", path: "/clients", icon: Users },
  { key: "navigation.services", path: "/services", icon: Briefcase },
  { key: "navigation.staff", path: "/staff", icon: Users },
  { key: "navigation.income", path: "/income", icon: BarChart3 },
  { key: "navigation.expenses", path: "/expenses", icon: DollarSign },
  { key: "navigation.whatsapp", path: "/whatsapp", icon: MessageCircle },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isOpen = false, onClose, onCollapseChange }: SidebarProps) {
  const location = useLocation();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);


  // Traducciones manuales para evitar problemas con i18n
  const translations = {
    'navigation.agenda': language === 'es' ? 'Agenda' : 'Calendar',
    'navigation.overview': language === 'es' ? 'Resumen' : 'Overview',
    'navigation.analytics': language === 'es' ? 'Analytics' : 'Analytics',
    'navigation.clients': language === 'es' ? 'Clientes' : 'Clients',
    'navigation.services': language === 'es' ? 'Servicios' : 'Services',
    'navigation.staff': language === 'es' ? 'Personal' : 'Staff',
    'navigation.income': language === 'es' ? 'Ingresos' : 'Income',
    'navigation.expenses': language === 'es' ? 'Gastos' : 'Expenses',
    'navigation.whatsapp': language === 'es' ? 'WhatsApp' : 'WhatsApp',
  };

  // Manejar gestos de swipe en dispositivos táctiles
  useEffect(() => {
    if (!isTouch || !sidebarRef.current) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;

      // Si está abierto y se desliza hacia la izquierda, cerrar
      if (isOpen && deltaX < -50) {
        onClose?.();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const sidebar = sidebarRef.current;
    sidebar.addEventListener('touchstart', handleTouchStart);
    sidebar.addEventListener('touchmove', handleTouchMove);
    sidebar.addEventListener('touchend', handleTouchEnd);

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouch, isOpen, onClose]);

  // Cerrar sidebar al hacer clic en un enlace en móvil
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Manejar colapso del sidebar
  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };



  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          'sidebar',
          isOpen && 'open',
          isMobile && 'mobile',
          isTouch && 'touch-enabled',
          isCollapsed && 'collapsed'
        )}
      >
        <div className="sidebar-header">
          <Link to="/agenda" onClick={handleLinkClick}>
            <span className={cn(
              "text-xl font-bold text-primary transition-opacity",
              isCollapsed && "opacity-0"
            )}>
              AgendaPlus
            </span>
          </Link>

          {/* Botón de colapsar/expandir para desktop */}
          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-md hover:bg-slate-100 transition-colors"
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          )}

          {/* Botón de cerrar para móvil */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav>
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const itemName = translations[item.key];

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'sidebar-link',
                      isActive && 'active',
                      isTouch && 'touch-friendly'
                    )}
                    onClick={handleLinkClick}
                  >
                    <Icon />
                    {!isCollapsed && <span>{itemName}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!isCollapsed && (
          <div className="mt-auto p-4">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
              <div>
                <p className="font-medium">AgendaPlus</p>
                <p className="mt-1 text-xs opacity-80">v1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
