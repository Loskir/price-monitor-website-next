import type { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { HeaderSpacer } from "../components/HeaderLayout"
import { Scanner } from "../components/Scanner/Scanner"

const Home: NextPage = () => {
  const router = useRouter()
  const onResult = (ean: string) => router.push(`/product/ean/${ean}`)
  return (
    <main>
      <HeaderSpacer />
      <Scanner onResult={onResult} />
    </main>
  )
}

export default Home
