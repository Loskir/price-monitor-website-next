import { useStore } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useMemo } from "react"
import { useQuery } from "react-query"
import { getProductHistoryById } from "../../api"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { MainLayout } from "../../components/Layout"
import { Product, ProductSkeleton } from "../../components/ProductView/Product"
import { $productState, productPageLoaded } from "../../features/product/state"
import { generateSlug, parseSlug } from "../../functions/slug"
import { useIslands } from "../../hooks/useIslands"
import { PriceHistoryModel, ProductWithPriceModel } from "../../models/Product"
import { createGIPFactory } from "../../nextjs-effector"

const ProductInner: React.FC<{
  state: { isLoading: boolean; product: ProductWithPriceModel | null }
  priceHistory: { isLoading: boolean; history: PriceHistoryModel | null }
}> = ({ state, priceHistory }) => {
  if (state.isLoading) {
    return <ProductSkeleton />
  }
  if (!state.product) {
    return <CenteredOverlay>Not found :(</CenteredOverlay>
  }
  return <Product product={state.product} priceHistory={priceHistory} />
}

const ProductView: NextPage = () => {
  useIslands()

  const { product } = useStore($productState)
  const router = useRouter()
  const productId = useMemo(
    () => parseSlug(router.query.id as string),
    [router],
  )

  useEffect(() => {
    if (!product) return
    console.log(generateSlug(product))
    const newUrl = `/product/${generateSlug(product)}`
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    )
  }, [product, router])
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
        <ProductInner
          state={state}
          priceHistory={{ isLoading: productHistoryQuery.isLoading, history: productHistoryQuery.data ?? null }}
        />
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
