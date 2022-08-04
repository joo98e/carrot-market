import FloatingButton from '@components/floating-button'
import Layout from '@components/layout'
import { readdirSync, readFileSync } from 'fs'
import matter from 'gray-matter'
import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'

interface IBlogProps {
  title?: string
  date?: string
  category?: string
  slug?: string
}

const Blog: NextPage<{ posts: IBlogProps[] }> = ({ posts }) => {
  return (
    <Layout title="Latest Posts">
      <ul>
        {posts.map((post, idx) => (
          <div className="flex justify-between items-center m-2" key={idx}>
            <Link href={`/blog/${post.slug}`}>
              <a className="font-semibold text-blue-500">{post.title}</a>
            </Link>
            <span className="font-semibold text-blue-500"></span>
            <div>
              <span className="text-sm">
                {post.category} | {post.date}
              </span>
            </div>
          </div>
        ))}
      </ul>
      <FloatingButton href="/blog/create"><span>write</span></FloatingButton>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts: IBlogProps[] = readdirSync('./posts').map((file) => {
    const slug = file.substring(0, file.lastIndexOf('.'))
    const { data } = matter(
      readFileSync(`./posts/${file}`, {
        encoding: 'utf-8',
      })
    )

    return { ...data, slug }
  })
  
  return {
    props: {
      posts: posts.reverse(),
    },
  }
}
export default Blog
