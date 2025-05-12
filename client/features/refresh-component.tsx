"use client"
import {useEffect} from 'react';
import {useRouter} from "next/navigation";


interface RefreshComponentProps {
    revalidateFn?: () => void;
    timer: number;
}

export function RefreshComponent({revalidateFn, timer}: RefreshComponentProps) {
    const router = useRouter();
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, timer);

        return () => clearInterval(interval);
    }, []);

    return null;
}