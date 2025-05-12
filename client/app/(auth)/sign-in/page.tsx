import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/features/session/server";
import { redirect, RedirectType } from "next/navigation";

export default async function SignIn() {
  if (await getSession()) {
    redirect("/", RedirectType.replace);
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-100">
      <SignInForm />
    </div>
  );
}
