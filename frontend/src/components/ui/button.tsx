import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Base classes for all buttons
    let buttonClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    // Add variant classes using Tailwind directly
    if (variant === 'default') {
      buttonClasses += " bg-indigo-600 text-white hover:bg-indigo-700";
    } else if (variant === 'secondary') {
      buttonClasses += " bg-pink-600 text-white hover:bg-pink-700";
    } else if (variant === 'destructive') {
      buttonClasses += " bg-red-600 text-white hover:bg-red-700";
    } else if (variant === 'outline') {
      buttonClasses += " border border-slate-300 bg-white hover:bg-slate-100 text-slate-900";
    } else if (variant === 'ghost') {
      buttonClasses += " hover:bg-slate-100 text-slate-900";
    } else if (variant === 'link') {
      buttonClasses += " text-indigo-600 underline-offset-4 hover:underline";
    }

    // Add size classes using Tailwind directly
    if (size === 'sm') {
      buttonClasses += " h-9 px-3 text-sm";
    } else if (size === 'lg') {
      buttonClasses += " h-11 px-8 text-lg";
    } else if (size === 'icon') {
      buttonClasses += " h-10 w-10 p-2";
    } else {
      // Default size
      buttonClasses += " h-10 px-4 py-2";
    }

    return (
      <Comp
        className={cn(buttonClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
