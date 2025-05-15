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
        throw new Error(error);
    }

    return data.content;
};

export function RoomList() {
    const [myRooms, setMyRooms] = useState<Room[]>([]);
    const [otherRooms, setOtherRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const debouncedQuery = useDebounce(query);

    useEffect(() => {
        setIsLoading(true);
        getRooms(debouncedQuery)
            .then((rooms) => {
                const my: Room[] = [];
                const other: Room[] = [];
                rooms.forEach((room) => {
                    room.your ? my.push(room) : other.push(room);
                });
                setMyRooms(my);
                setOtherRooms(other);
            })
            .finally(() => setIsLoading(false));
    }, [debouncedQuery]);

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <ul className="flex flex-col p-2 gap-1">
            {myRooms?.length > 0 && (
                <>
          <span className="uppercase w-full text-center font-medium border-b border-border-medium">
            Your
          </span>
                    {myRooms.map((room) => (
                        <RoomItem key={room.id} room={room}/>
                    ))}
                </>
            )}
            {otherRooms?.length > 0 && (
                <>
          <span className="uppercase w-full text-center font-medium border-b border-border-medium">
            Public
          </span>
                    {otherRooms.map((room) => (
                        <RoomItem key={room.id} room={room}/>
                    ))}
                </>
            )}
        </ul>
    );
}

interface RoomItemProps {
    room: Room;
}

const RoomItem = ({room}: RoomItemProps) => {
    return (
        <li>
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
    );
};
