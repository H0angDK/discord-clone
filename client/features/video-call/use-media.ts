import {useCallback, useEffect, useState} from "react";

interface MediaStreamHook {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    error: string | null;
    setRemoteStream: (stream: MediaStream | null) => void;
}

// Custom media stream hook
export const useMediaStream = (): MediaStreamHook => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
        } catch (err) {
            setError('Failed to access media devices');
            console.error('Media device error:', err);
        }
    }, []);

    useEffect(() => {
        getLocalStream();
        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [getLocalStream, localStream]);

    return { localStream, remoteStream, error, setRemoteStream };
};