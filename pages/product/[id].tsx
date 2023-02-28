import { useStore } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { useQuery } from "react-query"
import { getProductHistoryById } from "../../api"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { MainLayout } from "../../components/Layout"
import { Product } from "../../components/ProductView/Product"
import { ProductItemSkeleton } from "../../components/Skeletons/ProductItemSkeleton"
import { $productState, productPageLoaded } from "../../features/product/state"
import { PriceHistoryModel, ProductWithPriceModel } from "../../models/Product"
import { createGIPFactory } from "../../nextjs-effector"

const ProductInner: React.FC<{
  state: { isLoading: boolean; product: ProductWithPriceModel | null }
  priceHistory: { isLoading: boolean; history: PriceHistoryModel | null }
}> = ({ state, priceHistory }) => {
  if (state.isLoading) {
    return <ProductItemSkeleton />
  }
  if (!state.product) {
    return <CenteredOverlay>Not found :(</CenteredOverlay>
  }
  return <Product product={state.product} priceHistory={priceHistory} />
}

const ProductView: NextPage = () => {
  const { product } = useStore($productState)
  const router = useRouter()
  const productId = router.query.id as string
  // const { isServer, serverUrl } = props

  const productHistoryQuery = useQuery(
    ["getProductHistoryById", productId],
    ({ signal }) => {
      if (!productId) return
      return getProductHistoryById(productId, signal)
    },
  )
  const state = useStore($productState)

  const title = `${product?.name || "Product"} — Price Monitor`

  const photoUrl = product?.photoUrl
    ? (Array.isArray(product.photoUrl) ? product.photoUrl[0] : product.photoUrl)
    : undefined

  return (
    <>
      <Head>
        <title>{title}</title>
        {product && (
          <>
            <meta property="og:title" content={product.name} />
            <meta property="og:type" content="website" />
            <meta
              property="og:description"
              content="Самые выгодные скидки на продукты и история цен в Price Monitor"
            />
            {/*<meta property="og:url" content={isServer ? serverUrl : window.location.href} />*/}
            {photoUrl && (
              <meta
                property="og:image"
                content={photoUrl}
              />
            )}
          </>
        )}
      </Head>
      <MainLayout>
        <div className="pt-4">
          {/*<Product*/}
          {/*  product={productData}*/}
          {/*  priceHistory={{ isLoading: false, history: priceHistory }}*/}
          {/*/>*/}
          <ProductInner
            state={state}
            priceHistory={{ isLoading: productHistoryQuery.isLoading, history: productHistoryQuery.data ?? null }}
          />
        </div>
      </MainLayout>
    </>
  )
}
export const createGIP = createGIPFactory()

ProductView.getInitialProps = createGIP({
  pageEvent: productPageLoaded,
  // customize: async ({ context: ctx }) => {
  //   // console.log(ctx.req)
  //   // return {
  //   //   isServer: !!ctx.req,
  //   //   serverUrl: ctx.req && ctx.req.headers.host && ctx.req.url
  //   //     && `${ctx.req.headers.host}${ctx.req.url}`,
  //   // }
  // },
})

export default ProductView
