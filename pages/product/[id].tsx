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

const ProductPrice: React.FC<{ price: ProductWithPriceModel["price"] }> = ({ price }) => {
  if (!price) {
    return <></>
  }
  if (price.price !== price.basePrice) {
    return (
      <h2 className="pt-1">
        <span className="font-bold text-green-600 text-2xl">
          {price.price}₽
        </span>{" "}
        <s>
          {price.basePrice}₽
        </s>
      </h2>
    )
  }
  return <span className="font-bold text-2xl">{price.price}₽</span>
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
      {product.photoUrl && <img className={clsx("mb-4", styles.image)} src={product.photoUrl} alt="Photo" />}
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <ProductPrice price={product.price} />
      <p className="text-gray-500 pt-1">Арт. {product.ean}</p>
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
