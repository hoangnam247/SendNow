import { NextResponse } from "next/server";
import { getProfile } from "./app/utils/utils";
import { setSession } from "./app/utils/session";

// Danh sách các route cần bảo vệ
const protectedRoutes = [
  "/campaigns",
  "/lists",
  // Thêm các route khác cần bảo vệ tại đây
];

export const middleware = async (request) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Bỏ qua các route công khai
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Kiểm tra các route bảo vệ
  if (!token) {
    // Lưu URL hiện tại để redirect lại sau khi login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { success, user } = await getProfile(token);
    
    if (!success) {
      // Token không hợp lệ - xóa cookie và redirect
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // Thiết lập session nếu cần

    // Kiểm tra role nếu cần
    // if (user.role !== 'admin' && pathname.startsWith("/admin")) {
    //   return NextResponse.redirect(new URL("/unauthorized", request.url));
    // }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("token");
    return response;
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     * - auth (login/register pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth).*)',
  ],
};