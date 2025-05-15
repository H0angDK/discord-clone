import {VideoCallProvider} from "@/features/context/video-call-context";
import {VideoPanel} from "@/components/room/video-call/video-panel";
import {ControlPanel} from "@/components/room/video-call/control-panel";

interface VideoCallProps {
    userId: string;
    roomId: string;
    username: string;
}


export const VideoCall = ({userId, roomId, username}: VideoCallProps) => (
    <VideoCallProvider userId={userId} roomId={roomId} username={username}>
        <div className="max-w-7xl mx-auto h-[calc(100vh-1rem)] relative">
            <VideoPanel/>
            <ControlPanel/>
        </div>
    </VideoCallProvider>
);