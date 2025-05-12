"use server";
import {Field, FormState, SigninFormSchema} from "./types";
import {setSession} from "@/features/session/server";
import {httpClient} from "@/features/http-client";
import {SessionData} from "@/types/session";

export async function signInAction(_: FormState, formData: FormData) {
    const validatedFields = SigninFormSchema.safeParse({
        username: formData.get(Field.Username),
        password: formData.get(Field.Password),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const {data, error} = await httpClient<SessionData>("/api/auth/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: validatedFields.data.username,
            password: validatedFields.data.password,
        }),
    });

    if (error) {
        return {
            message: error,
        };
    }

    await setSession(data);

    return {};
}
