import Image from 'next/image'
import Link from 'next/link'
import IconHeartSolid from './icons/heartSolid'

interface ItemProps {
  title: string
  id: number
  price: number
  hearts: number
  comments: number
  image: string
}

export default function Item({ title, price, hearts, comments, image, id }: ItemProps) {
  
  return (
    <Link href={`/products/${id}`}>
      <a className="flex px-4 pt-5 cursor-pointer justify-between">
        <div className="flex space-x-4">
          {image && image !== "xx" ? (
            <div className="relative w-20 h-20">
              <Image
                className="object-contain"
                src={`https://imagedelivery.net/PQiTCCXQwNASghVAHpWmhQ/${image}/resizeCover`}
                alt="제품 사진"
                layout="fill"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-400 rounded-md" />
          )}
          <div className="pt-2 flex flex-col">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="font-medium mt-1 text-gray-900">${price}</span>
          </div>
        </div>
        <div className="flex space-x-2 items-end justify-end">
          <div className="flex space-x-0.5 items-center text-sm  text-orange-600">
            <IconHeartSolid />
            <span>{hearts}</span>
          </div>
        </div>
      </a>
    </Link>
  )
}
