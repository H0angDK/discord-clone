import "server-only";
import {cookies} from "next/headers";
import {SessionData} from "@/types/session";
import {revalidateTag} from "next/cache";

const SESSION_SECRET = process.env.SESSION_SECRET || "salt";

//const production = process.env.NODE_ENV === "production";

async function getKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SESSION_SECRET);

    const hashedKeyData = await crypto.subtle.digest("SHA-256", keyData);

    return await crypto.subtle.importKey(
        "raw",
        hashedKeyData,
        {name: "AES-GCM"},
        false,
        ["encrypt", "decrypt"]
    );
}

async function encrypt(payload: SessionData): Promise<string> {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(payload));

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    const combined = new Uint8Array([...iv, ...new Uint8Array(encryptedData)]);
    return Buffer.from(combined).toString("base64");
}

async function decrypt(data: string | undefined): Promise<SessionData | null> {
    if (!data) return null;

    const key = await getKey();
    const combined = Buffer.from(data, "base64");
    const iv = combined.subarray(0, 12);
    const encryptedData = combined.subarray(12);

    try {
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encryptedData
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decryptedData)) as SessionData;
    } catch (error) {
        console.error("Failed to decrypt session:", error);
        return null;
    }
}

export async function setSession(data: SessionData) {
    try {
        const session = await encrypt(data);
        const cookieStore = await cookies();

        cookieStore.set("session", session, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
    } catch (error) {
        console.error("Failed to create session:", error);
        throw error;
    }
}

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        return await decrypt(session);
    } catch (error) {
        console.error("Failed to get session:", error);
        throw error;
    }
}

export async function deleteSession() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("session");
        revalidateTag("session")
    } catch (error) {
        console.error("Failed to delete session:", error);
        throw error;
    }
}
