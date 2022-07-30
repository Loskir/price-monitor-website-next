import "../styles/globals.css"
import { attachLogger } from "effector-logger/attach"
import { withHydrate } from "effector-next"
import { domain } from "effector-next"
import type { AppProps } from "next/app"

attachLogger(domain)

const enhance = withHydrate()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default enhance(MyApp)
