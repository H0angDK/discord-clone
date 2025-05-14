"use client"
import {Button} from "@/components/ui/button";
import {NavLink} from "@/components/ui/nav-link";
import clsx from "@/features/clsx";
import {Input} from "@/components/ui/input";
import {AddIcon, CogIcon} from "@/components/icon";
import {useActionState} from "react";
import {addRoomAction, Field, FormState} from "@/actions/add-room";
import {redirect} from "next/navigation";


const action = async (_: FormState, formData: FormData) => {
    return await addRoomAction(_, formData);
};

function Footer() {
    const [state, formAction, isPending] = useActionState(action, undefined);
    if (state?.success) {
        if (state.data) {
            const url = new URLSearchParams({roomName: state.data?.name})
            return redirect(`/rooms/${state.data?.id}?${url.toString()}`)
        }

    }

    return (
        <>
            <Button
                variant="primary"
                size="md"
                popoverTarget="add-room"
                className="flex items-center p-2! gap-x-1"
            >
                <AddIcon className="size-6"/>
                Room
            </Button>

            <Button variant="outline" className="p-0.5!" size="xs">
                <NavLink href={"/settings"} className={clsx("p-0 text-text-primary")}>
                    <CogIcon className="size-10"/>
                </NavLink>
            </Button>

            <dialog
                popover="auto"
                role="dialog"
                id="add-room"
                className="p-4 border border-border-active absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface-200"
            >
                <Button
                    variant="outline"
                    size="xs"
                    popoverTargetAction="hide"
                    popoverTarget="add-room"
                    className="absolute top-2 right-2"
                >
                    X
                </Button>

                <form className="space-y-4" action={formAction}>
                    <h3 className="text-lg font-semibold mb-2text-text-primary">
                        Add Room
                    </h3>
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input type="checkbox" name={Field.IsPrivate} className="sr-only peer"/>
                        <div
                            className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-focus rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Private room</span>
                    </label>
                    <Input
                        type="text"
                        label="Room name"
                        placeholder="Enter room name"
                        name={Field.Name}
                        error={state?.errors?.[Field.Name]}
                    />
                    <Button className="w-full" type="submit" disabled={isPending}>
                        Save
                    </Button>
                </form>
            </dialog>
        </>
    );
}

export default Footer;
