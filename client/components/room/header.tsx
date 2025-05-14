"use client";

import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {CallIcon} from "@/components/icon";
import Link from "next/link";
import {useActionState, useEffect, useState} from "react";
import {httpClient} from "@/features/http-client";
import {UserData} from "@/types/session";

type FormState = {
    message: string;
    success: boolean;
} | null;


export const Header = () => {
    const pathname = usePathname();
    const queryParams = useSearchParams();
    const {roomId} = useParams();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserData["username"][]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleAddUsers = async () => {
        console.log("add users");
        const {isOk} = await httpClient<UserData>(`/api/rooms/add-users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                users: selectedUsers,
                id: roomId,
            }),
        });

        if (isOk) {
            return router.refresh();
        }

        return null;
    }

    const [state, action, isPeading] = useActionState<FormState, FormData>(handleAddUsers, null);


    useEffect(() => {
        const searchUsers = async () => {
            if (query.trim()) {
                setIsLoading(true);
                try {
                    const {data} = await httpClient<Array<UserData>>(`/api/users?query=${query}`, {
                        method: "GET"
                    });
                    setUsers(data);
                } catch (error) {
                    console.error("Error searching users:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleLeaveRoom = () => {
        router.push("/");
    };

    return (
        <header
            className="h-12 bg-surface-200 w-full sticky top-0 z-10 border-b border-border-heavy px-3 flex items-center justify-between">
            <nav className="flex gap-2">
                <Link href={`${pathname}/call`}>
                    <Button variant="outline" className="border-none">
                        <CallIcon/>
                    </Button>
                </Link>

                <Button variant="outline" popoverTarget="add-users">
                    Add Users
                </Button>

                <dialog
                    popover="auto"
                    id="add-users"
                    className="p-4 border border-border-active bg-surface-200 rounded-md shadow-lg w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">Room Management</h2>
                        <Button
                            variant="outline"
                            size="xs"
                            popoverTargetAction="hide"
                            popoverTarget="add-users"
                            className="h-8 w-8 p-0"
                        >
                            ×
                        </Button>
                    </div>

                    <form
                        className="space-y-4"
                        action={action}
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">
                                Search Users
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full p-2 bg-surface-300 border border-border-medium rounded-md text-text-primary"
                                />

                                {isLoading && (
                                    <div className="absolute right-2 top-2 animate-spin">
                                        <div className="h-5 w-5 border-2 border-t-transparent rounded-full"/>
                                    </div>
                                )}

                                {query && users.length > 0 && (
                                    <div
                                        className="absolute mt-1 w-full bg-surface-200 border border-border-medium rounded-md shadow-lg z-20 max-h-60 overflow-auto">
                                        {users.map((user) => (
                                            <div
                                                key={user.userId}
                                                onClick={() => {
                                                    if (!selectedUsers.some(u => u === user.username)) {
                                                        setSelectedUsers([...selectedUsers, user.username]);
                                                    }
                                                    setQuery("");
                                                }}
                                                className="p-2 hover:bg-surface-300 cursor-pointer text-text-primary"
                                            >
                                                {user.username}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedUsers.map((username) => (
                                    <div
                                        key={username}
                                        className="bg-surface-300 px-2 py-1 rounded-full text-sm text-text-primary flex items-center gap-1"
                                    >
                                        {username}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedUsers(selectedUsers.filter(u => u !== username))}
                                            className="text-text-secondary hover:text-text-primary"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1" type="submit">
                                Invite Users
                            </Button>
                        </div>
                    </form>
                </dialog>
            </nav>

            <span className="font-bold text-xl">
        {queryParams?.get("roomName") || 'Select a Room'}
      </span>
        </header>
    );
};