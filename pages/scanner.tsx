import type { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { NavbarSpacer } from "../components/NavbarLayout"
import { Scanner } from "../components/Scanner/Scanner"

const Home: NextPage = () => {
  const router = useRouter()
  const onResult = (ean: string) => router.push(`/product/ean/${ean}`)
  return (
    <main className="h-full flex flex-col">
      <NavbarSpacer />
      <Scanner onResult={onResult} />
    </main>
  )
}

export default Home
