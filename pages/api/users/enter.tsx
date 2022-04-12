import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import mail from '@sendgrid/mail'

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
mail.setApiKey(process.env.SENDGRID_APIKEY!)

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { phone, email } = req.body
  const user = phone ? { phone: phone } : email ? { email } : null

  if (!user) return res.status(400).json({ ok: false })

  const payload = String(Math.random()).substring(2, 8)
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            // 찾을 조건
            ...user,
          },
          create: {
            // 만들 것
            name: payload,
            ...user,
          },
        },
      },
    },
  })

  // twilio는 국제 기업이기 때문에 국가코드(82)를 넣어주어야 한다.

  if (phone) {
    // 트라이얼 아끼기 주석!
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   // to : phone
    //   to: process.env.MY_PHONE_NUMBER!,
    //   body: `Your login token is ${payload}.`,
    // })
  } else if (email) {
    // 트라이얼 아끼기 주석!
    // const email = await mail.send({
    //   from: 'everybeok@naver.com',
    //   // to: email,
    //   to: 'jtbeok@gmail.com',
    //   subject : "Your Carrot Market Verification Email",
    //   text : `Your token is ${payload}`,
    //   html : `<strong>Your token is ${payload}</strong>`
    // });
  }

  return res.json({
    ok: true,
    payload,
  })

  // 위 const token에서 함께 처리(connnectOrCreate)
  // const user = await client.user.upsert({
  //   where: {
  //     // 찾을 조건
  //     ...payload,
  //   },
  //   create: {
  //     // 만들 것
  //     name: 'Anonymous',
  //     ...payload,
  //   },
  //   update: {
  //     // 이미 있다면 수정
  //   },
  // })

  // if (email) {
  //   let user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   })
  //   if (user) console.log('found it.')

  //   if (!user) {
  //     console.log('did not find. will create.')
  //     user = await client.user.create({
  //       data: {
  //         name: 'Anonymous',
  //         email,
  //       },
  //     })
  //   }
  // }
  // if (phone) {
  //   let user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     },
  //   })
  //   if (user) console.log('found it.')

  //   if (!user) {
  //     console.log('did not find. will create.')
  //     user = await client.user.create({
  //       data: {
  //         name: 'Anonymous',
  //         phone: +phone,
  //       },
  //     })
  //   }
  // }
}

export default withHandler({
  method: 'POST',
  handler,
  isPrivate: false,
})
