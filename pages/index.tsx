import useUser from '@libs/client/useUser'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  })

  return (
    <div className="bg-violet-300 py-20 px-5 grid gap-10 lg:grid-cols-3 md:grid-cols-2 space-y-5 min-h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-xl group">
        <details className="select-none">
          <summary className="select-none outline-none">selection</summary>
          <span>is selected.</span>
        </details>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-xl group">
        <ul className="list-decimal marker:text-teal-500">
          <li>hi</li>
          <li>everyone</li>
          <li>my name is</li>
          <li>taebok</li>
        </ul>
      </div>
      <div className="bg-white p-10 sm:bg-red-300 md:bg-teal-400 rounded-2xl shadow-xl group">
        <span className="font-bold text-3xl text-gray-800">Select Item</span>
        <div className="flex justify-between my-2">
          <span className="text-gray-500">Grey Chair</span>
          <span className="font-semibold">$19</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Grey Chair</span>
          <span className="font-semibold">$19</span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t-2 border-dashed">
          <span>Total</span>
          <span className="font-semibold">$10</span>
        </div>
        <div className="mt-5 bg-blue-500 text-white p-3 text-center rounded-full w-2/4 mx-auto group-hover:bg-yellow-500 transition">
          Checkout
        </div>
      </div>

      {/* #2 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:col-span-2">
        <div className="bg-blue-600 p-6 pb-20">
          <span className="text-white font-semibold text-2xl">Profile</span>
        </div>
        <div className="rounded-3xl relative -top-5 bg-white p-6">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-semibold">340</span>
            </div>
            <div className="flex relative -top-16 w-32 h-32 bg-red-400 rounded-full" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Spent</span>
              <span className="font-semibold">$2,310</span>
            </div>
          </div>
          <div className="flex flex-col items-center -mb-5 -mt-10">
            <span className="font-semibold text-3xl">Tony Molloy</span>
            <span className="text-gray-600 text-sm">New York, USA</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-xl md:col-span-2">
        <div className="flex justify-between items-center mb-10">
          <span>⬅️</span>
          <div className="flex justify-between items-center space-x-5">
            <span className="font-semibold">⭐️ 4.9</span>
            <div className="p-2 shadow-xl text-center rounded-full">🧡</div>
          </div>
        </div>
        <div className="h-80 bg-gray-600 " />
        <div className="p-3 mt-2">
          <div className="grid grid-cols-1 mb-4">
            <span className="text-2xl font-semibold">Swoon Lounge</span>
            <span className="text-gray-600">Chair</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-x-3">
              <button className="rounded-full w-5 h-5 bg-violet-500 hover:ring ring-offset-2 ring-violet-500 transition"></button>
              <button className="rounded-full w-5 h-5 bg-teal-500 hover:ring ring-offset-2 ring-teal-500 transition"></button>
              <button className="rounded-full w-5 h-5 bg-yellow-500 hover:ring ring-offset-2 ring-yellow-500 transition"></button>
            </div>
            <div className="space-x-6">
              <button className="w-10 h-10 p-2 bg-blue-50 rounded-md text-lg">
                -
              </button>
              <span>1</span>
              <button className="w-10 h-10 p-2 bg-blue-50 rounded-md text-lg">
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-10">
            <span className="text-4xl font-semibold">$450</span>
            <button className="w-32 p-4 bg-blue-400 rounded-full text-lime-100 text-center">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
