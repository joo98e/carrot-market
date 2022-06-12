import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { User } from '.prisma/client'

interface IUser {
  user?: User
  isLoading: boolean
  isPrivate?: boolean
}

interface IProfileResponse {
  ok: boolean
  profile: User
}

const useUser = (isPrivate = true): IUser => {
  const { data, error } = useSWR<IProfileResponse>('/api/users/me')
  const router = useRouter()

  useEffect(() => {
    if (data && !data?.ok) {
      isPrivate && router.replace('/enter')
    }
  }, [data, router, isPrivate])
  return { user: data?.profile, isLoading: !data && !error }
}

export default useUser
