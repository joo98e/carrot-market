import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number
    }
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { token } = req.body
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
  })

  if (!exists) return res.status(404).end()

  req.session.user = {
    id: exists.userId,
  }

  await req.session.save()

  return res.status(200).end()
}

export default withIronSessionApiRoute(withHandler('POST', handler), {
  cookieName: 'carrot-session',
  password:
    'sadjlfjoi24jfjfsiaofljkl2487s0fahodsfweofk2i4j2o2iofjosdfklsjf32hllLLSH',
})
