import "../styles/globals.css"
import { attachLogger } from "effector-logger/attach"
import { withHydrate } from "effector-next"
import { domain } from "effector-next"
import type { AppProps } from "next/app"
import Router from "next/router"
// @ts-ignore
import withYM from "next-ym"
import Head from "next/head"
import { HeaderLayout } from "../components/HeaderLayout"

attachLogger(domain, {
  reduxDevtools: "disabled",
  inspector: "disabled",
  console: "disabled",
})

const enhance = withHydrate()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HeaderLayout>
      <Head>
        <title>Price Monitor</title>
      </Head>
      <Component {...pageProps} />
    </HeaderLayout>
  )
}

export default withYM("90362829", Router)(enhance(MyApp))
