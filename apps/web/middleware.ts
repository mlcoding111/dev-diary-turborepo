import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
	// 1. Check if route is protected
	const protectedRoutes = ["/dashboard"];
	const currentPath = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(currentPath);

	if (isProtectedRoute) {
		// 2. Check for valid session
		const cookie = (await cookies()).get("session")?.value;
		const session = await decrypt(cookie ?? "");

		// 3. If no session, redirect to login
		if (!session?.userId) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		// 4. Render route
		return NextResponse.next();
	}

	// 5. If route is not protected, render route
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
