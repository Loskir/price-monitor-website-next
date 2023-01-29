import "../styles/globals.css"
import type { AppProps } from "next/app"
import Router from "next/router"
// @ts-ignore
import withYM from "next-ym"
import Head from "next/head"
import { withEffector } from "nextjs-effector"
import { QueryClient, QueryClientProvider } from "react-query"
import { HeaderLayout } from "../components/HeaderLayout"

// import { attachLogger } from "effector-logger/attach"

// attachLogger(domain, {
//   reduxDevtools: "disabled",
//   inspector: "disabled",
//   console: "disabled",
// })

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeaderLayout>
        <Head>
          <title>Price Monitor</title>
          <meta name="application-name" content="Price Monitor" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Price Monitor" />
          <meta name="description" content="Поиск выгодных цен на продукты" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Component {...pageProps} />
      </HeaderLayout>
    </QueryClientProvider>
  )
}

export default withEffector(withYM("90362829", Router)(MyApp))
