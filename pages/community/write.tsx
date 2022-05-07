import type { NextPage } from 'next'
import Button from '@components/button'
import Layout from '@components/layout'
import TextArea from '@components/textarea'
import { useForm } from 'react-hook-form'
import useMutation from '@libs/client/useMutation'
import { useEffect } from 'react'
import { Post, User } from '.prisma/client'
import { useRouter } from 'next/router'
import useCoords, { IUseCoordsState } from '@libs/client/useCoords'

interface IWriteForm {
  question: string
  latitude: number
  longitude: number
}
interface PostWithUser extends Post {
  user: User
}
interface IMutationResult {
  ok: boolean
  post: PostWithUser
}

const Write: NextPage = () => {
  const router = useRouter()
  const { latitude, longitude } = useCoords()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWriteForm>()
  const [post, { loading, data }] = useMutation<IMutationResult>('/api/posts')
  const onValid = (data: IWriteForm) => {
    if (loading) return
    post({ ...data, latitude, longitude })
  }

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`)
    }
  }, [data, router])
  return (
    <Layout canGoBack title="Write Post">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register('question', {
            required: '질문을 입력하세요.',
            minLength: { value: 12, message: '최소 12글자 이상이어야 합니다.' },
          })}
          required
          placeholder="질문을 입력하세요."
        />
        <span>{errors.question?.message}</span>
        <Button text={loading ? 'loading...' : 'Submit'} />
      </form>
    </Layout>
  )
}

export default Write
