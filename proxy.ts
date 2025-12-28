import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__Secure-better-auth.session_token");

  const isAuthPage = request.nextUrl.pathname === "/";
  const isDashboardPage = request.nextUrl.pathname.startsWith("/budgets");

  if (!sessionCookie && isDashboardPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/budgets", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/budgets/:path*"],
};
