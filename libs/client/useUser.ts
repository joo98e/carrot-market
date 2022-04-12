/*
 * carrot-market
 */

import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = async (url: string) => fetch(url).then((res) => res.json())

const useUser = () => {
  const { data, error } = useSWR('/api/users/me', fetcher)
  const router = useRouter()
  useEffect(() => {
    if (!data.profile) {
      router.replace('/enter')
    }
  }, [data, router])
  return { user: data?.profile, isLoading: !data && !error }
}

export default useUser
