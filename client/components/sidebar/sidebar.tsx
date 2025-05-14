import Header from "@/components/sidebar/header";
import {RoomList} from "@/components/sidebar/room-list";
import Footer from "@/components/sidebar/footer";


const Sidebar = () => {
    return (
        <aside
            className="bg-surface-200 h-screen transition-all duration-300 overflow-hidden border-r-2 border-border-medium scroll-smooth w-1/6">
            <div className="h-full flex flex-col justify-between">
                <header
                    className="sticky top-0 z-10 p-2 border-b border-border-heavy flex flex-row justify-between items-center gap-x-1 h-12">
                    <Header/>
                </header>

                <nav className="flex-1 overflow-y-scroll">
                    <RoomList/>
                </nav>

                <footer
                    className="sticky bottom-0 z-10 p-2 border-t border-border-heavy flex justify-around items-center gap-x-1 gap-y-2">
                    <Footer/>
                </footer>
            </div>
        </aside>
    );
};

export {Sidebar};
