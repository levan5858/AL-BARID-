import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Force HTTPS in production
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT
  
  if (isProduction) {
    const url = request.nextUrl.clone()
    const hostname = request.headers.get('host') || url.hostname
    
    // Check if request is HTTP (not HTTPS)
    // Railway and most platforms use x-forwarded-proto header
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isHttp = forwardedProto === 'http' || 
                   url.protocol === 'http:' ||
                   (!forwardedProto && !request.url.startsWith('https://'))
    
    if (isHttp) {
      // Force HTTPS redirect
      url.protocol = 'https:'
      url.hostname = hostname
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
    
    // Add security headers
    const response = NextResponse.next()
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
