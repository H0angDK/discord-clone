import type {InputHTMLAttributes, ReactNode, Ref,} from "react";
import clsx from "@/features/clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
    error?: string | string[] | ReactNode;
    errorClassName?: string;
    icon?: ReactNode;
    inputClassName?: string;
    label?: string;
    labelClassName?: string;
    ref?: Ref<HTMLInputElement>;
    variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const Input = ({
                          label,
                          error,
                          variant = "primary",
                          containerClassName = "",
                          labelClassName = "",
                          inputClassName = "",
                          errorClassName = "",
                          icon,
                          ref,
                          ...props
                      }: InputProps) => {
    const variantStyles = {
        primary: `
        bg-surface-100 text-text-primary border border-border-medium
        focus:ring-2 focus:ring-primary-focus focus:border-primary
      `,
        secondary: `
        bg-surface-200 text-text-primary border border-border-medium
        focus:ring-2 focus:ring-secondary focus:border-secondary
      `,
        outline: `
        bg-transparent text-text-primary border-2 border-border-medium
        focus:ring-2 focus:ring-primary-focus focus:border-primary
      `,
        ghost: `
        bg-transparent text-text-primary border-none
        focus:ring-2 focus:ring-primary-focus
      `,
    }[variant];

    return (
        <div className={`flex flex-col space-y-1 ${containerClassName}`}>
            {label && (
                <label
                    className={`text-sm font-medium text-text-primary ${labelClassName}`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}

                <input
                    ref={ref}
                    className={clsx(
                        "w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "focus:outline-none disabled:bg-surface-200 disabled:text-text-disabled",
                        variantStyles,
                        inputClassName,
                        icon && "pl-9",
                        error && "border-error"
                    )}
                    {...props}
                />
            </div>

            {error && (
                <div className={clsx("text-sm text-error", errorClassName)}>
                    {error}
                </div>
            )}
        </div>
    );
};
