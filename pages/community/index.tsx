import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import FloatingButton from '@components/floating-button'
import Layout from '@components/layout'
import useSWR from 'swr'
import { Post, User } from '.prisma/client'
import CheckIcon from '@components/icons/CheckIcon'
import AnswerIcon from '@components/icons/AnswerIcon'
import WriteIcon from '@components/icons/WriteIcon'
import useCoords from '@libs/client/useCoords'
import client from '@libs/server/client'

interface PostWithUser extends Post {
  user: User
  _count: {
    answers: number
    wonderings: number
  }
}

interface IPostsResponse {
  ok?: boolean
  posts: PostWithUser[]
}

const Community: NextPage<IPostsResponse> = ({ posts }) => {
  // const { latitude, longitude } = useCoords()
  // const { data } = useSWR<IPostsResponse>(
  //   latitude && longitude ? `/api/posts?latitude=${latitude}&longitude=${longitude}` : null
  // )

  return (
    <Layout hasTabBar title="동네생활">
      <div className="space-y-4">
        {posts.map((post: PostWithUser) => {
          return (
            <Link key={post.id} href={`/community/${post.id}`}>
              <a className="flex flex-col cursor-pointer items-start">
                <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  동네생활
                </span>
                <div className="mt-2 text-gray-700">
                  <span className="text-orange-500 font-medium">Q.</span>
                  {post.question}
                </div>
                <div className="mt-5 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                  <span>{post.user.name}</span>
                  <span>{post.createdAt}</span>
                </div>
                <div className="flex space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px] w-full">
                  <span className="flex space-x-2 items-center text-sm">
                    <CheckIcon />
                    <span>궁금해요 {1}</span>
                    {/* <span>궁금해요 {post._count.wonderings}</span> */}
                  </span>
                  <span className="flex space-x-2 items-center text-sm">
                    <AnswerIcon />
                    <span>답변 {1}</span>
                    {/* <span>답변 {post._count.answers}</span> */}
                  </span>
                </div>
              </a>
            </Link>
          )
        })}
        <FloatingButton href="/community/write">
          <WriteIcon />
        </FloatingButton>
      </div>
    </Layout>
  )
}

export default Community

export async function getStaticProps<GetStaticProps>() {
  console.log('BUILDING COMM. statically.')
  const posts = await client.post.findMany({ include: { user: true } })

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  }
}
