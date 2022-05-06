import type { NextPage } from 'next'
import Layout from '@components/layout'
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { Product, User } from '.prisma/client'
import Link from 'next/link'
import useMutation from '@libs/client/useMutation'
import { cls } from '@libs/client/utils'
import IconHeartSolid from '@components/icons/heartSolid'
import IconHeart from '@components/icons/heart'

interface ProductWithUser extends Product {
  user: User
}

interface IItemDetailResponse {
  ok: boolean
  product: ProductWithUser
  relatedProducts: Product[]
  isLiked: boolean
}

const ItemDetail: NextPage = () => {
  const router = useRouter()
  const { fallbackData, mutate } = useSWRConfig()
  const { data, mutate: boundMutate } = useSWR<IItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  )
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`)

  const onFavClick = () => {
    if (!data) return false
    boundMutate({ ...data, isLiked: !data.isLiked }, false)

    // 다른 swr의 데이터를 가져온다. 두번째 인자부터 생략하면, refetch가 일어난다.
    // mutate('/api/users', (prev: any) => ({ ...prev }), false)
    toggleFav({})
  }

  return (
    <Layout title="아이템 상세" canGoBack>
      <div className="px-4 py-10">
        <div>
          <div className="h-96 bg-slate-200" />
          <div className="flex border-b mt-1 py-3 items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                {data?.product.user?.name ?? '이름이..'}
              </p>
              <Link href={`/users/profiles/${data?.product.user?.id}`}>
                <a className="text-sm font-medium text-gray-700">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {data?.product.name ?? '이 물건의..'}
            </h1>
            <span className="text-3xl mt-3 text-gray-900">
              ₩{data?.product.price ?? '가격이...'}
            </span>
            <p className="text-base my-6 text-gray-700">
              {data?.product.desc ?? '설명이...'}
            </p>
            <div className="flex items-center justify-between space-x-2">
              {/* 버튼 컴포넌트를 만드는 것이 좋음 */}
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-md shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-medium hover:bg-orange-600 transition-colors">
                Talk to seller
              </button>
              <button
                onClick={onFavClick}
                className={cls(
                  'p-3 flex items-center justify-center rounded-full hover:bg-gray-100',
                  data?.isLiked
                    ? 'text-orange-500 hover:text-orange-600 fill-orange-500'
                    : 'text-gray-400 hover:text-gray-500'
                )}
              >
                {data?.isLiked ? <IconHeartSolid /> : <IconHeart />}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t py-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {data?.relatedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div className="h-56 w-full bg-slate-300" />
                  <h3 className="text-sm text-gray-700 -mb-1">
                    {product.name}
                  </h3>
                  <span className="text-xs font-medium text-gray-700">
                    ₩{product.price}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ItemDetail
