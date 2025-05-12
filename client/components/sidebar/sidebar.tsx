"use client";
import clsx from "@/features/clsx";
import {useState} from "react";
import {Aside} from "./aside";


const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    return (
        <aside
            className={clsx(
                "bg-surface-200 h-screen transition-all duration-300 overflow-hidden border-r-2 border-border-medium scroll-smooth",
                isSidebarOpen ? "w-1/6" : "w-14"
            )}
        >
            <Aside
                isSidebarOpen={isSidebarOpen}
                onToggle={toggleSidebar}
            />
        </aside>
    );
};

export {Sidebar};
