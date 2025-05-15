"use server";
import {Field, FormState, SigninFormSchema} from "./types";
import {setSession} from "@/features/session/server";
import {authAPI} from "@/features/api";

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

    const {data, error} = await authAPI.signIn(validatedFields.data.username, validatedFields.data.password);

    if (error) {
        return {
            message: error,
        };
    }

    await setSession(data);

    return {};
}
