import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    // Handle Supabase session update
    const response = await updateSession(request)
    
    // Check if accessing admin routes
    if (request.nextUrl.pathname.startsWith('/admin-dashboard') && 
        !request.nextUrl.pathname.startsWith('/admin-dashboard/login')) {
      
      const adminToken = request.cookies.get('admin-token')
      console.log("Admin Middleware - checking admin token:", !!adminToken)
      
      if (!adminToken) {
        console.log("Admin Middleware - redirecting to login")
        return NextResponse.redirect(new URL('/admin-dashboard/login', request.url))
      }
    }
    
    return response
  } catch (error) {
    console.log("[v0] Middleware error:", error)
    // Return a basic response if middleware fails
    return new Response(null, { status: 200 })
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
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}