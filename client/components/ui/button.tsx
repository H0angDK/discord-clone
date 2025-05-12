import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import clsx from "@/features/clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "access" | "outline";
  children?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

export const Button = ({
  variant = "primary",
  children,
  size = "sm",
  className = "",
  ref,
  ...props
}: ButtonProps) => {
  const baseStyles = `
    font-sans font-medium rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none focus:shadow-outline;
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active
      focus:ring-primary-focus
    `,
    secondary: `
      bg-secondary text-surface-900 hover:bg-secondary/90 active:bg-secondary/80
      focus:ring-secondary/20
    `,
    access: `
      bg-accent text-text-inverse hover:bg-accent/90 active:bg-accent/80
      focus:ring-accent/20
    `,
    outline: `
      bg-transparent border-2 border-border-light text-text-primary
      hover:bg-surface-100 active:bg-surface-200 focus:ring-primary-focus
    `,
  }[variant];

  const sizeStyles = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
    xl: "px-6 py-3.5 text-xl",
  }[size];

  return (
    <button
      ref={ref}
      {...props}
      className={clsx(baseStyles, variantStyles, sizeStyles, className)}
    >
      {children}
    </button>
  );
};
