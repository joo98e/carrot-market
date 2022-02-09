import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="bg-violet-200 py-20 px-5 flex flex-col space-y-5">
      <div className="bg-white p-10 rounded-2xl shadow-xl">
        <span className="font-bold text-3xl text-gray-800">Select Item</span>
        <div className="flex justify-between my-2">
          <span className="text-gray-500">Grey Chair</span>
          <span>$19</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Grey Chair</span>
          <span>$19</span>
        </div>
        <div className="flex justify-between mt-2 p-2 border-t-2 border-dashed">
          <span>Total</span>
          <span>$10</span>
        </div>
        <div>Checkout</div>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-xl">

      </div>
      <div className="bg-white p-10 rounded-2xl shadow-xl">

      </div>
      <div className="bg-white p-10 rounded-2xl shadow-xl">

      </div>
    </div>
  )
}

export default Home
