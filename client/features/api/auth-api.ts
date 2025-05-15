"use server";
import {request} from "./base-api";
import {SessionData} from "@/types/session";

export async function signIn(username: string, password: string) {
    return request<SessionData>("/api/auth/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
    });
}

export async function signUp(username: string, password: string) {
    return request<SessionData>("/api/auth/sign-up", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
    });
}

export async function refreshToken(refreshToken: string) {
    return request<SessionData>("/api/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshToken}`
        }
    });
}

export async function signOut(refreshToken: string) {
    return request("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshToken}`
        },
    });
}





