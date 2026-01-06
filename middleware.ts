import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create the initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Setup Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Check Session (getUser is safer than getSession for middleware)
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // --- THE FIX: INTELLIGENT ROUTING ---

  // SCENARIO A: User is NOT logged in
  if (!user) {
    // If they try to go to the Dashboard (or any inner admin page), kick them out
    if (path.startsWith('/admin/dashboard')) {
      // Redirect to the Admin Login page (which is just /admin)
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // If they are just going to '/admin', LET THEM PASS so they can log in.
  }

  // SCENARIO B: User IS logged in
  if (user) {
    // If they try to go to the Login page, forward them to Dashboard
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  // Run this middleware on all admin routes
  matcher: ['/admin/:path*'],
}
