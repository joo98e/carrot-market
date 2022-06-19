import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'

interface ICFResponse {
  result: {
    id: string
    uploadURL: string
  }
  result_info: any
  success: boolean
  errors: string[]
  messages: string[]
}

export interface IIpIoResponse {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

export interface IResponseType {
  ok: boolean
  result?: IIpIoResponse
  messages?: string
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) => {
  //   const response:ICFResponse = await (
  //     await fetch(
  //       `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/direct_upload`,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${process.env.CF_TOKEN}`,
  //         },
  //       }
  //     )
  //   ).json()

  const ip: IIpIoResponse = await (
    await fetch(`https://ipinfo.io/?token=${process.env.IPIO_TOKEN}`)
  ).json()

  if (ip) {
    res.status(200).json({
      ok: true,
      result: { ...ip },
    })
  } else {
    res.status(500).json({
      ok: false,
      messages: 'API 요청에 실패하였습니다.',
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
)
