import { NextRequest, NextResponse } from "next/server";

import { SECONDS_IN_DAY, THEME_COOKIE } from "./lib/types";
import { randomTheme } from "./lib/useTheme";

export function middleware(request: NextRequest) {
  const themeCookie = request.cookies.get(THEME_COOKIE);

  if (!themeCookie) {
    const theme = randomTheme();
    const response = NextResponse.next();

    response.cookies.set(THEME_COOKIE, theme, {
      maxAge: SECONDS_IN_DAY * 7,
      path: "/"
    });

    return response;
  }

  return NextResponse.next();
}
