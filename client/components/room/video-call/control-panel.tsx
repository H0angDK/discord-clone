import {Button} from "@/components/ui/button"
import {ScreenShareIcon, VideoIcon, VolumeIcon} from "@/components/icon";
import {Media} from "@/types/video-call";
import {useVideoCall} from "@/features/context/video-call-context";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export function ControlPanel() {
    const {isMuted, isVideoOn, isScreenSharing, toggleMedia, toggleScreenShare, leaveCall} = useVideoCall();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const handleLeave = () => {
        leaveCall();
        const basePath = pathname.replace(/\/call$/, "");
        const params = new URLSearchParams(searchParams);
        router.push(`${basePath}?${params.toString()}` || "/");
    };

    return <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800 p-3 rounded-3xl">
        <Button
            variant="primary"
            onClick={() => toggleMedia(Media.AUDIO)}
            className={`size-14 rounded-full flex justify-center items-center ${isMuted ? "bg-error" : ""}`}
        >
            <VolumeIcon muted={isMuted}/>
        </Button>

        <Button
            variant="primary"
            onClick={() => toggleMedia(Media.VIDEO)}
            className={`size-14 rounded-full flex justify-center items-center ${!isVideoOn ? "bg-error" : ""}`}
        >
            <VideoIcon on={isVideoOn}/>
        </Button>

        <Button
            variant="primary"
            onClick={toggleScreenShare}
            className={`size-14 rounded-full flex justify-center items-center ${isScreenSharing ? "bg-secondary" : ""}`}
        >
            <ScreenShareIcon className="size-6"/>
        </Button>
        <Button
            variant="primary"
            onClick={handleLeave}
            className="size-14 rounded-full flex justify-center items-center bg-error hover:bg-error/90"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 3.75 18 6m0 0 2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
                />
            </svg>
        </Button>
    </div>
}