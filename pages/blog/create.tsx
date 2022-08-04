import { Blog } from '.prisma/client'
import Button from '@components/button'
import Input from '@components/input'
import Layout from '@components/layout'
import TextArea from '@components/textarea'
import useMutation from '@libs/client/useMutation'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface IData {
  subject?: string
  content?: string
}

interface IMutationResult {
  ok: boolean
  blog: Blog
}

const BlogCreate = () => {
  const router = useRouter()
  const [post, { data, loading }] = useMutation<IMutationResult>('/api/blog')
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onValid = (data: IData) => {
    if (loading || !data) return

    console.log(data)
    post(data)
  }

  useEffect(() => {
    if (data?.ok) {
      reset()
      router.replace('/blog')
    }
  }, [data, data?.ok, loading, reset, router])

  console.log(moment(new Date()).format('yyyy-MM-DD'))

  return (
    <Layout canGoBack title="Blog Write">
      <div>
        <form className="space-y-2 mb-4" onSubmit={handleSubmit(onValid)}>
          <Input
            register={register('subject')}
            label="제목"
            name="subject"
            kind="text"
            type="text"
          />
          <TextArea label="마크다운" register={register('content')} />
        </form>
        <div className="flex justify-between space-x-4">
          <Button text="Submit" onClick={handleSubmit(onValid)} />
          <Button text="Clear" onClick={() => reset()} />
        </div>
      </div>
    </Layout>
  )
}

export default BlogCreate
