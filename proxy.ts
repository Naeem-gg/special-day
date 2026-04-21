import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth-utils";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Exclude login page from protection
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const session = request.cookies.get("admin_session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await decrypt(session);
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const session = request.cookies.get("admin_session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await decrypt(session);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
