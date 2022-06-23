import { cls } from '@libs/client/utils'
import React, { ReactEventHandler } from 'react'

interface ButtonProps {
  large?: boolean
  text: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any
  [key: string]: any
}

export default function Button({ large = false, onClick, text, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={cls(
        'w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none',
        large ? 'py-3 text-base' : 'py-2 text-sm ',
        className && className
      )}
    >
      {text}
    </button>
  )
}
