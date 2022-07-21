import type { NextPage, NextPageContext } from 'next'
import Link from 'next/link'
import Layout from '@components/layout'
import useUser from '@libs/client/useUser'
import useSWR, { SWRConfig } from 'swr'
import { Review, User } from '.prisma/client'
import BasketIcon from '@components/icons/BasketIcon'
import IconHeart from '@components/icons/heart'
import ShoppingBagIcon from '@components/icons/ShoppingBagIcon'
import { cls } from '@libs/client/utils'
import { withSsrSession } from '@libs/server/withSession'
import client from '@libs/server/client'

interface ReviewWithUser extends Review {
  createdBy: User
}

interface IReviewsResponse {
  ok: boolean
  reviews: ReviewWithUser[]
}

const Profile: NextPage = () => {
  const { user, isLoading } = useUser()
  const { data } = useSWR<IReviewsResponse>(`/api/reviews`)
  return (
    <Layout hasTabBar title="나의 캐럿">
      <div className="px-4">
        <div className="flex items-center mt-4 space-x-3">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="w-16 h-16 bg-slate-500 rounded-full"
              src={`https://imagedelivery.net/PQiTCCXQwNASghVAHpWmhQ/${user?.avatar}/resizeCover`}
              alt={user?.name}
            />
          ) : (
            <div className="w-16 h-16 bg-slate-500 rounded-full" />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {isLoading ? '이름이..' : user?.name ?? '못찾았어 ㅠㅠ'}
            </span>
            <Link href="/profile/edit">
              <a className="text-sm text-gray-700">Edit profile &rarr;</a>
            </Link>
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/sold">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
                <BasketIcon />
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">판매내역</span>
            </a>
          </Link>
          <Link href="/profile/bought">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
                <ShoppingBagIcon />
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">구매내역</span>
            </a>
          </Link>
          <Link href="/profile/loved">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
                <IconHeart />
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">관심목록</span>
            </a>
          </Link>
        </div>
        {data?.reviews.map((review) => {
          return (
            <div className="mt-12" key={review.id}>
              <div className="flex space-x-4 items-center">
                <div className="w-12 h-12 rounded-full bg-slate-500" />
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{review.createdBy.name}</h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      return (
                        <svg
                          key={star}
                          className={cls(
                            'h-5 w-5',
                            review.score >= star ? 'text-yellow-400' : 'text-gray-400 '
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-gray-600 text-sm">
                <p>{review.review}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

const Page: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/users/me': {
            ok: true,
            profile,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  )
}

export const getServerSideProps = withSsrSession(async (ctx: NextPageContext) => {
  /**
   * ctx 안에는 cookie가 있고
   * cookie를 withIronSessionSsr의 cookie-option으로 복호화하고,
   * req.session.user?.id 를 받을 수 있게 도와준다.
   */
  const profile = await client.user.findUnique({
    where: {
      id: ctx.req?.session.user?.id,
    },
  })

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  }
})

export default Page
