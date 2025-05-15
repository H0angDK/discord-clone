"use client";

import {useActionState, useState} from "react";
import {Button} from "@/components/ui/button";
import {UserSearch} from "./user-search";
import {roomsAPI} from "@/features/api";
import type {UserData} from "@/types/session";
import {AddUserIcon} from "@/components/icon";

interface AddUsersDialogProps {
    roomId: string;
}

type FormState = {
    message: string;
} | null;

export const AddUsersDialog = ({roomId}: AddUsersDialogProps) => {
    const [selectedUsers, setSelectedUsers] = useState<UserData["username"][]>([]);

    const handleAddUsers = async () => {
        const {error} = await roomsAPI.addUsersToRoom(roomId, selectedUsers);
        if (error) return {message: "Error adding users", success: false};
        return null;
    };

    const [state, action, isPending] = useActionState<FormState>(handleAddUsers, null);

    return (
        <>
            <Button variant="outline" popoverTarget="add-users">
                <AddUserIcon className="size-6"/>
            </Button>

            <dialog
                popover="auto"
                id="add-users"
                className="p-4 border border-border-active bg-surface-200 rounded-md shadow-lg w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">Room Management</h2>
                    <Button
                        variant="outline"
                        size="xs"
                        popoverTargetAction="hide"
                        popoverTarget="add-users"
                        className="h-8 w-8 p-0"
                    >
                        X
                    </Button>
                </div>

                <form className="space-y-4" action={action}>
                    <UserSearch
                        selectedUsers={selectedUsers}
                        onSelect={setSelectedUsers}
                    />
                    {state?.message && <p className="text-error">{state.message}</p>}
                    <Button className="flex-1" type="submit" disabled={isPending}>
                        Invite Users
                    </Button>
                </form>
            </dialog>
        </>
    );
};