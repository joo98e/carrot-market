import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { id } = req.query

  const stream = await client.stream.findUnique({
    where: {
      id: +id.toString(), // why?
    },
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  })

  console.log(stream)

  //   모든 로직에는 예외 처리가 필요하지만 하지 않고 있다는 점을 생각하자.
  if (!stream) {
    return res.status(404).json({
      ok: false,
      stream: null,
    })
  } else {
    //   찾았음
    res.status(200).json({
      ok: true,
      stream,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
)
