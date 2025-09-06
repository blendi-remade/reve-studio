import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    // Allow access to static assets and API routes
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname === '/favicon.ico' ||
      pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
    ) {
      return response;
    }

    // Create Supabase client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Define auth rules
    const isAuthRoute = pathname === '/' || pathname.startsWith('/auth');
    const isProtectedRoute = pathname.startsWith('/feed') || pathname.startsWith('/post');

    // If user is authenticated
    if (user) {
      // Redirect from auth pages to feed
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/feed', request.url));
      }
      // Allow access to protected routes
      return response;
    }

    // If user is NOT authenticated
    if (!user) {
      // Allow access to auth pages
      if (isAuthRoute) {
        return response;
      }
      // Redirect from protected routes to home
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (e) {
    console.error('Auth middleware error:', e);
    // In case of error, allow the request
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};