"use client";
import clsx from "@/features/clsx";
import Link, {LinkProps} from "next/link";
import {usePathname} from "next/navigation";
import {ReactNode} from "react";


interface NavLinkProps extends LinkProps {
    className?: string | ((props: { isActive: boolean }) => string);
    activeClassName?: string;
    children?: ReactNode;
}

export const NavLink = ({
                            className = "",
                            children,
                            activeClassName = "font-bold",
                            ...rest
                        }: NavLinkProps) => {
    const pathname = usePathname();

    const isActive = pathname === rest.href;
    return (
        <Link
            {...rest}
            className={clsx(
                "text-primary transition-colors duration-200",
                typeof className === "function" ? className({isActive}) : className,
                isActive && activeClassName
            )}
        >
            {children}
        </Link>
    );
};
