import "../styles/globals.css"
import { attachLogger } from "effector-logger/attach"
import { withHydrate } from "effector-next"
import { domain } from "effector-next"
import type { AppProps } from "next/app"
import { HeaderLayout } from "../components/HeaderLayout"

attachLogger(domain)

const enhance = withHydrate()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HeaderLayout>
      <Component {...pageProps} />
    </HeaderLayout>
  )
}

export default enhance(MyApp)
