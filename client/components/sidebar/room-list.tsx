"use client";
import {NavLink} from "../ui/nav-link";
import {Room} from "@/types/room";
import {roomsAPI} from "@/features/api";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Loading} from "./loading";
import {useDebounce} from "@/features/use-debounce";

const getRooms = async (query: string): Promise<Room[]> => {
    const {data, error} = await roomsAPI.getRooms(query);


    if (error) {
        throw new Error(error)
    }

    return data.content;
};

export function RoomList() {

    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const debouncedQuery = useDebounce(query);

    useEffect(() => {
        setIsLoading(true);
        getRooms(debouncedQuery).then((rooms) => {
            setRooms(rooms)
        }).finally(() => setIsLoading(false));
    }, [debouncedQuery]);

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