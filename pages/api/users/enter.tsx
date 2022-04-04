import withHandler from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { phone, email } = req.body
  const payload = phone ? { phone: +phone } : { email }

  //   if (email) {
  //     let user = await client.user.findUnique({
  //       where: {
  //         email,
  //       },
  //     })
  //     if (user) console.log('found it.')

  //     if (!user) {
  //       console.log('did not find. will create.')
  //       user = await client.user.create({
  //         data: {
  //           name: 'Anonymous',
  //           email,
  //         },
  //       })
  //     }
  //   }

  //   if (phone) {
  //     let user = await client.user.findUnique({
  //       where: {
  //         phone: +phone,
  //       },
  //     })
  //     if (user) console.log('found it.')

  //     if (!user) {
  //       console.log('did not find. will create.')
  //       user = await client.user.create({
  //         data: {
  //           name: 'Anonymous',
  //           phone: +phone,
  //         },
  //       })
  //     }
  //   }

  const user = await client.user.upsert({
    where: {
      // 찾을 조건
      ...payload,
    },
    create: {
      // 만들 것
      name: 'Anonymous',
      ...payload,
    },
    update: {
      // 이미 있다면 수정
    },
  })

  console.log(user)

  return res.status(200).end()
}

export default withHandler('POST', handler)
