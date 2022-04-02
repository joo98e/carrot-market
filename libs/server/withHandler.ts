import { NextApiRequest, NextApiResponse } from 'next'

type httpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT'
type fn = (req: NextApiRequest, res: NextApiResponse) => void

const withHandler = (method: httpMethod, fn: fn) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end();
    }

    try {
        await fn(req, res);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  }
}

export default withHandler

// 400(Bad Request) : 요청 에러
// 401(Unauthorized) : 권한 에러 / 요청자가 누구인지 알 수 없음
// 403(Forbidden) : 권한 에러 / 요청자가 누구인지 알고 있으나 권한에 해당되지 않음
// 405(Method Not Allowed) : 요청한 메서드는 서버에서 알고 있지만, 제거되었거나 사용할 수 없는 메소드
// 500(Internal Server Error) : 서버가 처리 방법을 모르는 상황 / 서버측 에러