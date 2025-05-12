"use client"
import {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from "next/navigation";
import {useSession} from "@/features/session/use-session";
import {UserData} from "@/types/session";
import {Button} from "@/components/ui/button";

type RemoteStream = {
    userId: string;
    username: string;
    stream: MediaStream;
    isScreen?: boolean;
};

type SignalMessage = {
    type: 'offer' | 'answer' | 'ice-candidate';
    senderId: string;
    senderName: string;
    targetId: string;
    data: RTCSessionDescriptionInit | RTCIceCandidateInit;
};

type BroadcastMessage = {
    type: 'user-list';
    data: Array<UserData>;
};

interface VideoCallProps {
    userId: string;
    roomId: string;
    username: string;
}

const WS_URL = process.env.WS_URL || 'ws://localhost:8080';

const VideoCall = ({userId, roomId, username}: VideoCallProps) => {
    const peers = useRef<{ [key: string]: RTCPeerConnection }>({});
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const ws = useRef<WebSocket | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const screenStream = useRef<MediaStream | null>(null);
    const wsConnected = useRef(false);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
    const reconnectDelay = useRef(1000);

    const sendSignalMessage = useCallback((targetId: string, type: SignalMessage['type'], data: SignalMessage['data']) => {
        ws.current?.send(JSON.stringify({
            type,
            senderId: userId,
            senderName: username,
            targetId,
            data
        }));
    }, [userId, username]);

    const setupMedia = async () => {
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
            console.error('Error accessing media devices:', error);
        }
    };

    const createPeerConnection = useCallback(async (targetId: string, targetUsername: string) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {urls: 'stun:stun.l.google.com:19302'},
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignalMessage(targetId, 'ice-candidate', event.candidate);
            }
        };

        peer.ontrack = (event) => {
            const remoteStream = event.streams[0];
            const isScreen = event.track.kind === 'video' &&
                event.track.contentHint === 'screenshare';

            setRemoteStreams(prev => [
                ...prev.filter(stream =>
                    stream.userId !== targetId ||
                    stream.isScreen !== isScreen
                ),
                {
                    userId: targetId,
                    username: targetUsername,
                    stream: remoteStream,
                    isScreen
                }
            ]);
        };

        peer.onnegotiationneeded = async () => {
            try {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                sendSignalMessage(targetId, 'offer', offer);
            } catch (error) {
                console.error('Negotiation failed:', error);
            }
        };

        peer.onconnectionstatechange = () => {
            if (['disconnected', 'failed', 'closed'].includes(peer.connectionState)) {
                delete peers.current[targetId];
                setRemoteStreams(prev => prev.filter(stream => stream.userId !== targetId));
            }
        };

        [localStream.current, screenStream.current].forEach(stream => {
            stream?.getTracks().forEach(track => {
                peer.addTrack(track, stream);
            });
        });

        peers.current[targetId] = peer;
        return peer;
    }, [sendSignalMessage]);


    const handleSignalMessage = useCallback(async (message: SignalMessage) => {
        if (message.senderId === userId) return;

        try {
            const peer = peers.current[message.senderId] ||
                await createPeerConnection(message.senderId, message.senderName);

            switch (message.type) {
                case 'offer':
                    await peer.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);
                    sendSignalMessage(message.senderId, 'answer', answer);
                    break;

                case 'answer':
                    await peer.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
                    break;

                case 'ice-candidate':
                    await peer.addIceCandidate(new RTCIceCandidate(message.data as RTCIceCandidateInit));
                    break;
            }
        } catch (error) {
            console.error('Error handling signal:', error);
        }
    }, [createPeerConnection, sendSignalMessage, userId]);

    const handleNewUsers = useCallback(async (users: Array<UserData>) => {
        const currentPeerIds = Object.keys(peers.current);

        currentPeerIds.forEach(peerId => {
            if (!users.some(u => u.userId === peerId)) {
                peers.current[peerId]?.close();
                delete peers.current[peerId];
                setRemoteStreams(prev => prev.filter(stream => stream.userId !== peerId));
            }
        });

        const newUsers = users.filter(user =>
            user.userId !== userId &&
            !peers.current[user.userId] &&
            userId.localeCompare(user.userId) < 0
        );

        for (const user of newUsers) {
            try {
                await createPeerConnection(user.userId, user.username);
            } catch (error) {
                console.error('Error creating peer connection:', error);
            }
        }
    }, [createPeerConnection, userId]);

    const setupWebSocket = useCallback(() => {
        if (ws.current) {
            ws.current.close();
        }

        ws.current = new WebSocket(`${WS_URL}/call?roomId=${roomId}&userId=${userId}`);

        ws.current.onopen = () => {
            reconnectAttempts.current = 0;
            reconnectDelay.current = 1000;

            if (wsConnected.current) {
                Object.values(peers.current).forEach(peer => peer.close());
                peers.current = {};
                setRemoteStreams([]);
            }
            wsConnected.current = true;
        };

        ws.current.onmessage = async (event) => {
            const message = JSON.parse(event.data) as BroadcastMessage | SignalMessage;

            if (message.type === 'user-list') {
                const users = (message as BroadcastMessage).data;
                await handleNewUsers(users);
            } else {
                await handleSignalMessage(message as SignalMessage);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
            wsConnected.current = false;

            reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
            reconnectAttempts.current += 1;

            reconnectTimeout.current = setTimeout(() => {
                console.log(`Attempting reconnect #${reconnectAttempts.current}`);
                setupWebSocket();
            }, reconnectDelay.current);
        };
    }, [roomId, userId, handleNewUsers, handleSignalMessage]);


    const toggleMedia = (type: 'audio' | 'video') => {
        const newState = !(type === 'audio' ? isMuted : isVideoOn);

        if (type === 'audio') {
            setIsMuted(newState);
            localStream.current?.getAudioTracks().forEach(track => track.enabled = newState);
        } else {
            setIsVideoOn(newState);
            localStream.current?.getVideoTracks().forEach(track => track.enabled = newState);
        }
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            screenStream.current?.getTracks().forEach(track => track.stop());
            screenStream.current = null;
            setIsScreenSharing(false);

            Object.values(peers.current).forEach(peer => {
                const videoTrack = peer.getSenders().find(sender => sender.track?.kind === 'video');
                if (videoTrack && localStream.current) {
                    videoTrack.replaceTrack(localStream.current?.getVideoTracks()[0]);
                }
            });
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                stream.getVideoTracks().forEach(track => {
                    track.contentHint = 'screenshare';
                });

                screenStream.current = stream;
                setIsScreenSharing(true);

                Object.values(peers.current).forEach(peer => {
                    const videoSender = peer.getSenders().find(
                        sender => sender.track?.kind === 'video'
                    );

                    if (videoSender) {
                        const screenTrack = stream.getVideoTracks()[0];
                        videoSender.replaceTrack(screenTrack);
                    }
                });

                stream.getVideoTracks()[0].onended = () => {
                    toggleScreenShare();
                };

            } catch (error) {
                console.error('Error sharing screen:', error);
            }
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await setupMedia();
            setupWebSocket();
        };
        initialize();

        return () => {
            ws.current?.close();
            Object.values(peers.current).forEach(peer => peer.close());
            localStream.current?.getTracks().forEach(track => track.stop());
            screenStream.current?.getTracks().forEach(track => track.stop());
        };
    }, [setupWebSocket]);

    return (
        <div className="bg-gray-900 min-h-screen text-white p-4">
            <div className="max-w-7xl mx-auto h-[calc(100vh-1rem)] relative">
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
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                            <div className="bg-gray-900/90 text-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                                {username} (You)
                            </div>
                            {!isVideoOn && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                        </div>
                    </div>

                    {screenStream.current && (
                        <div
                            className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden border-2 border-green-500">
                            <video
                                autoPlay
                                muted
                                ref={video => {
                                    if (video) {
                                        video.srcObject = screenStream.current;
                                    }
                                }}
                                className="w-full h-full object-fit aspect-video"
                            />
                            <div className="absolute bottom-2 left-2 text-sm bg-gray-900/80 px-2 py-1 rounded">
                                {username} (Screen)
                            </div>
                        </div>
                    )}

                    {remoteStreams.map(({userId, username, stream, isScreen}) => (
                        <div
                            key={`${userId}-${isScreen ? 'screen' : 'cam'}`}
                            className={`relative w-full h-full bg-gray-800 rounded-lg overflow-hidden ${
                                isScreen ? 'border-2 border-green-500' : 'border-2 border-transparent hover:border-gray-600'
                            } transition-all`}
                        >
                            <video
                                autoPlay
                                ref={video => {
                                    if (video) {
                                        video.srcObject = stream;
                                    }
                                }}
                                className="w-full h-full object-fit aspect-video"
                                muted={isScreen}
                            />
                            <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                <div className="bg-gray-900/90 text-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                                    {username} {isScreen && "'s Screen"}
                                </div>
                                {stream.getAudioTracks().every(t => !t.enabled) && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800 p-3 rounded-3xl">
                    <Button
                        variant="primary"
                        onClick={() => toggleMedia('audio')}
                        className={`size-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : ''}`}
                    >
                        {isMuted ? (
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                        ) : (
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V19h4v2H8v-2h4v-3.07z"/>
                            </svg>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => toggleMedia('video')}
                        className={`size-14 rounded-full flex items-center justify-center ${!isVideoOn ? 'bg-red-500' : ''}`}
                    >
                        {isVideoOn ? (
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                            </svg>
                        ) : (
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 6h10.5v12H4z" opacity=".3"/>
                                <path
                                    d="M18 14.5V11c0-.55-.45-1-1-1H6.5l4 4-4 4h11c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                            </svg>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={toggleScreenShare}
                        className={`size-14 rounded-full flex items-center justify-center ${isScreenSharing ? 'bg-green-500' : ''}`}
                    >
                        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-4-6h-4v2h4v3H8v-3h4v-2H8v-4h9z"/>
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    );
};

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