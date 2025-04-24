import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
})

const isPageRoute = createRouteMatcher(['/(zh|en)/(.*)/ticket(.*)'])
const isRootRoute = createRouteMatcher(['/zh', '/en'])
const isAPIRoute = createRouteMatcher(['/api(.*)', '/trpc(.*)'])
export default clerkMiddleware(async (auth, req) => {
  const authData = await auth()
  if (isAPIRoute(req)) {
    if (!authData.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }
  // console.log('authData', authData)
  if (isPageRoute(req)) {
    if (!authData.userId) {
      return NextResponse.redirect(new URL('/zh', req.url))
    }
  } else if (isRootRoute(req)) {
    if (authData.userId) {
      return NextResponse.redirect(
        new URL(
          `${req.nextUrl.pathname}/${authData.orgSlug}/ticket/list`,
          req.url
        )
      )
    }
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // 添加国际化路由匹配
    '/(zh|en)/:path*',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
