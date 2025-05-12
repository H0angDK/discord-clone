"use server";
import {redirect} from "next/navigation";
import {Field, FormState, SignupFormSchema} from "./types";
import {setSession} from "@/features/session/server";
import {httpClient} from "@/features/http-client";
import {SessionData} from "@/types/session";

export async function signUpAction(_: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get(Field.Username),
        confirmPassword: formData.get(Field.ConfirmPassword),
        password: formData.get(Field.Password),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const {data, error} = await httpClient<SessionData>("/api/auth/sign-up", {
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
        }
    }

    await setSession(data);

    return redirect("/");
}
