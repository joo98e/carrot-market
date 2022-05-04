import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
  } = req
  const product = await client.product.findUnique({
    where: { id: +id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word,
    },
  }))

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: +id,
        userId: user?.id,
      },
      // 좀 더 적은 트래픽을 사용하기 위해, id를 통해 있는지의 여부"만" 확인
      select: {
        id: true,
      },
    })
  )

  res.json({ ok: true, product, isLiked, relatedProducts })
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
)
