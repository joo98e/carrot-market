import Layout from '@components/layout'
import { readdirSync } from 'fs'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

interface IPostDetail {}

interface ISlugQuery extends ParsedUrlQuery {
  slug: string
}

const PostDetail: NextPage<IPostDetail> = ({}) => {
  const { query } = useRouter()

  return <Layout title={`${query.slug}`}>1</Layout>
}

export default PostDetail

export function getStaticPaths() {
  const files = readdirSync('./posts').map((file) => {
    return {
      params: {
        slug: file.substring(0, file.lastIndexOf('.')),
      },
    }
  })
  console.log(files)
  return {
    paths: files,
    fallback: false,
  }
}

export function getStaticProps() {
  return {
    props: {},
  }
}
