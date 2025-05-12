"use server";

import { deleteSession } from "@/features/session/server";
import { redirect } from "next/navigation";

export async function logout() {
  await deleteSession();
  return redirect("/sign-in");
}
