import { NextApiRequest, NextApiResponse } from 'next'
import client from '../../libs/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    await client.user.create({
        data : {
            name : "hi",
            email : "hi"
        }
    });

    return res.status(200).json({
        ok : true,
        data : "11"
    })
}

export default handler
