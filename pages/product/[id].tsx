import { useGate, useUnit } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { MainLayout } from "../../components/Layout"
import { Product } from "../../components/ProductView/Product"
import { $productHistoryState, $productState, ProductGate } from "../../features/product/state"

const ProductInner: React.FC = () => {
  const state = useUnit($productState)
  const priceHistory = useUnit($productHistoryState)
  if (state.isLoading) {
    return <CenteredOverlay>Loading...</CenteredOverlay>
  }
  if (!state.product) {
    return <CenteredOverlay>Not found :(</CenteredOverlay>
  }
  return <Product product={state.product} priceHistory={priceHistory} />
}

const ProductView: NextPage = () => {
  const state = useUnit($productState)
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
  }, [router])
  return (
    <>
      <Head>
        <title>{`${state.product?.name || "Product"} — Price Monitor`}</title>
      </Head>
      <MainLayout>
        <div className="pt-4">
          <ProductInner />
        </div>
      </MainLayout>
    </>
  )
}

export default ProductView
