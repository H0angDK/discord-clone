"use server";

import {deleteSession, getSession} from "@/features/session/server";
import {redirect} from "next/navigation";
import {authAPI} from "@/features/api";

export async function logout() {
    const session = await getSession();
    if (session) {
        await authAPI.signOut(session.refreshToken);
    }
    await deleteSession();
    return redirect("/sign-in");
}
