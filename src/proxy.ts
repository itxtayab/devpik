import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    let needsRedirect = false;

    // Redirect non-www to www (production only)
    if (url.hostname === "devpik.com") {
        url.hostname = "www.devpik.com";
        needsRedirect = true;
    }

    // Remove trailing slash (except root "/")
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
        url.pathname = url.pathname.replace(/\/+$/, "");
        needsRedirect = true;
    }

    if (needsRedirect) {
        return NextResponse.redirect(url, 301);
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
    ],
};
