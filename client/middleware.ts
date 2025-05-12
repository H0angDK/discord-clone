import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/features/session/server";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/sign-in", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/rooms/:path*", "/settings"],
};
