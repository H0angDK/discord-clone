import {NavLink} from "../ui/nav-link";
import {useRooms} from "@/features/context/room-context";


export function RoomList() {
    const {rooms, setCurrentRoom} = useRooms();
    return (
        <ul className="flex flex-col p-2 gap-1">
            {rooms?.length > 0 &&
                rooms.map((room) => (
                    <li key={room.id}>
                        <NavLink
                            onClick={() => setCurrentRoom(room)}
                            href={`/rooms/${room.id}`}
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
