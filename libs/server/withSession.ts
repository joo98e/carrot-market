import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import type { IronSessionOptions } from 'iron-session'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number
    }
  }
}

const cookieOptions: IronSessionOptions = {
  cookieName: 'carrot-session',
  password: process.env.COOKIE_PASSWORD!,
}

// 이곳에서 fn은 withHandler와 아규먼트로 함께 전달 온 http 메소드, 핸들러(서비스 로직) 함수가 들어올 것이다.
export const withApiSession = (fn: any) => {
  return withIronSessionApiRoute(fn, cookieOptions)
}

export const withSsrSession = (handler: any) => {
  return withIronSessionSsr(handler, cookieOptions)
}
