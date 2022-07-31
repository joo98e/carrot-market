import Layout from '@components/layout'
import { readdirSync, readFileSync } from 'fs'
import matter from 'gray-matter'
import { NextPage } from 'next'

interface IBlogProps {
  title?: string
  date?: string
  category?: string
}

interface IProps {
  posts: IBlogProps[]
}

const Blog: NextPage<{ posts: IBlogProps[] }> = ({ posts }) => {
  console.log(posts)
  return (
    <Layout title="Latest Posts">
      <ul>
        {posts.map((post, idx) => (
          <div className="flex justify-between items-center m-2" key={idx}>
            <span className="font-semibold text-blue-500">{post.title}</span>
            <div>
              <span className="text-sm">
                {post.category} / {post.date}
              </span>
            </div>
          </div>
        ))}
      </ul>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts: IBlogProps[] = readdirSync('./posts').map((file) => {
    const { data } = matter(
      readFileSync(`./posts/${file}`, {
        encoding: 'utf-8',
      })
    )
    return data
  })

  return {
    props: {
      posts,
    },
  }
}
export default Blog
