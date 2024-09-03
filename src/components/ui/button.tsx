import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-gray00 text-lg font-bold rounded-[48px] ring-offset-white transition-colors focus-visible:outline-none  focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[rgba(253,173,50,0.8)] to-[rgba(241,135,251,0.8)] font-semibold backdrop-blur-sm transition-all duration-200 ease-out hover:bg-right",
        secondary:
          "font-semibold bg-gray400 hover:opacity-75 transition-all duration-200 ease-out",
        tertiary:
          "font-semibold border border-gray400 hover:bg-gray500 transition-all duration-200 ease-out",
        disabled: "font-semibold bg-gray400 text-gray200 cursor-not-allowed",
        ghost:
          "font-semibold hover:underline transition-all duration-300 ease-in-out hover:text-gray50",
      },
      size: {
        default: "h-10 px-5 py-3 text-md",
        sm: "h-8 px-4 py-2 text-sm",
        lg: "h-12 px-6 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
