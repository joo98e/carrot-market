import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    })

    return res.status(200).json({
      ok: true,
      profile,
    })
  }

  if (req.method === 'POST') {
    const {
      session: { user },
      body: { email, phone, name, avatarId },
    } = req

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        id: true,
        email: true,
        phone: true,
      },
    })

    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      )

      if (alreadyExists) {
        return res.status(200).json({
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        })
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      })
    }

    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      )

      if (alreadyExists) {
        return res.status(200).json({
          ok: false,
          error: '이미 존재하는 번호입니다.',
        })
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      })
    }

    if (name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      })
    }

    if (avatarId) {
      console.log(avatarId)
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        },
      })
    }

    res.status(200).json({
      ok: true,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
)
