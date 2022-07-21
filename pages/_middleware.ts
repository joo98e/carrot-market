import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Plz don't be a bot. Be human", {
      status: 403,
    })
  }

  //   if (req.geo?.city === 'Seoul') {
  //     // localhost 에서는 작동이 잘 되지 않는다.
  //     console.log(req.geo.city)
  //     console.log(req.geo.country)
  //     console.log(req.geo.region)
  //     console.log(req.geo.latitude, req.geo.longitude)
  //   }

  if (!req.url.includes('/api')) {
    if (!req.url.includes('enter') && !req.cookies['carrot-session']) {
      const url = req.nextUrl.clone()
      url.pathname = '/enter'
      return NextResponse.rewrite(url)
    }
  }
}
