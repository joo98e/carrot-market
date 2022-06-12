import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    session: { user },
  } = req

  if (req.method === 'GET') {
    const streams = await client.stream.findMany({})

    res.status(200).json({
      ok: true,
      streams,
    })
  } else if (req.method === 'POST') {
    const { name, price, desc } = req.body
    const stream = await client.stream.create({
      data: {
        name,
        price,
        desc,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    })

    res.status(200).json({
      ok: true,
      stream,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
)
