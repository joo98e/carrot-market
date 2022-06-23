import type { NextPage } from 'next'
import Button from '@components/button'
import Input from '@components/input'
import Layout from '@components/layout'
import TextArea from '@components/textarea'
import { useForm } from 'react-hook-form'
import useMutation from '@libs/client/useMutation'
import { Product } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ICloudFlareDCUResponse } from 'pages/api/files'

interface IProductUploadForm {
  name: string
  price: number
  desc: string
  photo: FileList | null
}

interface IProductMutation {
  ok: boolean
  product: Product
}

const Upload: NextPage = () => {
  const router = useRouter()
  const { register, handleSubmit, formState, watch, setValue } = useForm<IProductUploadForm>()
  const photo = watch('photo')
  const [photoPreview, setPhotoPreview] = useState('')
  const [uploadProduct, { loading, data }] = useMutation<IProductMutation>('/api/products')

  const onValid = async ({ name, desc, photo, price }: IProductUploadForm) => {
    if (loading) return

    if (photo && photo.length > 0) {
      const { uploadURL, ok, message }: ICloudFlareDCUResponse = await (
        await fetch('/api/files')
      ).json()

      if (!ok || !uploadURL) {
        return console.log(message)
      }

      const file = new FormData()
      file.append('file', photo[0], `product_${name}`)
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: 'POST',
          body: file,
        })
      ).json()

      uploadProduct({ name, desc, price, photoId: id })
    } else {
      uploadProduct({ name, desc, price })
    }
  }

  const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPhotoPreview('')
    setValue('photo', null)

    return null
  }

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`)
    }
  }, [data, router])

  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0]
      setPhotoPreview(URL.createObjectURL(file))
    }
  }, [photo])

  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <div className="w-full text-gray-600 flex items-center justify-center h-48">
              <img className="h-full" src={photoPreview} alt="제품 사진" />
            </div>
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input {...register('photo')} accept="image/*" className="hidden" type="file" />
            </label>
          )}
          {photoPreview && <Button onClick={remove} className="mt-3" text="취소" />}
        </div>
        <Input
          register={register('name', { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register('price', { required: true })}
          required
          label="Price"
          placeholder="dsf"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register('desc', { required: true })}
          required
          name="desc"
          label="desc"
        />
        <Button text={loading ? 'loading...' : 'upload'} />
      </form>
    </Layout>
  )
}

export default Upload
