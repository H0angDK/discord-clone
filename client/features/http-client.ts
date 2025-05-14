"use server";
import {ErrorApi} from "@/types/error-api";
import {getSession, setSession} from "@/features/session/server";


type Method = "GET" | "POST" | "PUT" | "DELETE";

interface HttpClient extends RequestInit {
    method?: Method;
}

const BASE_URL = process.env.API_URL || "http://localhost:8080";

export async function httpClient<T>(url: string, args: HttpClient) {
    const {method, ...other} = args;

    const config: HttpClient = {
        ...other,
        method: method || "GET",
    }


    const session = await getSession();

    if (session) {
        if (session.expiredIn < Date.now()) {
            const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.refreshToken}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            await setSession(await response.json());
        }

        config.headers = {
            ...config.headers,
            "Authorization": `Bearer ${session.accessToken}`
        }
    }


    try {
        const response = await fetch(`${BASE_URL}${url}`, config);

        if (!response.ok) {
            const error = await response.json() as ErrorApi;
            return {
                error: error.message,
                data: undefined as T,
                isOk: false
            }
        }
        return {
            data: await response.json() as T,
            error: null,
            isOk: true
        }
    } catch (err) {
        return {
            error: err instanceof Error ? err.message : "Failed to fetch data",
            data: undefined as T,
            isOk: false
        }
    }
}