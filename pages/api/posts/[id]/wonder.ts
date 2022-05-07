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
  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +id,
    },
  })
  if (alreadyExists) {
    await client.wondering.delete({
      where: {
        id: alreadyExists.id,
      },
    })
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
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
