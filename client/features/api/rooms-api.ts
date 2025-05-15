"use server";
import {request} from "./base-api";
import {Room} from "@/types/room";
import {Pageable} from "@/types/pagination";
import {UserData} from "@/types/session";

export async function getRooms(query?: string) {
    const params = new URLSearchParams(query ? {query} : {});
    const url = query ? `/api/rooms?${params.toString()}` : "/api/rooms/users";
    return request<Pageable<Room>>(url, {
        method: "GET",
        next: {
            tags: ["rooms"],
            revalidate: 60,
        },
    });
}

export async function createRoom(name: string, isPrivate: boolean) {
    return request<Room>("/api/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name, isPrivate}),
    });
}

export async function addUsersToRoom(roomId: string, users: string[]) {
    return request<Room>(`/api/rooms/add-users`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            users,
            id: roomId,
        }),
    });
}

export async function searchUsers(query: string) {
    return request<Array<UserData>>(`/api/users?query=${query}`, {
        method: "GET"
    });
} 