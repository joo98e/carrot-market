import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  })

  return res.status(200).json({
    ok: true,
    profile,
  })
}

export default withApiSession(
  withHandler({
    method: 'GET',
    handler,
  })
)
