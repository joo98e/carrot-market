import type { NextPage } from 'next'
import Layout from '@components/layout'
import Message from '@components/message'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Message as IMessage, Stream as IStream } from '.prisma/client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useMutation from '@libs/client/useMutation'
import useUser from '@libs/client/useUser'
import streams from 'pages/api/streams'

interface IStreamMessage {
  id: number
  message: string
  user: {
    id: number
    avatar: string | null
  }
}

interface IStreamWithMessages extends IStream {
  messages: IStreamMessage[]
}

interface IResponse {
  ok: boolean
  stream: IStreamWithMessages
}

interface IMessageForm {
  message: string
}

interface IMessageResponse {
  ok: boolean
  message: IMessage
}

const Stream: NextPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id } = router.query
  const { register, handleSubmit, reset } = useForm<IMessageForm>()
  const [sendMessage, { data: sendMessageData, loading }] =
    useMutation<IMessageResponse>(`/api/streams/${id}/message`)
  const { data, mutate } = useSWR<IResponse>(id ? `/api/streams/${id}` : null, {
    // refreshInterval: 4000,
    /**
     * serverless 환경에서, nextjs, api, pages만을 이용해서는 실시간 기능을 제공할 수 없다.
     * 지금은 refreshInterval과 Optimistic UI Update(백엔드 응답과 상관없이 UI를 업데이트한다.)를 통해
     * 사용자 경험(UX, User Experience)을 증진하고, 추후 이 프로젝트가 끝나갈 무렵
     * serverless 환경에서 실시간 기능을 해보는 것으로 한다.
     */
  })

  const onValid = (data: IMessageForm) => {
    if (loading) return
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: user?.id,
                message: data.message,
                user: {
                  id: user?.id,
                  avatar: user?.avatar,
                },
              },
            ],
          },
        } as any),
      false
    )
    sendMessage(data)
    reset()
  }

  useEffect(() => {
    if (data && !data.ok) {
      router.push('/stream')
    }
  }, [router, data])

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4 w-full mx-auto">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name ?? '이름이...'}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {data?.stream?.price ?? '가격이...'}
          </span>
          <p className=" my-6 text-gray-700">
            {data?.stream?.desc ?? '설명은...'}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 overflow-y-scroll  px-4 space-y-4">
            {data?.stream.messages.map((msg) => {
              return (
                <Message
                  key={msg.id}
                  message={msg.message ?? ' - '}
                  reversed={user?.id === msg.user.id}
                />
              )
            })}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form
              className="flex relative max-w-md items-center w-full mx-auto"
              onSubmit={handleSubmit(onValid)}
            >
              <input
                {...register('message', { required: true })}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Stream
