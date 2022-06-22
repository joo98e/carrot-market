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
  result?: ICFResponse
  messages?: string
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) => {
  const response: ICFResponse = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/images/v2/direct_upload`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLOUD_FLARE_TOKEN}`,
        },
        method: 'POST',
      }
    )
  ).json()

  if (!response || !response.result.uploadURL) {
    res.status(500).json({
      ok: false,
      messages:
        '클라우드 플레어 DCU(Direct Creator Upload) 생성에 실패했습니다.',
    })
  } else {
    res.status(200).json({
      ok: true,
      ...response.result,
    })
  }

  // 연습용
  // const ip: IIpIoResponse = await (
  //   await fetch(`https://ipinfo.io/?token=${process.env.IPIO_TOKEN}`)
  // ).json()

  // if (ip) {
  //   res.status(200).json({
  //     ok: true,
  //     result: { ...ip },
  //   })
  // } else {
  //   res.status(500).json({
  //     ok: false,
  //     messages: 'API 요청에 실패하였습니다.',
  //   })
  // }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
)
