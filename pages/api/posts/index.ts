import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    body: { question },
    session: { user },
  } = req

  if (req.method === 'GET') {
    const {
      query: { latitude, longitude },
    } = req
    // @nextjs 12.2.0 release => legacy
    // const parsedLatitude = parseFloat(latitude.toString())
    // const parsedLongitude = parseFloat(longitude.toString())
    const posts = await client.post.findMany({
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            wonderings: true,
            answers: true,
          },
        },
      },
      // @nextjs 12.2.0 release => legacy
      // where: {
      //   latitude: {
      //     gte: parsedLatitude - 0.01,
      //     lte: parsedLatitude + 0.01,
      //   },
      //   longitude: {
      //     gte: parsedLongitude - 0.01,
      //     lte: parsedLongitude + 0.01,
      //   },
      // },
    })

    res.status(200).json({
      ok: true,
      posts,
    })
  } else if (req.method === 'POST') {
    const {
      body: { latitude, longitude },
    } = req
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    })

    await res.revalidate('/community')

    res.status(200).json({
      ok: true,
      post,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
)
