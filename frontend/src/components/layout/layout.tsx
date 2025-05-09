import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import "./layout.css";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar el sidebar cuando se hace clic fuera de él en dispositivos móviles
  const handleMainContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} />
      <div
        className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}
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
