"use client";
import {ArrowIcon} from "../icon";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";
import {useRef} from "react";

interface FooterProps {
    addMessageAction: (message: string) => void;
}

export function Footer({addMessageAction}: FooterProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const content = formData.get("message") as string;
        addMessageAction(content);
        inputRef.current!.value = "";
    };

    return (
        <footer className="bg-surface-200 w-full sticky bottom-0 z-10">
            <form
                action={handleSubmit}
                className="h-full w-full flex flex-col justify-end relative"
            >
                <Textarea
                    ref={inputRef}
                    rows={1}
                    className="min-h-16 max-h-52"
                    variant="primary"
                    placeholder="Enter message..."
                    name="message"
                />
                <Button
                    type="submit"
                    variant="primary"
                    className="absolute right-2 bottom-2 h-10 w-10 p-2 hover:scale-105 transition-transform"
                >
                    <ArrowIcon className="size-5"/>
                </Button>
            </form>
        </footer>

    );
}
