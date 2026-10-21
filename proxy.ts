import { NextResponse, type NextRequest } from "next/server";
import { locales, matchLocale } from "@/lib/i18n";

// Sends paths without a locale to the best match from Accept-Language.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  const locale = matchLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip API routes, Next internals, files with an extension
    // (favicon.ico, sitemap.xml, robots.txt…) and metadata image routes.
    "/((?!api|_next|icon|apple-icon|opengraph-image|twitter-image|manifest|.*\\..*).*)",
  ],
};
