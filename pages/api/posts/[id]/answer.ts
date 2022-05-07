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
    body: { answer },
    session: { user },
  } = req

  const post = await client.post.findUnique({
    where: {
      id: +id,
    },
    select: {
      id: true,
    },
  })

  if (!post) return res.status(404).json({ ok: false })

  const newAnswer = await client.answer.create({
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
      answer,
    },
  })

  if (!post) return res.status(404).json({ ok: false, newAnswer })
  if (!newAnswer) return res.status(500).json({ ok: false, newAnswer })
  res.json({ ok: true, newAnswer })
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
)
