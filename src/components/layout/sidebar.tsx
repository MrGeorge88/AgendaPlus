import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, Briefcase, CreditCard, BarChart3 } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Agenda", path: "/dashboard", icon: Calendar },
  { name: "Clientes", path: "/clients", icon: Users },
  { name: "Servicios", path: "/services", icon: Briefcase },
  { name: "Profesionales", path: "/staff", icon: Users },
  { name: "Ingresos", path: "/income", icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-white shadow-soft md:w-64">
      <div className="flex h-16 items-center justify-center border-b">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-primary md:text-2xl">AgendaPlus</span>
        </Link>
      </div>
      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-2xl p-2 transition-all duration-150 ease-in",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
