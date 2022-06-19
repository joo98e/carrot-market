import { NextApiRequest, NextApiResponse } from 'next'

export default async function fake(req: NextApiRequest, res: NextApiResponse) {
  // example : file upload
  console.log(req.body)

  return res.status(200).json({
    ok: true,
  })
}
