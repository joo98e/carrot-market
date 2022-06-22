/*
 * carrot-market
 */

import type { NextPage } from 'next'
import Button from '@components/button'
import Input from '@components/input'
import Layout from '@components/layout'
import useMutation from '@libs/client/useMutation'
import useUser from '@libs/client/useUser'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IIpIoResponse } from 'pages/api/files'

interface IEditProfileForm {
  email?: string
  phone?: string
  name?: string
  avatar?: FileList
  formErrors?: string
}

interface IEditProfileResponse {
  ok: boolean
  error?: string
}

interface ICloudFlareDCUResponse {
  ok: boolean
  id: string | undefined
  uploadURL: string | undefined
  message?: string
}

interface ICloudFlareDCUActionResponse {
  result?: {
    id?: string
    filename?: string
    uploaded?: string
    requireSignedURLs?: string
    variants?: string[]
  }
}

const EditProfile: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [editProfile, { loading, data }] = useMutation<IEditProfileResponse>(`/api/users/me`)
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IEditProfileForm>()
  const avatar = watch('avatar')
  const onValid = async ({ name, email, phone, avatar }: IEditProfileForm) => {
    clearErrors()
    if (loading) return false

    if (email === '' && phone === '' && name === '') {
      return setError('formErrors', {
        message: '입력 칸 중 1개는 반드시 필요합니다.',
      })
    }

    if (avatar && avatar.length > 0 && user?.id) {
      const cloudFlareRequest: ICloudFlareDCUResponse = await (await fetch('/api/files')).json()

      if (cloudFlareRequest && !cloudFlareRequest.ok && !cloudFlareRequest.uploadURL) {
        return console.log(cloudFlareRequest.message)
      }

      const form = new FormData()
      form.append('file', avatar[0], `avatar_${user.id}`)

      const {
        result: { id },
      } = await (
        await fetch(cloudFlareRequest.uploadURL!, {
          method: 'POST',
          body: form,
        })
      ).json()

      editProfile({ email, phone, name, avatarId: id })

      // const fake = await (
      //   // fetch 원래는 아래 주소와 같이 해야 함
      //   await fetch('/api/files/fake', {
      //     method: 'POST',
      //     body: form,
      //   })
      // ).json()
    } else {
      editProfile({ email, phone, name })
    }
  }

  useEffect(() => {
    if (user) {
      user.email && setValue('email', user.email)
      user.phone && setValue('phone', user.phone)
      user.name && setValue('name', user.name)
      user.avatar &&
        setAvatarPreview(
          `https://imagedelivery.net/PQiTCCXQwNASghVAHpWmhQ/${user?.avatar}/resizeCover`
        )
    }
  }, [setValue, user])

  useEffect(() => {
    if (data && data.ok) {
      router.back()
    }
  }, [router, data])

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0]
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }, [avatar])

  useEffect(() => {
    if (data && !data.ok) {
      setError('formErrors', {
        message: data.error,
      })
    }
  }, [setError, data])

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img className="w-14 h-14 rounded-full bg-slate-500" src={avatarPreview} />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}

          <span>{user?.name ?? ' - '}</span>
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register('avatar')}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          onFocus={() => clearErrors()}
          register={register('name')}
          label="user name"
          name="name"
          type="text"
        />
        <Input
          onFocus={() => clearErrors()}
          register={register('email')}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          onFocus={() => clearErrors()}
          register={register('phone')}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="block my-2 text-red-600 font-medium text-center">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? '수정하는 중...' : 'Update profile'} />
      </form>
    </Layout>
  )
}

export default EditProfile
