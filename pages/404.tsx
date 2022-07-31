import Layout from '@components/layout'
import React from 'react'

const ErrorPage = ({}) => {
  return (
    <Layout title="Oops">
      <div className="text-center flex flex-col space-x-4space-y-4 justify-center items-center h-full">
        <h1 className="text-5xl font-semibold text-center ">404</h1>
        <p className="text-lg">페이지를 찾을 수 없습니다.</p>
      </div>
    </Layout>
  )
}

export default ErrorPage
