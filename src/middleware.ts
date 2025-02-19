import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If at root path and not authenticated, redirect to login
  if (req.nextUrl.pathname === '/') {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If no session and trying to access protected routes
  if (!session && (
    req.nextUrl.pathname.startsWith('/internal') ||
    req.nextUrl.pathname.startsWith('/external')
  )) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access login page, redirect to appropriate dashboard
  if (session && req.nextUrl.pathname === '/login') {
    const { data: userData } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', session.user.id)
      .single()

    // Admin users are redirected to internal dashboard
    let redirectPath = '/external/dashboard'
    if (userData?.user_type === 'admin' || userData?.user_type === 'internal') {
      redirectPath = '/internal/dashboard'
    }
      
    const redirectUrl = new URL(redirectPath, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}
