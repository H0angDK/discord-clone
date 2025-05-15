interface SelectedUsersListProps {
    selectedUsers: string[];
    onRemove: (username: string) => void;
}

export const SelectedUsersList = ({selectedUsers, onRemove}: SelectedUsersListProps) => (
    <div className="flex flex-wrap gap-2 mt-2">
        {selectedUsers.map((username) => (
            <div
                key={username}
                className="bg-surface-300 px-2 py-1 rounded-full text-sm text-text-primary flex items-center gap-1"
            >
                {username}
                <button
                    type="button"
                    onClick={() => onRemove(username)}
                    className="text-text-secondary hover:text-text-primary"
                >
                    ×
                </button>
            </div>
        ))}
    </div>
);