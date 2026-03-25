import { cls } from '@libs/client/utils'
import React, { useEffect, useState } from 'react'

interface IProps {
  total?: number
  unit?: number
  action: (num: number) => any
}

const bgStyle = [
  'bg-orange-400 hover:bg-orange-500',
  'bg-gray-400 cursor-default',
]

const Pagination = ({ total: value = 10, unit = 3, action }: IProps) => {
  const [total, setTotal] = useState(1)
  const [current, setCurrent] = useState(0)
  const arr = [...Array.from(Array(value).keys())] ?? [0]

  const onIncrease = () => {
    if (current === total) return
    setCurrent((prev) => {
      return prev + 1
    })
  }
  const onDecrease = () => {
    if (current === 0) return
    setCurrent((prev) => {
      return prev - 1
    })
  }

  useEffect(() => {
    if (total) {
      setTotal(Math.ceil(value / unit))
    }
  }, [unit, value])

  return (
    <div>
      <div className="w-full my-4 px-12 flex items-center justify-around">
        <div
          onClick={onDecrease}
          className={cls(
            'font-semibold px-2 py-1 text-white select-none cursor-pointer rounded-md',
            current !== 0 ? bgStyle[0] : bgStyle[1]
          )}
        >
          Prev
        </div>
        <div className="flex space-x-4">
          {arr.slice(current * unit, (current + 1) * unit).map((_, i) => {
            return (
              <div
                key={i}
                className="hover:bg-orange-500 border-0 aspect-square border-transparent transition-colors cursor-pointer shadow-xl bg-orange-400 text-md rounded-full w-8 flex items-center justify-center text-white"
                onClick={() => action(_)}
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
            current !== total ? bgStyle[0] : bgStyle[1]
          )}
        >
          Next
        </div>
      </div>
    </div>
  )
}

export default Pagination
