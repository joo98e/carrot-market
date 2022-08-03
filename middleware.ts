import { NextMiddleware, NextRequest, NextResponse } from 'next/server'

export function middleware<NextMiddleware>(request: NextRequest) {
  console.log('is middle ware')
  if (request.nextUrl.pathname.endsWith('/')) {
    // move home
    return NextResponse.redirect(new URL('/home', request.url))
  }
}

export const config = {}
