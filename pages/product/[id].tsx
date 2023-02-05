import { useStore } from "effector-react"
import { NextPage } from "next"
import Head from "next/head"
import React from "react"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import { MainLayout } from "../../components/Layout"
import { Product } from "../../components/ProductView/Product"
import { ProductItemSkeleton } from "../../components/Skeletons/ProductItemSkeleton"
import { $productHistoryState, $productId, $productState, productPageLoaded } from "../../features/product/state"
import { createGIPFactory } from "../../nextjs-effector"

const ProductInner: React.FC = () => {
  const state = useStore($productState)
  const priceHistory = useStore($productHistoryState)

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
  // const { isServer, serverUrl } = props

  const title = `${product?.name || "Product"} — Price Monitor`

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
            {product?.photoUrl && <meta property="og:image" content={product?.photoUrl} />}
          </>
        )}
      </Head>
      <MainLayout>
        <div className="pt-4">
          {/*<Product*/}
          {/*  product={productData}*/}
          {/*  priceHistory={{ isLoading: false, history: priceHistory }}*/}
          {/*/>*/}
          <ProductInner />
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
