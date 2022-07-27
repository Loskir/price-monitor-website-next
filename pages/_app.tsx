import "../styles/globals.css"
import { withHydrate } from "effector-next"
import type { AppProps } from "next/app"

const enhance = withHydrate()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default enhance(MyApp)
