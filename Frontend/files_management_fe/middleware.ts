import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
    "/login",
    "/register",
    "forgot-password",
]

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthenticated = !!(accessToken || refreshToken);
    const isAuthPage = PUBLIC_ROUTES.includes(pathname);

    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isAuthenticated && !isAuthPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico|images).*)"],
};