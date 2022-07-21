import type { NextPage } from 'next'
import FloatingButton from '@components/floating-button'
import Item from '@components/item'
import Layout from '@components/layout'
import useUser from '@libs/client/useUser'
import Head from 'next/head'
import useSWR, { SWRConfig } from 'swr'
import client from '@libs/server/client'
import { Product } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
export interface ProductWithCount extends Product {
  _count: {
    favs: number
  }
}
interface IResponseTypeOfProducts {
  ok: boolean
  products: ProductWithCount[]
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser()
  const { data, error } = useSWR<IResponseTypeOfProducts>(user ? '/api/products' : null, fetcher)

  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={product._count.favs || 0}
            image={product.image}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  )
}

const PageBySWRConfig: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        // fallback : 대체, 이 데이터로 캐시 초기값을 설정한다.
        fallback: {
          '/api/products': {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  )
}

export async function getServerSideProps() {
  const products = await client.product.findMany({})

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  }
}

export default PageBySWRConfig
