import withHandler, { ResponseType } from '@libs/server/withHandler'
import client from '@libs/server/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiSession } from '@libs/server/withSession'
import { writeFileSync } from 'fs'
import { itostr } from '@libs/client/utils'
import moment from 'moment'

interface IBody {
  subject: string
  content: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  // 작성
  if (req.method === 'POST') {
    const { subject, content }: IBody = req.body

    if (!subject || !content || !req.session?.user) {
      return res.status(400).json({
        ok: false,
      })
    }

    const blog = await client.blog.create({
      data: {
        subject,
        content,
        user: {
          connect: {
            id: req.session?.user?.id,
          },
        },
      },
    })

    writeFileSync(
      `${process.env.PWD}/posts/posts-${itostr(blog.id)}-${subject}.md`,
      `---\ntitle : ${subject}\ndate: ${moment(blog.createAt).format('yyyy.MM.DD')}\ncategory: md\nuserId : ${req.session.user.id}\n---\n# ${subject}\n${content}`
    )

    await res.revalidate('/blog')

    return res.status(200).json({
      ok: true,
      blog,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
    isPrivate: false,
  })
)
