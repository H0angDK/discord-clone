import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {CallIcon} from "@/components/icon";
import Link from "next/link";
import {useRooms} from "@/features/context/room-context";

export const Header = () => {
    const pathname = usePathname();
    const {currentRoom} = useRooms();

    return (
        <header
            className="h-12 bg-surface-200 w-full sticky top-0 z-10 border-b border-border-heavy px-3 flex items-center justify-between">
            <nav>
                <Link href={`${pathname}/call`}>
                    <Button variant="outline" className="border-none">
                        <CallIcon/>
                    </Button>
                </Link>
            </nav>
            <span className="font-bold text-xl">{currentRoom?.name || 'Select a Room'}</span>
        </header>
    )
};
