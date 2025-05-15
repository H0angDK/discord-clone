import {UserData} from "@/types/session";

export type RemoteStream = {
    userId: string;
    username: string;
    stream: MediaStream;
    isScreen?: boolean;
};

export enum SignalType {
    OFFER = 'offer',
    ANSWER = 'answer',
    ICE_CANDIDATE = 'ice-candidate',
    LEAVE = 'leave',
    MUTE = 'mute',
    UNMUTE = 'unmute',
    SCREEN_SHARE = 'screen-share',
    STOP_SCREEN_SHARE = 'stop-screen-share',
    USER_LIST = 'user-list',
}

export type SignalMessage = {
    type: SignalType.ANSWER | SignalType.OFFER | SignalType.ICE_CANDIDATE | SignalType.LEAVE;
    senderId: string;
    senderName: string;
    targetId: string;
    data: RTCSessionDescriptionInit | RTCIceCandidateInit;
};
export type BroadcastMessage = {
    type: SignalType.USER_LIST;
    data: Array<UserData>;
};

export enum Media {
    AUDIO = 'audio',
    VIDEO = 'video',
    SCREENSHARE = 'screenshare',
}
