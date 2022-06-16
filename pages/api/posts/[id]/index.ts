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
        // take: 10,
        // skip: 0,
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

  const isWondering = Boolean(
    await client.wondering.findFirst({
      where: {
        userId: user?.id,
        postId: post?.id,
      },
      select: {
        id: true,
      },
    })
  )

  if (!post) return res.status(404).json({ ok: false, post: undefined })

  res.json({ ok: true, post, isWondering })
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
)
