import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  if (req.method === 'GET') {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
      },
    })
    res.json({
      ok: true,
      products,
    })
  } else if (req.method === 'POST') {
    const {
      body: { name, price, desc, photoId },
      session: { user },
    } = req

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        desc,
        image: photoId ? photoId : 'xx',
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    })

    res.json({
      ok: true,
      product,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
)
