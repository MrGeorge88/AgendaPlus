import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

const notificationVariants = cva(
  "fixed flex w-full max-w-sm items-center rounded-lg border p-4 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-900 border-slate-200",
        success: "bg-green-50 text-green-900 border-green-200",
        error: "bg-red-50 text-red-900 border-red-200",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
        info: "bg-blue-50 text-blue-900 border-blue-200",
      },
      position: {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "top-right",
    },
  }
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export function Notification({
  className,
  variant,
  position,
  title,
  description,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  ...props
}: NotificationProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const IconComponent = React.useMemo(() => {
    switch (variant) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
      default:
        return Info;
    }
  }, [variant]);

  if (!isMounted) return null;

  return createPortal(
    <div
      className={cn(notificationVariants({ variant, position }), className)}
      {...props}
    >
      <div className="flex-shrink-0 mr-3">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-medium">{title}</h4>}
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 rounded-full p-1 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>,
    document.body
  );
}

// Contexto para el sistema de notificaciones
type NotificationType = {
  id: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  autoClose?: boolean;
  autoCloseTime?: number;
};

type NotificationContextType = {
  notifications: NotificationType[];
  showNotification: (notification: Omit<NotificationType, "id">) => void;
  hideNotification: (id: string) => void;
};

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationType[]>([]);

  const showNotification = React.useCallback((notification: Omit<NotificationType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const hideNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({
      notifications,
      showNotification,
      hideNotification,
    }),
    [notifications, showNotification, hideNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          variant={notification.variant}
          title={notification.title}
          description={notification.description}
          position={notification.position}
          autoClose={notification.autoClose}
          autoCloseTime={notification.autoCloseTime}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
