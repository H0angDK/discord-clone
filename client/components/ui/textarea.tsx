"use client";
import {Ref, TextareaHTMLAttributes, useEffect, useRef,} from "react";
import clsx from "@/features/clsx";

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    ref?: Ref<HTMLTextAreaElement>;
}

export const Textarea = ({
                             variant = "primary",
                             ref,
                             ...props
                         }: TextareaProps) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const combinedRef = (...refs: (Ref<HTMLTextAreaElement> | undefined)[]) => {
        return (ref: HTMLTextAreaElement) => {
            refs.forEach((inputRef) => {
                if (!inputRef) {
                    return;
                }

                if (typeof inputRef === "function") {
                    inputRef(ref);
                } else {
                    inputRef.current = ref;
                }
            });
        };
    };

    const MAX_HEIGHT = 200;

    const variantStyles = {
        primary: `bg-surface-400 text-text-primary border border-border-medium
                focus:ring-2 focus:ring-primary-focus focus:border-primary`,
        secondary: `bg-surface-400 text-text-primary border border-border-medium
                  focus:ring-2 focus:ring-secondary focus:border-secondary`,
        outline: `bg-transparent text-text-primary border-2 border-border-medium
                focus:ring-2 focus:ring-primary-focus focus:border-primary`,
        ghost: `bg-transparent text-text-primary border-none
              focus:ring-2 focus:ring-primary-focus`,
    }[variant];

    const adjustHeight = () => {
        if (internalRef.current) {
            internalRef.current.style.height = "auto";
            const newHeight = internalRef.current.scrollHeight;
            if (newHeight > MAX_HEIGHT) {
                internalRef.current.style.height = `${MAX_HEIGHT}px`;
                internalRef.current.style.overflowY = "auto";
            } else {
                internalRef.current.style.height = `${newHeight}px`;
                internalRef.current.style.overflowY = "hidden";
            }
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [props.value]);

    return (
        <textarea
            ref={combinedRef(ref, internalRef)}
            onInput={adjustHeight}
            {...props}
            className={clsx(
                "w-full px-3 py-1 rounded-sm transition-all duration-200",
                "focus:outline-none disabled:bg-surface-200 disabled:text-text-disabled",
                "resize-none overflow-y-hidden",
                variantStyles,
                props.className
            )}
        />
    );
};
