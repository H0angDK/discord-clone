import type { Message } from "@/types/message";
import { MessageItem } from "./message-item";
import { RefObject } from "react";

interface MessageListProps {
  messages: Message[];
  ref: RefObject<HTMLDivElement | null>;
}

export const MessageList = ({ messages, ref }: MessageListProps) => {
  return (
    <div className="p-4 space-y-4 flex-1 overflow-y-scroll" ref={ref}>
      {messages.map((message) => (
        <MessageItem key={message.id + message.content} message={message} />
      ))}
    </div>
  );
};
