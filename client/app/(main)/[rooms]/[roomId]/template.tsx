"use client";
import {useSession} from "@/features/session/use-session";
import {ChatProvider} from "@/features/context/chat-context";

import {useParams, useRouter} from "next/navigation";
import {ReactNode} from "react";
import {Loading} from "./skeleton";

interface TemplateProps {
    children: ReactNode;
}

export default function Template({children}: TemplateProps) {
    const {roomId} = useParams();
    const router = useRouter();
    const {session, isLoading} = useSession();

    if (isLoading) {
        return <Loading/>;
    }

    if (roomId === undefined) {
        router.push("/");
    }

    return (
        <ChatProvider roomId={roomId as string} session={session!}>
            {children}
        </ChatProvider>
    );
}
