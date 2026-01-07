import { NextRequest, NextResponse } from "next/server";

import {
  SECONDS_IN_DAY,
  Theme,
  THEME_COOKIE,
  Themes,
  USER_COOKIE
} from "./lib/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  // Ensure a theme cookie is set for styling
  const themeCookie = request.cookies.get(THEME_COOKIE);
  if (!themeCookie || !Themes.includes(themeCookie.value as Theme)) {
    const theme = Themes[Math.floor(Math.random() * Themes.length)];
    response.cookies.set(THEME_COOKIE, theme, {
      maxAge: SECONDS_IN_DAY * 7,
      path: "/"
    });
  }

  const hasToken = request.cookies.get(USER_COOKIE);
  if (pathname !== "/login") {
    if (!hasToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } else if (hasToken) {
    const indexURL = new URL("/", request.url);
    return NextResponse.redirect(indexURL);
  }

  return response;
}

// Limit middleware to pages and exclude static assets/Next internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"]
};
