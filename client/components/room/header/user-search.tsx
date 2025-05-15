"use client";
import {useEffect, useState} from "react";
import {useDebounce} from "@/features/use-debounce";
import {roomsAPI} from "@/features/api";
import type {UserData} from "@/types/session";
import {SelectedUsersList} from "./selected-users-list";
import {SearchResults} from "./search-results";

interface UserSearchProps {
    selectedUsers: UserData["username"][];
    onSelect: (users: UserData["username"][]) => void;
}

export const UserSearch = ({selectedUsers, onSelect}: UserSearchProps) => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedQuery = useDebounce(query);

    useEffect(() => {
        const searchUsers = async () => {
            if (debouncedQuery.trim()) {
                setIsLoading(true);
                try {
                    const {data} = await roomsAPI.searchUsers(debouncedQuery);
                    setUsers(data || []);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUsers([]);
            }
        };
        searchUsers();
    }, [debouncedQuery]);

    const handleSelectUser = (username: string) => {
        if (!selectedUsers.includes(username)) {
            onSelect([...selectedUsers, username]);
        }
        setQuery("");
    };

    const handleRemoveUser = (username: string) => {
        onSelect(selectedUsers.filter(u => u !== username));
    };

    return (
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

                <SearchResults
                    query={query}
                    users={users}
                    onSelect={handleSelectUser}
                />
            </div>

            <SelectedUsersList
                selectedUsers={selectedUsers}
                onRemove={handleRemoveUser}
            />
        </div>
    );
};