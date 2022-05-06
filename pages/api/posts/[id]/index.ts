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

  const post = await client.post.findUnique({
    where: {
      id: +id,
    },
    include: {
      answers: {
        select: {
          id: true,
          answer: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answers: true,
          wonderings: true,
        },
      },
    },
  })

  if (!post) return res.status(404).json({ ok: false, post: undefined })

  res.json({ ok: true, post })
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
)
