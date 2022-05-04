import { NextApiRequest, NextApiResponse } from 'next'
import client from '@libs/server/client'
import { withApiSession } from '@libs/server/withSession'
import withHandler, { ResponseType } from '@libs/server/withHandler'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
  } = req

  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: +id,
      userId: user?.id,
    },
  })

  if (alreadyExists) {
    // delete는 unique 필드로만 삭제가 가능하다.
    // unique 필드가 아닌 것을 삭제하기 위해서는 deleteMany를 사용할 수 있다.
    await client.fav.delete({
      where: {
        id: alreadyExists.id,
      },
    })
  } else {
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id,
          },
        },
      },
    })
  }
  res.json({ ok: true })
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
)
