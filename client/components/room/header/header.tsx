"use client";


import {useParams, usePathname, useSearchParams} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CallIcon} from "@/components/icon";
import {AddUsersDialog} from "./add-users-dialog";


export const Header = () => {
    const pathname = usePathname();
    const queryParams = useSearchParams();
    const {roomId} = useParams();
    return (
        <header
            className="h-12 bg-surface-200 w-full sticky top-0 z-10 border-b border-border-heavy px-3 flex items-center justify-between">
            <nav className="flex gap-2">
                <Link href={{
                    pathname: `${pathname}/call`,
                    query: {
                        roomName: queryParams?.get("roomName") || '',
                    }
                }}>
                    <Button variant="outline">
                        <CallIcon/>
                    </Button>
                </Link>

                <AddUsersDialog roomId={roomId as string}/>
            </nav>

            <span className="font-bold text-xl">
        {queryParams?.get("roomName") || 'Select a Room'}
      </span>
        </header>
    );
};