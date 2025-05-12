'use client';

import {createContext, ReactNode, useContext, useState} from 'react'
import {Room} from "@/types/room"

type RoomsContextType = {
    rooms: Room[];
    currentRoom: Room | null;
    setCurrentRoom: (room: Room) => void;
};

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

interface RoomsProviderProps {
    children: ReactNode;
    initialRooms: Room[];
}

export const RoomsProvider = ({children, initialRooms}: RoomsProviderProps) => {
    const [currentRoom, setRoom] = useState<Room | null>(null);
    const [rooms, _] = useState<Room[]>(initialRooms);
    const setCurrentRoom = (room: Room) => {
        setRoom(room);
    }
    return (
        <RoomsContext value={{rooms, currentRoom, setCurrentRoom}}>
            {children}
        </RoomsContext>
    );
}

export const useRooms = () => {
    const context = useContext(RoomsContext);
    if (!context) {
        throw new Error('useRooms must be used within a RoomsProvider');
    }
    return context;
}