"use client";

import {useActionState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {NavLink} from "../ui/nav-link";
import {Field, signUpAction} from "@/actions/sign-up";

export function SignUpForm() {
    const [state, formAction, isPending] = useActionState(
        signUpAction,
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
                />

                <Input
                    error={
                        state?.errors?.password && (
                            <>
                                <p>Password must:</p>
                                <ul>
                                    {state.errors.password.map((error) => (
                                        <li key={error}>- {error}</li>
                                    ))}
                                </ul>
                            </>
                        )
                    }
                    name={Field.Password}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                />

                <Input
                    error={state?.errors?.confirmPassword}
                    name={Field.ConfirmPassword}
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                />


                {state?.message && (
                    <p className="text-sm text-error text-center">{state?.message}</p>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isPending}
                >
                    Sign Up
                </Button>

                <p className="text-sm text-center text-text-secondary">
                    Already have an account?{" "}
                    <NavLink href={"/sign-in"} className="hover:underline">
                        Sign In
                    </NavLink>
                </p>
            </form>
        </>
    );
}
