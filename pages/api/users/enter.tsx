import withHandler from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body)

  return res.status(200).end()
}

export default withHandler('POST', handler)
