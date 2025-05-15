"use client"
import {useParams} from "next/navigation";
import {useSession} from "@/features/session/use-session";
import {VideoCall} from "@/components/room/video-call/video-call";

const Page = () => {
    const {roomId} = useParams();
    const {session, isLoading} = useSession();

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
    }

    return (
        <VideoCall
            userId={session!.userId}
            roomId={roomId as string}
            username={session!.username}
        />
    );
};

export default Page;