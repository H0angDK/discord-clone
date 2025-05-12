import { z } from "zod";

export const SigninFormSchema = z.object({
  username: z.string().nonempty({ message: "Username is required." }).trim(),
  password: z.string().nonempty({ message: "Password is required." }).trim(),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export enum Field {
  Username = "username",
  Password = "password",
}
