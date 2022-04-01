/*
 * carrot-market
 */

import type { NextPage } from 'next'

const EditProfile: NextPage = () => {
  return (
    <div className="py-10 px-4 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-full bg-slate-500" />
        <label htmlFor="picture" className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-md text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700">
          Change Photo
          <input id="picture" type="file" className="hidden" accept="image/*" />
        </label>
      </div>
      <div className="space-y-1">
        <label
          className="text-sm font-medium text-gray-500 mb-4"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="appearance-none w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="input"
          className="text-sm font-medium text-gray-500 mb-4"
        >
          email
        </label>
        <div className="space-y-1">
          <div className="flex rounded-md ">
            <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 select-none text-gray-500 text-sm">
              +82
            </span>
            <input
              id="input"
              className="appearance-none w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-l-none"
              type="number"
              required
            />
          </div>
        </div>
      </div>
      <button className="w-full bg-orange-500 hover:bg-orange-600 mt-4 p-2 text-white focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 shadow-sm text-sm rounded-md ">
        Update Profile
      </button>
    </div>
  )
}

export default EditProfile
