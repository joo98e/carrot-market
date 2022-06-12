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
    body,
    session: { user },
  } = req

  const message = await client.message.create({
    data: {
      message: body.message,
      stream: {
        connect: {
          id: +id.toString(),
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  })

  console.log(message)
  res.status(200).json({
    ok: true,
    message,
  })
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
)
