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
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  })

  console.log(profile)

  return res.json({
    ok: true,
    profile,
  })
}

export default withIronSessionApiRoute(withHandler('GET', handler), {
  cookieName: 'carrot-session',
  password:
    'sadjlfjoi24jfjfsiaofljkl2487s0fahodsfweofk2i4j2o2iofjosdfklsjf32hllLLSH',
})
