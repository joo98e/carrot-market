/*
 * carrot-market
 */

import Link from 'next/link'
import { useRouter } from 'next/router'
import { cls } from '../libs/utils'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  canGoBack?: boolean
  hasTabBar?: boolean
}

interface ICanGoBack {
  move: () => void
}

const CanGoBack = ({ move }: ICanGoBack) => {
  return <button className="absolute left-4" onClick={move}>&larr;</button>
}

const Layout = ({ title, canGoBack, hasTabBar, children }: LayoutProps) => {
  const router = useRouter()
  const prevMove = () => {
    router.back()
  }

  return (
    <div className="max-w-lg pt-8">
      <div
        className={cls(
          !canGoBack ? 'justify-center' : '',
          'bg-white w-full max-w-lg text-lg font-medium py-3 fixed text-orange-500 border-bottom top-0 flex items-center'
        )}
      >
        {canGoBack && <CanGoBack move={prevMove} />}
        {title && (
          <span className={cls(canGoBack ? 'mx-auto' : '', '')}>{title}</span>
        )}
      </div>
      <div className={cls('pt16', hasTabBar ? 'pb-16' : '')}>{children}</div>
      {hasTabBar && (
        <nav className="bg-white w-full max-w-lg text-gray-800 border-t fixed bottom-0 pb-6 pt-3 flex justify-between items-center">
          <Link href="/home">
            <a
              className={cls(
                'flex flex-col items-center space-y-2 ',
                router.pathname === '/'
                  ? 'text-orange-500'
                  : 'hover:text-gray-500 transition-colors'
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </a>
          </Link>
          <Link href="/community">
            <a
              className={cls(
                'flex flex-col items-center space-y-2 ',
                router.pathname === '/community'
                  ? 'text-orange-500'
                  : 'hover:text-gray-500 transition-colors'
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
            </a>
          </Link>
          <Link href="/chats">
            <a
              className={cls(
                'flex flex-col items-center space-y-2 ',
                router.pathname === '/chats'
                  ? 'text-orange-500'
                  : 'hover:text-gray-500 transition-colors'
              )}
            >
              <svg
                className="w-6 h-6"
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
            </a>
          </Link>
          <Link href="/live">
            <a
              className={cls(
                'flex flex-col items-center space-y-2 ',
                router.pathname === '/live'
                  ? 'text-orange-500'
                  : 'hover:text-gray-500 transition-colors'
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </a>
          </Link>
          <Link href="/profile">
            <a
              className={cls(
                'flex flex-col items-center space-y-2 ',
                router.pathname === '/profile'
                  ? 'text-orange-500'
                  : 'hover:text-gray-500 transition-colors'
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </a>
          </Link>
        </nav>
      )}
    </div>
  )
}

export default Layout
