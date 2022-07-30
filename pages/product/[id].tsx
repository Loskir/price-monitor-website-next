import clsx from "clsx"
import { useGate, useStore } from "effector-react"
import { DateTime } from "luxon"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
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
  return (
    <div className="flex flex-col">
      {product.photoUrl && <img className={clsx("mb-4", styles.image)} src={product.photoUrl} alt="Photo" />}
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <ProductPrice price={product.price} />
      <p className="text-gray-500 pt-1">Арт. {product.ean}</p>
      <p className="text-gray-500">ID: {product.productId}</p>
      {product.price && (
        <p className="text-gray-500">
          Обновлено {DateTime.fromISO(product.price.time).setLocale("ru").toFormat("dd MMMM в HH:mm ZZZZ")}
        </p>
      )}
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
    return (
      <div className="absolute inset-12 flex flex-col justify-center">
        <span className="text-center">Loading...</span>
      </div>
    )
  }
  if (!state.product) {
    return (
      <div className="absolute inset-12 flex flex-col justify-center">
        <span className="text-center">Not found :(</span>
      </div>
    )
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
  return (
    <>
      <Head>
        <title>{state.product?.name || "Product"} — Price Monitor</title>
      </Head>
      <div className="max-w-xl mx-auto py-8 px-4 min-h-screen">
        <ProductInner />
      </div>
    </>
  )
}

export default ProductView
