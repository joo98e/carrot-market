import type { NextPage } from 'next'
import Button from '@components/button'
import Input from '@components/input'
import Layout from '@components/layout'
import TextArea from '@components/textarea'
import { useForm } from 'react-hook-form'
import useMutation from '@libs/client/useMutation'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Stream } from '.prisma/client'

interface ICreateStreamResponse {
  ok: boolean
  stream: Stream | null // 404
  error?: string
  // [key: string]: string
}

interface ICreateForm {
  name: string
  price: string
  desc: string
}

const Create: NextPage = () => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<ICreateForm>()
  const [createStream, { loading, data, error }] =
    useMutation<ICreateStreamResponse>('/api/streams')

  const onValid = (data: ICreateForm) => {
    if (loading) return
    createStream(data)
  }

  useEffect(() => {
    if (data && data?.ok) {
      router.push(`/stream/${data.stream?.id}`)
    }
  }, [data, router])

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register('name', {
            required: '이름이 반드시 필요합니다.',
          })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register('price', {
            required: '값이 반드시 필요합니다.',
            valueAsNumber: true,
          })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register('desc', {
            required: '설명이 반드시 필요합니다.',
          })}
          name="desc"
          label="desc"
        />
        <Button text={loading ? '생성중...' : 'Go live'} />
      </form>
    </Layout>
  )
}

export default Create
