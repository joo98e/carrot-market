import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

console.log('Document is running')
class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
            rel="stylesheet"
          />
          <Script
            src="https://developers.kakao.com/sdk/js/kakao.js"
            // strategy="afterInteractive" // 모든 것을 불러온 이 후
            // strategy="beforeInteractive" // 불러오기 이전에
            strategy="lazyOnload" // 다른거 다 불러오고 천~천히 불러와도 됨. lazy. 게으르게.
          />
          <Script
            src="https://developers.kakao.com/sdk/js/kakao.js"
            onLoad={() => {
              // functional code
              
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
