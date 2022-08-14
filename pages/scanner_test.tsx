import type { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { Scanner } from "../components/Scanner/Scanner"

const Home: NextPage = () => {
  const onResult = (ean: string) => alert(ean)
  return (
    <main>
      <Scanner onResult={onResult} />
    </main>
  )
}

export default Home
