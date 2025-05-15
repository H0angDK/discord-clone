import {useVideoCall} from "@/features/context/video-call-context";

export function VideoPanel() {
    const {localVideoRef, remoteStreams} = useVideoCall()
    return (

        <div
            className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] overflow-x-auto pb-4 h-[calc(100%-6rem)] gap-4 custom-scrollbar">
            <div
                className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-600 transition-all">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-fit aspect-video"
                />
                <div
                    className="absolute bottom-2 left-2 bg-gray-900/90 text-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                    You
                </div>
            </div>

            {/* Remote Streams */}
            {remoteStreams.map(({userId, username, stream, isScreen}) => (
                <div
                    key={`${userId}-${isScreen ? "screen" : "cam"}`}
                    className={`relative w-full h-full bg-gray-800 rounded-lg overflow-hidden ${
                        isScreen ? "border-2 border-green-500" : "border-2 border-transparent hover:border-gray-600"
                    } transition-all`}
                >
                    <video
                        autoPlay
                        ref={video => {
                            if (video) video.srcObject = stream
                        }}
                        className="w-full h-full object-fit aspect-video"
                        muted={isScreen}
                    />
                    <div
                        className="absolute bottom-2 left-2 bg-gray-900/90 text-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                        {username} {isScreen && "(Screen)"}
                    </div>
                </div>
            ))}
        </div>
    )
}