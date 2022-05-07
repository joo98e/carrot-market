import type { NextPage } from 'next'
import Item from '@components/item'
import Layout from '@components/layout'
import useSWR from 'swr'
import { Sales } from '.prisma/client'
import { ProductWithCount } from 'pages/home'
import ProductList from '@components/product-list'

interface Record extends Sales {
  product: ProductWithCount
}

interface IProductListResponse {
  ok: boolean
  sales: Record[]
}

const Sold: NextPage = () => {
  const { data } = useSWR<IProductListResponse>('/api/users/me/sales')

  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="sales" />
      </div>
    </Layout>
  )
}

export default Sold
