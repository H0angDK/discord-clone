"use client";
import {NavLink} from "../ui/nav-link";
import {Room} from "@/types/room";
import {httpClient} from "@/features/http-client";
import {Pageable} from "@/types/pagination";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Loading} from "./loading";

const getRooms = async (query: string): Promise<Room[]> => {
    const params = new URLSearchParams({query});
    const url = query ? `/api/rooms?${params.toString()}` : "/api/rooms/users";
    const {data, error} = await httpClient<Pageable<Room>>(url, {
        method: "GET",
        next: {
            tags: ["rooms"],
            revalidate: 60,
        },
    });

    if (error) {
        throw error;
    }

    return data.content;
};

export function RoomList() {

    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        getRooms(searchParams.get("query") || "").then((rooms) => {
            setRooms(rooms)
        }).finally(() => setIsLoading(false));
    }, [searchParams]);

    if (isLoading) {
        return <Loading/>
    }

    return (
        <ul className="flex flex-col p-2 gap-1">
            {rooms?.length > 0 &&
                rooms.map((room) => (
                    <li key={room.id}>
                        <NavLink
                            href={{
                                pathname: `/rooms/${room.id}`,
                                query: {
                                    roomName: room.name,
                                },
                            }}
                            className="block px-4 py-2 text-text-primary hover:bg-surface-400 rounded-lg border-l-4 border-transparent"
                            activeClassName="bg-surface-500 border-primary font-medium"
                        >
                            {room.name}
                        </NavLink>
                    </li>
                ))}
        </ul>
    );
}