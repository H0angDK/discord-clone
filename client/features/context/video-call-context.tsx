import {createContext, ReactNode, RefObject, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Media, RemoteStream, SignalMessage, SignalType} from "@/types/video-call";
import {UserData} from "@/types/session";

const WS_URL = process.env.WS_URL || "ws://localhost:8080";
const ICE_SERVER = "stun:stun.l.google.com:19302";

type VideoCallContextType = {
    remoteStreams: RemoteStream[];
    isMuted: boolean;
    isVideoOn: boolean;
    isScreenSharing: boolean;
    toggleMedia: (type: Media) => void;
    toggleScreenShare: () => Promise<void>;
    localVideoRef: RefObject<HTMLVideoElement | null>;
    leaveCall: () => void;
};

const VideoCallContext = createContext<VideoCallContextType | null>(null);

interface VideoCallProviderProps {
    userId: string;
    roomId: string;
    username: string;
    children: ReactNode;
}

export const VideoCallProvider = ({userId, roomId, username, children}: VideoCallProviderProps) => {
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const peers = useRef<{ [key: string]: RTCPeerConnection }>({});
    const localStream = useRef<MediaStream | null>(null);
    const screenStream = useRef<MediaStream | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const wsConnected = useRef(false);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
    const reconnectDelay = useRef(1000);

    const setupMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStream.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    }, []);

    const toggleMedia = (type: Media) => {
        const newState = !(type === Media.AUDIO ? isMuted : isVideoOn);

        if (type === Media.AUDIO) {
            setIsMuted(newState);
            localStream.current?.getAudioTracks().forEach(track => track.enabled = newState);
        } else {
            setIsVideoOn(newState);
            localStream.current?.getVideoTracks().forEach(track => track.enabled = newState);
        }
    };

    const toggleScreenShare = useCallback(async () => {
        if (isScreenSharing) {
            screenStream.current?.getTracks().forEach(track => track.stop());
            screenStream.current = null;
            setIsScreenSharing(false);

            Object.values(peers.current).forEach(peer => {
                const videoTrack = peer.getSenders().find(sender => sender.track?.kind === "video");
                if (videoTrack && localStream.current) {
                    videoTrack.replaceTrack(localStream.current.getVideoTracks()[0]);
                }
            });
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                stream.getVideoTracks().forEach(track => {
                    track.contentHint = Media.SCREENSHARE;
                });

                screenStream.current = stream;
                setIsScreenSharing(true);

                Object.values(peers.current).forEach(peer => {
                    const videoSender = peer.getSenders().find(sender => sender.track?.kind === Media.VIDEO);
                    videoSender?.replaceTrack(stream.getVideoTracks()[0]);
                });

                stream.getVideoTracks()[0].onended = () => toggleScreenShare();
            } catch (error) {
                console.error("Error sharing screen:", error);
            }
        }
    }, [isScreenSharing]);


    const sendSignalMessage = useCallback((targetId: string, type: SignalMessage["type"], data: SignalMessage["data"]) => {
            ws.current?.send(JSON.stringify({
                type,
                senderId: userId,
                senderName: username,
                targetId,
                data
            }));
        },
        [userId, username]
    );

    const createPeerConnection = useCallback(
        async (targetId: string, targetUsername: string) => {
            const peer = new RTCPeerConnection({
                iceServers: [{urls: ICE_SERVER}]
            });

            peer.onicecandidate = event => {
                if (event.candidate) {
                    sendSignalMessage(targetId, SignalType.ICE_CANDIDATE, event.candidate);
                }
            };

            peer.ontrack = event => {
                const remoteStream = event.streams[0];
                const isScreen = event.track.kind === Media.VIDEO &&
                    event.track.contentHint === Media.SCREENSHARE;

                setRemoteStreams(prev => [
                    ...prev.filter(stream =>
                        stream.userId !== targetId ||
                        stream.isScreen !== isScreen
                    ),
                    {userId: targetId, username: targetUsername, stream: remoteStream, isScreen}
                ]);
            };

            peer.onnegotiationneeded = async () => {
                try {
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    sendSignalMessage(targetId, SignalType.OFFER, offer);
                } catch (error) {
                    console.error("Negotiation failed:", error);
                }
            };

            peer.onconnectionstatechange = () => {
                if (["disconnected", "failed", "closed"].includes(peer.connectionState)) {
                    delete peers.current[targetId];
                    setRemoteStreams(prev => prev.filter(stream => stream.userId !== targetId));
                }
            };

            [localStream.current, screenStream.current].forEach(stream => {
                stream?.getTracks().forEach(track => peer.addTrack(track, stream));
            });

            peers.current[targetId] = peer;
            return peer;
        },
        [sendSignalMessage]
    );

    const handleSignalMessage = useCallback(async (message: SignalMessage) => {
            if (message.senderId === userId) return;

            try {
                const peer = peers.current[message.senderId] || await createPeerConnection(
                    message.senderId,
                    message.senderName
                );

                switch (message.type) {
                    case SignalType.OFFER:
                        await peer.setRemoteDescription(message.data as RTCSessionDescriptionInit);
                        const answer = await peer.createAnswer();
                        await peer.setLocalDescription(answer);
                        sendSignalMessage(message.senderId, SignalType.ANSWER, answer);
                        break;
                    case SignalType.ANSWER:
                        await peer.setRemoteDescription(message.data as RTCSessionDescriptionInit);
                        break;
                    case SignalType.ICE_CANDIDATE:
                        await peer.addIceCandidate(message.data as RTCIceCandidateInit);
                        break;
                }
            } catch (error) {
                console.error("Error handling signal:", error);
            }
        },
        [userId, sendSignalMessage, createPeerConnection]
    );


    const leaveCall = useCallback(() => {
        ws.current?.close();
        Object.values(peers.current).forEach(peer => peer.close());
        localStream.current?.getTracks().forEach(track => track.stop());
        screenStream.current?.getTracks().forEach(track => track.stop());

        setRemoteStreams([]);
        setIsMuted(false);
        setIsVideoOn(true);
        setIsScreenSharing(false);

        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
    }, []);

    useEffect(() => {
        const setupWebSocket = () => {
            ws.current = new WebSocket(`${WS_URL}/call?roomId=${roomId}&userId=${userId}`);

            ws.current.onopen = () => {
                reconnectAttempts.current = 0;
                reconnectDelay.current = 1000;
                wsConnected.current = true;
            };

            ws.current.onmessage = async event => {
                const message = JSON.parse(event.data);
                if (message.type === SignalType.USER_LIST) {
                    const users = message.data;
                    const currentPeerIds = Object.keys(peers.current);

                    currentPeerIds.forEach(peerId => {
                        if (!users.some((u: UserData) => u.userId === peerId)) {
                            peers.current[peerId]?.close();
                            delete peers.current[peerId];
                            setRemoteStreams(prev => prev.filter(stream => stream.userId !== peerId));
                        }
                    });

                    const newUsers = users.filter((user: UserData) =>
                        user.userId !== userId &&
                        !peers.current[user.userId] &&
                        userId.localeCompare(user.userId) < 0
                    );

                    for (const user of newUsers) {
                        await createPeerConnection(user.userId, user.username);
                    }
                } else {
                    await handleSignalMessage(message);
                }
            };

            ws.current.onclose = () => {
                wsConnected.current = false;
                reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
                reconnectTimeout.current = setTimeout(setupWebSocket, reconnectDelay.current);
            };
        };

        const cleanUp = peers.current

        setupWebSocket();
        return () => {
            ws.current?.close();
            Object.values(cleanUp).forEach(peer => peer.close());
            localStream.current?.getTracks().forEach(track => track.stop());
            screenStream.current?.getTracks().forEach(track => track.stop());
        };
    }, [roomId, userId, handleSignalMessage, createPeerConnection]);

    useEffect(() => {
        setupMedia();
        return () => {
            leaveCall();
        };
    }, [setupMedia, leaveCall]);

    return (
        <VideoCallContext
            value={{
                remoteStreams,
                isMuted,
                isVideoOn,
                isScreenSharing,
                toggleMedia,
                toggleScreenShare,
                localVideoRef,
                leaveCall
            }}
        >
            {children}
        </VideoCallContext>
    );
};

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (!context) throw new Error("useVideoCall must be used within VideoCallProvider");
    return context;
};