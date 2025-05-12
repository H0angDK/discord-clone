import {Sidebar} from "@/components/sidebar/sidebar";
import {getSession} from "@/features/session/server";
import {Room} from "@/types/room";
import {Pageable} from "@/types/pagination";
import {httpClient} from "@/features/http-client";
import {ReactNode} from "react";
import {RoomsProvider} from "@/features/context/room-context";

const getRooms = async (): Promise<Room[]> => {
    const session = await getSession();
    const {data, error} = await httpClient<Pageable<Room>>("/api/rooms/users", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
        next: {
            tags: ["rooms"],
        },
    });

    if (error) {
        throw error;
    }

    return data.content;
};

interface LayoutProps {
    children: ReactNode;
}

export default async function Layout({children}: LayoutProps) {
    const rooms = await getRooms();

    return (
        <RoomsProvider initialRooms={rooms}>
            <div className="flex min-h-screen bg-surface-100 text-text-primary">
                <Sidebar/>
                <main className="flex-1 h-screen">{children}</main>
            </div>
        </RoomsProvider>
    );
}

