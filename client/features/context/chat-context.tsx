"use client";
import {createContext, ReactNode, useContext, useEffect, useRef, useState,} from "react";
import {Message} from "@/types/message";
import {SessionData} from "@/types/session";

interface ChatContextType {
    sendMessage: (content: string) => void;
    isConnected: boolean;
    messages: Message[];
    user: {
        id: string;
        username: string;
    };
    roomId: string;
    reconnect: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
    roomId: string;
    session: SessionData;
}

const WS_URL = process.env.WS_URL || "ws://localhost:8080";

export const ChatProvider = ({
                                 children,
                                 roomId,
                                 session,
                             }: ChatProviderProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState({
        id: "",
        username: "",
    });
    const socketRef = useRef<WebSocket | null>(null);

    const reconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setIsConnected(false);
    };

    useEffect(() => {
        setUser({
            id: session.userId,
            username: session.username,
        });
        const query = new URLSearchParams({
            roomId,
            userId: session.userId,
        });

        const socket = new WebSocket(`${WS_URL}/chat?${query.toString()}`);

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connection opened");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data) as Message;
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
            reconnect();
        };

        return () => {
            socket.close();
        };
    }, [roomId, session.userId, session.username]);

    const sendMessage = (content: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(content);
        } else {
            console.error(
                "WebSocket is not open. Ready state:",
                socketRef.current?.readyState
            );
        }
    };

    return (
        <ChatContext
            value={{sendMessage, isConnected, messages, user, roomId, reconnect}}
        >
            {children}
        </ChatContext>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
