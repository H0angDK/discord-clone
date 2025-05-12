import clsx from "@/features/clsx";
import {useChat} from "@/features/context/chat-context";
import type {Message} from "@/types/message";

interface MessageProps {
    message: Message;
}

export const MessageItem = ({message}: MessageProps) => {
    const {user} = useChat();
    const isCurrentUser = message.senderId === user.id;

    return (
        <div
            className={clsx("flex", isCurrentUser ? "justify-end" : "justify-start")}
        >
            <div
                className={clsx(
                    "rounded-2xl p-3 text-sm",
                    "transition-colors duration-200 ease-in-out",
                    "inline-block max-w-[45%]",
                    isCurrentUser
                        ? "bg-primary/80 text-primary-foreground rounded-br-none"
                        : "bg-secondary/70 text-secondary-foreground rounded-bl-none",
                    "break-words whitespace-pre-wrap"
                )}
            >
                <div className="flex flex-col">
                    {!isCurrentUser && (
                        <span className="text-xs font-semibold text-text-secondary mb-1">
              {user.username || "Anonymous"}
            </span>
                    )}
                    <p className="break-words text-text-primary">{message.content}</p>
                    <span
                        className={clsx(
                            "text-xs mt-1 self-en",
                            isCurrentUser ? "text-text-secondary" : "text-text-tertiary"
                        )}
                    >
            {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "2-digit",
                year: "numeric",
            })}
          </span>
                </div>
            </div>
        </div>
    );
};
