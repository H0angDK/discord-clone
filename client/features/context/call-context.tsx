// import {createContext, ReactNode, useEffect, useRef, useState} from "react";
//
// interface CallContextType {
//     localStream: MediaStream | null;
//     remoteStreams: MediaStream[];
//     startCall: () => Promise<void>
//     // isMuted: boolean;
//     // isVideoOn: boolean;
//     // toggleMute: () => void;
//     // toggleVideo: () => void;
//     // endCall: () => void;
//     // shareScreen: () => void;
//     // stopScreenShare: () => void;
//     // shareFile: () => void;
//     // shareLocation: () => void;
//     // shareLink: () => void;
//     // shareImage: () => void;
//     // shareVideo: () => void;
// }
//
// export interface SignalingMessage {
//     type: 'offer' | 'answer' | 'candidate' | 'userJoined';
//     roomId?: string;
//     senderId?: string;
//     data?: RTCSessionDescriptionInit | RTCIceCandidateInit;
// }
//
// const CallContext = createContext<CallContextType>({
//     localStream: null,
//     remoteStreams: [],
//     startCall: async () => {
//     },
// });
//
// interface CallProviderProps {
//     children: ReactNode;
//     roomId: string;
//     userId: string;
// }
//
// const WS_URL = process.env.WS_URL || "ws://localhost:8080";
//
// const CallProvider = ({children, roomId, userId}: CallProviderProps) => {
//     const socketRef = useRef<WebSocket | null>(null);
//     const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//     const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
//     const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
//
//     useEffect(() => {
//         const query = new URLSearchParams({
//             roomId,
//             userId,
//         });
//         const socket = new WebSocket(
//             `${WS_URL}/call?${query.toString()}`
//         );
//
//         socketRef.current = socket;
//
//         socket.onmessage = (event) => {
//             const eventData = JSON.parse(event.data);
//
//         };
//     }, []);
//
//
//     const handleSignalingMessage = (message: SignalingMessage) => {
//         switch (message.type) {
//             case 'offer':
//                 break;
//             case 'answer':
//                 break;
//             case 'candidate':
//                 break;
//             case 'join':
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     const handleOffer = async (senderId: string, offer: RTCSessionDescriptionInit) => {
//         const pc = createPeerConnection(senderId);
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//
//         sendMessage({
//             senderId,
//             type: 'answer',
//             data: answer,
//         });
//     };
//
//     const handleAnswer = async (senderId: string, answer: RTCSessionDescriptionInit) => {
//         const pc = peerConnections.current[senderId];
//         if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
//     };
//
//     const handleCandidate = (senderId: string, candidate: RTCIceCandidateInit) => {
//         const pc = peerConnections.current[senderId];
//         if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate));
//     };
//
//     const createPeerConnection = (userId: string) => {
//         const pc = new RTCPeerConnection({
//             iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
//         });
//
//         pc.onicecandidate = (event) => {
//             if (event.candidate) {
//                 sendMessage({
//                     type: 'candidate',
//                     data: event.candidate.toJSON()
//                 });
//             }
//         };
//
//         pc.ontrack = (event) => {
//             setRemoteStreams(prev => [...prev, event.streams[0]]);
//         };
//
//         peerConnections.current[userId] = pc;
//         return pc;
//     };
//
//     const sendMessage = (message: SignalingMessage) => {
//         if (socketRef.current?.readyState === WebSocket.OPEN) {
//             socketRef.current.send(JSON.stringify(message));
//         }
//     };
//
//     const startCall = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
//         setLocalStream(stream);
//     };
//
//
//     return (
//         <CallContext value={{
//             localStream,
//             remoteStreams,
//             startCall,
//         }}>
//             {children}
//         </CallContext>
//     )
// }