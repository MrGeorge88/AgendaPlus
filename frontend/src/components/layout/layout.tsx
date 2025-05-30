import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useIsMobile, useIsTouchDevice } from "../../hooks/use-media-query";
import "./layout.css";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();

  // Cerrar sidebar automáticamente cuando se cambia a desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Cerrar el sidebar cuando se hace clic fuera de él en dispositivos móviles
  const handleMainContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCollapseChange={setSidebarCollapsed}
      />
      <div
        className={`main-content ${sidebarOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
        onClick={handleMainContentClick}
      >
        <Topbar
          title={title}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
        <main>{children}</main>
      </div>
    </div>
  );
}
