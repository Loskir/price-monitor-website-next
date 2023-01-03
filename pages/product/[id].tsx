import { useGate, useStore } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { getProductById, getProductHistoryById } from "../../api"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { MainLayout } from "../../components/Layout"
import { Product } from "../../components/ProductView/Product"
import {
  $productHistoryState,
  $productState,
  ProductGate,
} from "../../features/product/state"
import { PriceHistoryModel, ProductWithPriceModel } from "../../models/Product"

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

type Props = {
  isServer: Boolean
  productData: ProductWithPriceModel | null
  priceHistory: PriceHistoryModel | null
}

const ProductView: NextPage<Props> = (props) => {
  const { isServer, productData, priceHistory } = props

  const title = `${productData?.name || "Product"} — Price Monitor`

  if (!productData || !priceHistory) {
    return <CenteredOverlay>Not found :</CenteredOverlay>
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        {!isServer && <meta property="og:url" content={window.location.href} />}
        {productData.photoUrl && (
          <meta property="og:image" content={productData.photoUrl} />
        )}
      </Head>
      <MainLayout>
        <div className="pt-4">
          <Product
            product={productData}
            priceHistory={{ isLoading: false, history: priceHistory }}
          />
        </div>
      </MainLayout>
    </>
  )
}

ProductView.getInitialProps = async (ctx) => {
  const productData = await getProductById(ctx.query.id as string)
  const priceHistory = await getProductHistoryById(ctx.query.id as string)

  return { isServer: !!ctx.req, productData, priceHistory }
}

export default ProductView
