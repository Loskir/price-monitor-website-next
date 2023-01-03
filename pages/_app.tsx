import "../styles/globals.css"
import { withHydrate } from "effector-next"
import { domain } from "effector-next"
import type { AppProps } from "next/app"
import Router from "next/router"
// @ts-ignore
import withYM from "next-ym"
import Head from "next/head"
import { HeaderLayout } from "../components/HeaderLayout"

const enhance = withHydrate()

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  )
}

export default withYM("90362829", Router)(enhance(MyApp))
