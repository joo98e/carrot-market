import { NextApiRequest, NextApiResponse } from 'next'

type httpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT'

export interface ResponseType {
  ok: boolean
  [key: string]: any
}

type handler = (req: NextApiRequest, res: NextApiResponse) => void

interface ConfigType {
  methods: httpMethod[]
  handler: handler
  isPrivate?: boolean
}

const withHandler = ({ methods, handler, isPrivate = true }: ConfigType) => {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      console.log(methods)
      // 메소드 에러
      return res.status(405).end()
    }

    if (isPrivate && !req.session.user) {
      // 인증되지 않은 요청
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized.',
      })
    }

    try {
      await handler(req, res)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  }
}

export default withHandler

// 200 success
// 202 success & create
// 400(Bad Request) : 요청 에러
// 401(Unauthorized) : 권한 에러 / 요청자가 누구인지 알 수 없음
// 403(Forbidden) : 권한 에러 / 요청자가 누구인지 알고 있으나 권한에 해당되지 않음
// 405(Method Not Allowed) : 요청한 메서드는 서버에서 알고 있지만, 제거되었거나 사용할 수 없는 메소드
// 500(Internal Server Error) : 서버가 처리 방법을 모르는 상황 / 서버측 에러
