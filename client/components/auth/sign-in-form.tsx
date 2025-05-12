"use client";

import {useActionState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {NavLink} from "../ui/nav-link";
import {Field, signInAction} from "@/actions/sign-in";

export function SignInForm() {
    const [state, formAction, isPending] = useActionState(
        signInAction,
        undefined
    );
    return (
        <>
            <form
                className="w-full max-w-md p-8 space-y-6 bg-surface-50 rounded-lg shadow-lg"
                action={formAction}
            >
                <h1 className="text-2xl font-bold text-center text-text-primary">
                    Sign In
                </h1>

                <Input
                    error={state?.errors?.username}
                    name={Field.Username}
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    defaultValue={"!user12345"}
                />

                <Input
                    error={state?.errors?.password}
                    name={Field.Password}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    defaultValue={"!user12345"}
                />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isPending}
                >
                    Sign In
                </Button>

                {state?.message && (
                    <p className="text-sm text-error text-center">{state?.message}</p>
                )}

                <p className="text-sm text-center text-text-secondary">
                    Don't have an account?{" "}
                    <NavLink href={"/sign-up"} className="hover:underline">
                        Sign Up
                    </NavLink>
                </p>
            </form>
        </>
    );
}
