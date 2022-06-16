import { cls } from '@libs/client/utils'
import React, { useEffect, useState } from 'react'

interface IProps {
  total?: number
  unit?: number
  action: <T extends any>(num: number) => T
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const bgStyle = [
  'bg-orange-400 hover:bg-orange-500',
  'bg-gray-400 cursor-default',
]

const Pagination = ({
  total: value = 10,
  unit = 3,
  page,
  setPage,
  action,
}: IProps) => {
  const [total, setTotal] = useState(1)
  const arr = [...Array.from(Array(value).keys())] ?? [0]

  const onIncrease = () => {
    if (page === total) return
    setPage((prev: number) => {
      action(page + 1)
      return prev + 1
    })
  }
  const onDecrease = () => {
    if (page === 0) return
    setPage((prev: number) => {
      action(page - 1)
      return prev - 1
    })
  }

  useEffect(() => {
    if (total) {
      setTotal(Math.ceil(value / unit))
    }
  }, [total, unit, value])

  return (
    <div>
      <div className="w-full my-4 px-12 flex items-center justify-around">
        <div
          onClick={onDecrease}
          className={cls(
            'font-semibold px-2 py-1 text-white select-none cursor-pointer rounded-md',
            page !== 0 ? bgStyle[0] : bgStyle[1]
          )}
        >
          Prev
        </div>
        <div className="flex space-x-4">
          {arr.slice(page * unit, (page + 1) * unit).map((_, i) => {
            return (
              <div
                className="hover:bg-orange-500 border-0 aspect-square border-transparent transition-colors cursor-pointer shadow-xl bg-orange-400 text-md rounded-full w-8 flex items-center justify-center text-white"
                key={i}
              >
                {_ + 1}
              </div>
            )
          })}
        </div>
        <div
          onClick={onIncrease}
          className={cls(
            'font-semibold px-2 py-1 text-white select-none cursor-pointer rounded-md',
            page !== total ? bgStyle[0] : bgStyle[1]
          )}
        >
          Next
        </div>
      </div>
    </div>
  )
}

export default Pagination
