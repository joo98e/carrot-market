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
    const { page = 0 } = req.query
    const streamCount = await client.stream.count()
    const streams = await client.stream.findMany({
      take: Number(process.env.API_GET_UNIT_COUNT) ?? 5,
      orderBy: {
        createdAt: 'desc',
      },
      skip: +page * Number(process.env.NEXT_PUBLIC_PAGINATION_UNIT) ?? 5,
    })

    res.status(200).json({
      ok: true,
      streams,
      streamCount,
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
