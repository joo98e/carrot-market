import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Layout from '@components/layout'
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { Product, User } from '.prisma/client'
import Link from 'next/link'
import useMutation from '@libs/client/useMutation'
import { cls } from '@libs/client/utils'
import IconHeartSolid from '@components/icons/heartSolid'
import IconHeart from '@components/icons/heart'
import Image from 'next/image'
import client from '@libs/server/client'

interface ProductWithUser extends Product {
  user: User
}

interface IItemDetailResponse {
  ok: boolean
  product: ProductWithUser
  relatedProducts: Product[]
  isLiked: boolean
}

const ItemDetail: NextPage<IItemDetailResponse> = ({ product, relatedProducts, isLiked }) => {
  const router = useRouter()
  const { fallbackData, mutate } = useSWRConfig()
  const { data, mutate: boundMutate } = useSWR<IItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  )
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`)

  const onFavClick = () => {
    if (!data) return false
    // false를 하는 이유 : 로컬 상태를 유지하기 위해(검증을 위한 swr의 재요청으로 인해 다시 돌아와버리기 때문)
    // 반드시 api가 이루어진다는 가정 하에 정확한 ui가 될 것 같음.
    boundMutate({ ...data, isLiked: !data.isLiked }, false)

    // 다른 swr의 데이터를 가져온다. 두번째 인자부터 생략하면, refetch가 일어난다.
    // mutate('/api/users', (prev: any) => ({ ...prev }), false)
    toggleFav({})
  }

  return (
    <Layout title="아이템 상세" canGoBack>
      <div className="px-4 py-10">
        <div>
          {product.image ? (
            <div className="relative h-48">
              <Image
                className="object-contain"
                src={`https://imagedelivery.net/PQiTCCXQwNASghVAHpWmhQ/${product.image}/public`}
                alt="제품 사진"
                layout="fill"
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-200" />
          )}
          <div className="flex border-b mt-1 py-3 items-center space-x-3 cursor-pointer">
            {product.user.avatar ? (
              <Image
                src={`https://imagedelivery.net/PQiTCCXQwNASghVAHpWmhQ/${product.user.avatar}/resizeCover`}
                alt="판매자"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">
                {product.user?.name ?? '이름이..'}
              </p>
              <Link href={`/profiles/${product.user?.id}`}>
                <a className="text-sm font-medium text-gray-700">View profile &rarr;</a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {product.name ?? '이 물건은..'}
            </h1>
            <span className="text-3xl mt-3 text-gray-900">₩{product.price ?? '가격이..'}</span>
            <p className="text-base my-6 text-gray-700">{product.desc ?? '그리고 설명이..'}</p>
            <div className="flex items-center justify-between space-x-2">
              {/* 버튼 컴포넌트를 만드는 것이 좋음 */}
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-md shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-medium hover:bg-orange-600 transition-colors">
                Talk to seller
              </button>
              <button
                onClick={onFavClick}
                className={cls(
                  'p-3 flex items-center justify-center rounded-full hover:bg-gray-100',
                  isLiked
                    ? 'text-orange-500 hover:text-orange-600 fill-orange-500'
                    : 'text-gray-400 hover:text-gray-500'
                )}
              >
                {isLiked ? <IconHeartSolid /> : <IconHeart />}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t py-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {relatedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div className="h-56 w-full bg-slate-300" />
                  <h3 className="text-sm text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-xs font-medium text-gray-700">₩{product.price}</span>
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    /**
     * paths는 미리 만들어야 할 페이지가 몇 개인지를 알려주고 라우팅에 사용토록 한다.
     * 하지만, On Demand Revalidate 기능의 ISR(증분 정적 재생성), SSG(Server Static Generation, 정적 생성)을 이용하려면
     * 몇 개의 페이지인지는 가늠할 수 없다. 따라서, paths에 빈 배열을 리턴한다.
     *  특정 개수를 파악할 수 있는 ISR이라면 [slug].tsx를 참고하면 될 것 같다.
     *
     *  prisma client로부터 제품 데이터를 모~두 받아와 미리 만들 수는 있으나, DB가 죽거나 빌드가 터질 것이다.
     * prisma Client를 이용하는 것은 좋은 생각이 아니다.
     */
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    }
  }

  const product = await client.product.findUnique({
    where: { id: +ctx.params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })

  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word,
    },
  }))

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: +ctx.params.id,
        },
      },
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const isLiked = false
  // Boolean(
  //   await client.fav.findFirst({
  //     where: {
  //       productId: +id,
  //       userId: user?.id,
  //     },
  //     // 좀 더 적은 트래픽을 사용하기 위해, id를 통해 있는지의 여부"만" 확인
  //     select: {
  //       id: true,
  //     },
  //   })
  // )

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  }
}
