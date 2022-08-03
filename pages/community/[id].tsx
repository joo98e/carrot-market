import type { NextPage } from 'next'
import Layout from '@components/layout'
import TextArea from '@components/textarea'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Answer, Post, User } from '.prisma/client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import useMutation from '@libs/client/useMutation'
import { cls } from '@libs/client/utils'
import { useEffect } from 'react'

interface AnswerWithUser extends Answer {
  user: User
}

interface PostWithUser extends Post {
  user: User
  answers: AnswerWithUser[]
  _count: {
    wonderings: number
    answers: number
  }
}
interface IPostDetailResponse {
  ok: boolean
  post: PostWithUser
  isWondering: boolean
}

interface IMutationResultWonder {
  ok: boolean
}

interface IMutationResultAnswer {
  ok: boolean
  newAnswer: Answer
}

interface IAnswerForm {
  answer: string
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, mutate } = useSWR<IPostDetailResponse>(id && `/api/posts/${id}`)
  const [wonder, { loading, data: wonderData }] =
    useMutation<IMutationResultWonder>(`/api/posts/${id}/wonder`)
  const [sendAnswer, { loading: answerLoading, data: answerData }] =
    useMutation<IMutationResultAnswer>(`/api/posts/${id}/answer`)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAnswerForm>()

  const onWonderClick = () => {
    if (!data) return
    if (!loading) wonder({})
    mutate(
      {
        ...data,
        post: {
          ...data?.post,
          _count: {
            ...data.post._count,
            wonderings: data.isWondering
              ? data.post._count.wonderings - 1
              : data.post._count.wonderings + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    )
    // false를 하는 이유 : 로컬 상태를 유지하기 위해(검증을 위한 swr의 재요청으로 인해 다시 돌아와버리기 때문)
    // 반드시 api가 이루어진다는 가정 하에 정확한 ui가 될 것 같음.
  }
  const onValid = (form: IAnswerForm) => {
    if (!answerLoading) sendAnswer(form)
  }

  useEffect(() => {
    if (answerData && answerData?.ok) {
      reset()
      mutate()
    }
  }, [answerData, mutate, reset])

  return (
    <Layout canGoBack>
      <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        동네생활
      </span>
      <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-slate-300" />
        <div>
          <p className="text-sm font-medium text-gray-700">
            {data?.post?.user?.name}
          </p>
          <Link href={`/users/profiles/${data?.post?.user?.id}`}>
            <a className="text-xs font-medium text-gray-500">
              View profile &rarr;
            </a>
          </Link>
        </div>
      </div>
      <div>
        <div className="mt-2 px-4 text-gray-700">
          <span className="text-orange-500 font-medium">Q.</span>
          {data?.post?.question}
        </div>
        <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
          <button
            className={cls(
              'flex space-x-2 items-center text-sm select-none cursor-pointer',
              data?.isWondering ? 'text-green-500' : ''
            )}
            onClick={onWonderClick}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>궁금해요 {data?.post?._count?.wonderings}</span>
          </button>
          <span className="flex space-x-2 items-center text-sm select-none cursor-pointe">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>답변 {data?.post?._count?.answers}</span>
          </span>
        </div>
      </div>
      <div className="px-4 my-5 space-y-5">
        {data?.post?.answers?.map((item: AnswerWithUser) => {
          return (
            <div className="flex items-start space-x-3" key={item.id}>
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {item.user.name}
                </span>
                <span className="text-xs text-gray-500 block ">2시간 전</span>
                <p className="text-gray-700 mt-2">{item.answer}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-4">
        <form onSubmit={handleSubmit(onValid)}>
          <TextArea
            register={register('answer', {
              required: '답변을 작성해주세요.',
              minLength: {
                value: 5,
                message: '답변이 너무 짧습니다.',
              },
            })}
            name="description"
            placeholder="Answer this question!"
            required
          />
          {errors.answer?.message && <span>{errors.answer?.message}</span>}
          <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
            {answerLoading ? 'loading...' : 'Reply'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default CommunityPostDetail
