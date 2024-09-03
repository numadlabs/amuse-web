import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // List of paths that don't require authentication
    const publicPaths = [
      "/",
      "/auth/sign-up",
      "/auth/forgot-password",
      "/privacy-policy",
      "/faq",
    ];

    if (publicPaths.includes(pathname)) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
);

// Update the matcher to include all routes except the specified ones
export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*|auth/sign-up|auth/forgot-password|privacy-policy|faq).*)",
  ],
};
