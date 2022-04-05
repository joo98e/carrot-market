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
      .then((response) => {
        console.log(response.json())
        response.json().catch(() => {})
      })
      //.then((response) => response.json().catch(() => {}))
      .then((data) => {
        console.log(data)
        setState((prev) => ({ ...prev, data }))
      })
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })))
  }

  console.log('state', { ...state })

  return [mutation, { ...state }]
}

export default useMutation

// -----------------

// import { useState } from "react";

// interface UseMutationState<T> {
//   loading: boolean;
//   data?: T;
//   error?: object;
// }
// type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

// export default function useMutation<T = any>(
//   url: string
// ): UseMutationResult<T> {
//   const [state, setSate] = useState<UseMutationState<T>>({
//     loading: false,
//     data: undefined,
//     error: undefined,
//   });
//   function mutation(data: any) {
//     setSate((prev) => ({ ...prev, loading: true }));
//     fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json().catch(() => {}))
//       .then((data) => setSate((prev) => ({ ...prev, data })))
//       .catch((error) => setSate((prev) => ({ ...prev, error })))
//       .finally(() => setSate((prev) => ({ ...prev, loading: false })));
//   }
//   return [mutation, { ...state }];
// }
