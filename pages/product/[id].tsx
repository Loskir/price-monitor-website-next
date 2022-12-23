import { useGate, useStore } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { MainLayout } from "../../components/Layout"
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

type Props = { isServer: Boolean }

const ProductView: NextPage<Props> = ({ isServer }) => {
  const state = useStore($productState)
  const router = useRouter()
  useGate(ProductGate, {
    productId: router.query.id?.toString() || null,
    routerReady: router.isReady,
  })
  const title = `${state.product?.name || "Product"} — Price Monitor`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        {!isServer && <meta property="og:url" content={window.location.href} />}
        {state.product?.photoUrl && <meta property="og:image" content={state.product.photoUrl} />}
      </Head>
      <MainLayout>
        <div className="pt-4">
          <ProductInner />
        </div>
      </MainLayout>
    </>
  )
}

ProductView.getInitialProps = async (ctx) => {
  return { isServer: !!ctx.req }
}

export default ProductView
