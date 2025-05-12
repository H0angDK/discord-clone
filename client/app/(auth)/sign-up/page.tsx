import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSession } from "@/features/session/server";
import { redirect, RedirectType } from "next/navigation";

export default async function SignUp() {
  if (await getSession()) {
    redirect("/", RedirectType.replace);
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-100">
      <SignUpForm />
    </div>
  );
}
