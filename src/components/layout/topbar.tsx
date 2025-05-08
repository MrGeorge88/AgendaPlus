import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../contexts/auth-context";
import { LogOut } from "lucide-react";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const [date, setDate] = useState(new Date());
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
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
    <div className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
        <p className="text-sm text-slate-500">{formatDate(date)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={handleTodayClick}>
          Hoy
        </Button>
        <div className="relative">
          <Avatar className="cursor-pointer" onClick={toggleUserMenu}>
            <AvatarImage src={user?.avatar_url || "https://github.com/shadcn.png"} alt="User" />
            <AvatarFallback>{user?.name?.substring(0, 2) || "US"}</AvatarFallback>
          </Avatar>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="border-b px-4 py-2">
                <p className="font-medium">{user?.name || "Usuario"}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
