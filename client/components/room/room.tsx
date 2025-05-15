"use client";
import {useEffect, useOptimistic, useRef} from "react";
import {Message} from "@/types/message";
import {Header} from "./header/header";
import {MessageList} from "./message/message-list";
import {Footer} from "./footer";
import {useChat} from "@/features/context/chat-context";

export const Room = () => {
    const {messages, sendMessage, user, roomId} = useChat();
    const [optimisticMessages, setOptimisticMessage] = useOptimistic(
        messages,
        (state, newMessage: Message) => [...state, newMessage]
    );

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [optimisticMessages]);

    const addOptimisticMessage = (content: string) => {
        const message: Message = {
            content,
            senderId: user.id,
            roomId,
            createdAt: Date.now(),
        };

        setOptimisticMessage(message);
        sendMessage(content);
    };

    return (
        <section className="h-full flex flex-col justify-between">
            <Header/>
            <MessageList messages={optimisticMessages} ref={containerRef}/>
            <Footer addMessageAction={addOptimisticMessage}/>
        </section>
    );
};
