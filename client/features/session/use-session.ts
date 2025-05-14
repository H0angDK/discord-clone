// hooks/use-session.ts
"use client";

import {useCallback, useEffect, useState} from "react";
import type {SessionData} from "@/types/session";

export function useSession() {
    const [session, setSessionState] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getSession = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/session", {
                next: {
                    tags: ["session"],
                },
            });

            if (!response.ok) throw new Error("Failed to fetch session");

            const data = await response.json();
            setSessionState(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch session");
            setSessionState(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getSession();
    }, [getSession]);

    const setSession = useCallback(async (sessionData: SessionData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sessionData),
                cache: "force-cache",
            });

            if (!response.ok) throw new Error("Failed to set session");

            const data = await response.json();
            setSessionState(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to set session");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteSession = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/session", {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete session");

            setSessionState(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete session");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        session,
        isLoading,
        error,
        setSession,
        deleteSession,
        signedIn: !!session?.userId,
        refresh: getSession,
    };
}
