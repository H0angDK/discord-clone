"use server";
import {redirect} from "next/navigation";
import {Field, FormState, SignupFormSchema} from "./types";
import {setSession} from "@/features/session/server";
import {authAPI} from "@/features/api";

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

    const {data, error} = await authAPI.signUp(validatedFields.data.username, validatedFields.data.password);

    if (error) {
        return {
            message: error,
        }
    }

    await setSession(data);

    return redirect("/");
}
