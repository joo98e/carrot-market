import { useState } from 'react'

interface IUseMutationState<T> {
  loading: boolean
  data?: T | void
  error?: object
}

type UseMutationResult<T> = [(data: any) => void, IUseMutationState<T>]

const useMutation = <T extends any>(url: string): UseMutationResult<T> => {
  const [state, setState] = useState<IUseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  })

  const mutation = (data: any) => {
    setState((prev) => ({ ...prev, loading: true }))
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      // here
      .then((response) => response.json())
      .catch(() => {})
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })))
  }

  return [mutation, { ...state }]
}

export default useMutation
