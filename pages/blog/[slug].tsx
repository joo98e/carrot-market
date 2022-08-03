import Layout from '@components/layout'
import { readdirSync } from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import remarkHtml from 'remark-html'
import remarkParse from 'remark-parse/lib'
import { unified } from 'unified'

interface IPost {
  slug: string
  post: string
}

const Post: NextPage<IPost> = ({ slug, post }) => {
  return (
    <Layout canGoBack title={`${slug}`} seoTitle={slug}>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post ?? '<div>content is not exsits.</div>' }}
      />
    </Layout>
  )
}

export default Post

interface ISSGWithISRFiles {
  params: {
    slug: string
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const files: ISSGWithISRFiles[] = readdirSync('./posts').map((file) => {
    return {
      params: {
        slug: file.substring(0, file.lastIndexOf('.')),
      },
    }
  })
  return {
    paths: files,
    fallback: false,
  }
}

interface IMatterPost {
  data: {
    title?: string
    [key: string]: any
  }
  content?: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { data, content }: IMatterPost = matter.read(`./posts/${ctx.params?.slug}.md`)
  const { value } = await unified().use(remarkParse).use(remarkHtml).process(content)

  return {
    props: {
      slug: data.title,
      post: value,
    },
  }
}
