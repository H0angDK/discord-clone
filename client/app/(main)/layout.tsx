import {Sidebar} from "@/components/sidebar/sidebar";
import {ReactNode} from "react";

interface LayoutProps {
    children: ReactNode;
}

export default async function Layout({children}: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-surface-100 text-text-primary">
            <Sidebar/>
            <main className="flex-1 h-screen">{children}</main>
        </div>
    );
}

