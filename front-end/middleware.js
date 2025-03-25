import { NextResponse } from "next/server";
import { getProfile } from "./app/utils/utils";
import { setSession } from "./app/utils/session";

export const middleware = async (request) => {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;
    
    if (token) {
        // Verify token
        const { success, user = "" } = await getProfile(token);
    
        // Kiểm tra quyền truy cập vào /users và /lists
        if (!success && (pathname.startsWith("/campaigns") || pathname.startsWith("/lists"))) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    
        setSession(token, user);
    } else if (pathname.startsWith("/campaigns") || pathname.startsWith("/lists")) {
        // Nếu không có token và đang truy cập vào /users hoặc /lists
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

};

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
  };
