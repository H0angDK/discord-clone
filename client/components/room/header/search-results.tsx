import {UserData} from "@/types/session";

interface SearchResultsProps {
    query: string;
    users: UserData[];
    onSelect: (username: string) => void;
}

export const SearchResults = ({query, users, onSelect}: SearchResultsProps) => {
    if (!query || users.length === 0) return null;

    return (
        <div
            className="absolute mt-1 w-full bg-surface-200 border border-border-medium rounded-md shadow-lg z-20 max-h-60 overflow-auto">
            {users.map((user) => (
                <div
                    key={user.userId}
                    onClick={() => onSelect(user.username)}
                    className="p-2 hover:bg-surface-300 cursor-pointer text-text-primary"
                >
                    {user.username}
                </div>
            ))}
        </div>
    );
};