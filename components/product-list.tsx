import { Sales } from '.prisma/client'
import { ProductWithCount } from 'pages/home'
import useSWR from 'swr'
import Item from './item'

interface Record extends Sales {
  product: ProductWithCount
}

interface IProductListResponse {
  [key: string]: Record[]
}

interface IProductListProps {
  kind: 'favs' | 'sales' | 'purchases'
}

export default function ProductList({ kind }: IProductListProps) {
  const { data } = useSWR<IProductListResponse>(`/api/users/me/${kind}`)
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          key={record.id}
          id={record.product.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.favs}
          comments={1}
          image={''}
        />
      ))}
    </>
  ) : (
    <></>
  )
}
