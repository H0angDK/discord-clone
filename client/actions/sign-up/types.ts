import { z } from "zod";

export const SignupFormSchema = z
  .object({
    username: z.string().nonempty({ message: "Username is required." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long. " })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter. " })
      .regex(/[0-9]/, { message: "Contain at least one number. " })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character. ",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export enum Field {
  Username = "username",
  Password = "password",
  ConfirmPassword = "confirmPassword",
}
