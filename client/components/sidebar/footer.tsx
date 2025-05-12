import {Button} from "@/components/ui/button";
import {NavLink} from "@/components/ui/nav-link";
import clsx from "@/features/clsx";
import {Input} from "@/components/ui/input";
import {AddIcon, CogIcon} from "@/components/icon";
import {useActionState} from "react";
import {addRoomAction, Field, FormState} from "@/actions/add-room";
import {redirect, RedirectType} from "next/navigation";

interface FooterProps {
    isSidebarOpen: boolean;
}

const action = async (_: FormState, formData: FormData) => {
    const result = await addRoomAction(_, formData);
    if (result.success) {
        return redirect(`/room/${result.data?.id}`, RedirectType.replace);
    }

    return result;
};

function Footer({isSidebarOpen}: FooterProps) {
    const [state, formAction, isPending] = useActionState(action, undefined);

    return (
        <>
            <Button
                variant="primary"
                size="md"
                popoverTarget="add-room"
                className="flex items-center p-2! gap-x-1"
            >
                <AddIcon className="size-6"/>
                {isSidebarOpen ? "Room" : ""}
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

                <form className="space-y-3" action={formAction}>
                    <h3 className="text-lg font-semibold mb-2 text-text-primary">
                        Add Room
                    </h3>
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
