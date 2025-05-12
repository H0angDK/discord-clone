import Header from "@/components/sidebar/header";
import Footer from "@/components/sidebar/footer";

import clsx from "@/features/clsx";
import {RoomList} from "./room-list";

interface SidebarProps {
    isSidebarOpen: boolean;
    onToggle: () => void;
}

export function Aside({isSidebarOpen, onToggle}: SidebarProps) {
    return (
        <div className="h-full flex flex-col justify-between">
            <header
                className="sticky top-0 z-10 p-2 border-b border-border-heavy flex flex-row justify-between items-center gap-x-1 h-12">
                <Header isSidebarOpen={isSidebarOpen} onToggle={onToggle}/>
            </header>

            <nav
                className={clsx("flex-1 overflow-y-scroll", !isSidebarOpen && "hidden")}
            >
                <RoomList/>
            </nav>

            <footer
                className={clsx(
                    "sticky bottom-0 z-10 p-2 border-t border-border-heavy flex justify-around items-center gap-x-1 gap-y-2",
                    isSidebarOpen ? "flex-row" : "flex-col"
                )}
            >
                <Footer isSidebarOpen={isSidebarOpen}/>
            </footer>
        </div>
    );
}
