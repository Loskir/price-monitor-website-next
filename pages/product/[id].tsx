import clsx from "clsx"
import { useGate, useStore } from "effector-react"
import { DateTime } from "luxon"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { CenteredOverlay } from "../../components/CenteredOverlay"
import styles from "../../components/Product.module.css"
import { ProductHistoryGraph } from "../../components/ProductView/ProductHistoryGraph"
import { $productHistoryState, $productState, ProductGate } from "../../features/product/state"
import { ProductWithPriceModel } from "../../models/Product"

const GlobusIcon: React.FC = () => {
  // {/*<div className="w-10 inline-block align-middle mr-2">*/}
  // {/*  <Image src="/globus_logo.svg" width={1237} height={780} />*/}
  // {/*</div>*/}
  return (
    <div className="ml-2 w-14 inline-block align-middle">
      <img className="h-full mx-auto" src="/globus_logo.svg" alt="Globus" />
    </div>
  )
}

const LentaIcon: React.FC = () => {
  return (
    <div className="ml-2 w-20 inline-block align-middle">
      <img src="/lenta_logo_2.svg" alt="Lenta" />
    </div>
  )
}

const ProductPrice: React.FC<{
  price: ProductWithPriceModel["price"]
  icon?: "lenta" | "globus"
}> = ({ price, icon }) => {
  if (!price) {
    return <></>
  }
  const isDiscount = price.price !== price.basePrice
  const priceWhole = Math.floor(price.price)
  const priceDecimal = Math.floor((price.price - priceWhole) * 100)
  return (
    <h2 className="font-bold text-4xl my-2">
      <span className={clsx("align-baseline mr-2", isDiscount && "text-green-600")}>
        {priceWhole}
        <span className="align-text-top text-lg">
          <span className="w-0 inline-block opacity-0">.</span>
          {priceDecimal}₽
        </span>
      </span>
      {isDiscount
        && (
          <s className="text-gray-300 font-semibold text-base align-middle">
            {price.basePrice}₽
          </s>
        )}
      {icon === "lenta" && <LentaIcon />}
      {icon === "globus" && <GlobusIcon />}
    </h2>
  )
}

const Product: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const ProductPriceUpdatedAt: React.FC = () => {
    if (!product.price) return <></>
    const date = DateTime.fromISO(product.price.time)
    const dateString = date.setLocale("ru").toFormat("d MMMM в HH:mm ZZZZ")
    const duration = DateTime.now().diff(date, "days")
    const isOutdated = duration.days > 2
    return (
      <p className={isOutdated ? "text-red-500" : "text-gray-500"}>
        Обновлено {dateString}
        {isOutdated && ". Цена может быть неактуальной"}
      </p>
    )
  }
  return (
    <div className="flex flex-col">
      {product.photoUrl && <img className={styles.image} src={product.photoUrl} alt="Photo" />}
      <h1 className={clsx("font-semibold mt-4", product.name.length > 40 ? "text-xl" : "text-2xl")}>{product.name}</h1>
      {/*<ProductPrice price={product.price} icon="globus" />*/}
      {/*<ProductPrice price={product.price} icon="lenta" />*/}
      {/*<ProductPrice price={product.price} />*/}
      <ProductPrice price={product.price} />
      <p className="text-gray-500">Арт. {product.ean}</p>
      <ProductPriceUpdatedAt />
    </div>
  )
}

const ProductHistory: React.FC = () => {
  const productHistoryState = useStore($productHistoryState)
  if (productHistoryState.isLoading) {
    return <div>Loading...</div>
  }
  return <ProductHistoryGraph history={productHistoryState.history} />
}

const ProductInner: React.FC = () => {
  const state = useStore($productState)
  if (state.isLoading) {
    return <CenteredOverlay>Loading...</CenteredOverlay>
  }
  if (!state.product) {
    return <CenteredOverlay>Not found :(</CenteredOverlay>
  }
  return (
    <>
      <Product product={state.product} />
      <ProductHistory />
    </>
  )
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
