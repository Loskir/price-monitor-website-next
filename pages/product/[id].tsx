import { useGate, useStore } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { Product } from "../../components/ProductView/Product"
import { $productHistoryState, $productState, ProductGate } from "../../features/product/state"

const ProductInner: React.FC = () => {
  const state = useStore($productState)
  const priceHistory = useStore($productHistoryState)
  if (state.isLoading) {
    return <CenteredOverlay>Loading...</CenteredOverlay>
  }
  if (!state.product) {
    return <CenteredOverlay>Not found :(</CenteredOverlay>
  }
  return <Product product={state.product} priceHistory={priceHistory} />
}

const ProductView: NextPage = () => {
  const state = useStore($productState)
  const router = useRouter()
  useGate(ProductGate, {
    productId: router.query.id?.toString() || null,
    routerReady: router.isReady,
  })
  useEffect(() => {
    router.beforePopState((state) => {
      console.log("state2", state)
      return true
    })
  }, [])
  return (
    <>
      <Head>
        <title>{`${state.product?.name || "Product"} — Price Monitor`}</title>
      </Head>
      <div className="max-w-xl mx-auto py-8 px-4 min-h-screen">
        <ProductInner />
      </div>
    </>
  )
}

export default ProductView
