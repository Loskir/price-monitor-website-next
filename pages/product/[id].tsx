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
import { getShopName, ShopIcon } from "../../components/shops"
import { $productHistoryState, $productState, ProductGate } from "../../features/product/state"
import { formatUom } from "../../functions/products"
import { ProductWithPriceModel, ShopType } from "../../models/Product"

const locale = "ru"

const splitPrice = (price: number) => {
  const priceWhole = Math.floor(price)
  const priceDecimal = (price - priceWhole).toFixed(2).slice(2)
  return [priceWhole.toString(), priceDecimal]
}

const ProductPrice: React.FC<{
  price: ProductWithPriceModel["price"]
  shopType: ShopType
  uom: string
}> = ({ price, shopType, uom }) => {
  if (!price) {
    return <></>
  }
  const isDiscount = price.price !== price.basePrice
  const [priceWhole, priceDecimal] = splitPrice(Number(price.price))
  return (
    <div className="flex flex-row items-center py-4 flex-wrap">
      <ShopIcon shopType={shopType} className={styles.shopIcon} />
      <div className="flex flex-col mr-4">
        <span className={styles.shopName}>{getShopName(shopType)}</span>
        {/*<span className={clsx(styles.shopSubtitle, styles.decreasedLineHeight)}>10 часов назад</span>*/}
        {price.unitPrice && (
          <span className={styles.shopSubtitle}>
            {price.unitPrice.toFixed(2)}₽/{uom}
          </span>
        )}
      </div>
      <div className="flex flex-col ml-auto">
        {isDiscount
          && (
            <span className={styles.priceSecondary}>
              {price.offerValidUntil && (
                <span>
                  по {DateTime.fromISO(price.offerValidUntil).setLocale(locale).toFormat("d MMM")} • {" "}
                </span>
              )}
              <span className="line-through">{Number(price.basePrice).toFixed(2)}₽</span>
            </span>
          )}
        <span
          className={clsx(
            "align-baseline font-bold text-2xl shrink-0 sm:text-3xl",
            isDiscount && "text-green-600",
            styles.priceMain,
          )}
        >
          {priceWhole}
          <span className="align-text-top text-base sm:text-lg">
            <span className="w-0 inline-block opacity-0">.</span>
            {priceDecimal}
          </span>
        </span>
      </div>
    </div>
  )
}

const Product: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const ProductPriceUpdatedAt: React.FC = () => {
    if (!product.price) return <></>
    const date = DateTime.fromISO(product.price.time)
    const dateString = date.setLocale(locale).toFormat("d MMMM в HH:mm ZZZZ")
    const duration = DateTime.now().diff(date, "days")
    const isOutdated = duration.days > 2
    return (
      <p className={isOutdated ? "text-red-500" : "text-gray-500"}>
        Обновлено {dateString}
        {isOutdated && ". Цена может быть неактуальной"}
      </p>
    )
  }
  const uom = formatUom(product)
  return (
    <>
      <div className="flex flex-col">
        {product.photoUrl && <img className={styles.image} src={product.photoUrl} alt="Photo" />}
        <h1 className={clsx("font-semibold mt-4", product.name.length > 40 ? "text-xl" : "text-2xl")}>
          {product.name}
        </h1>
        <div className={clsx("my-2", styles.prices)}>
          <ProductPrice price={product.price} shopType="globus" uom={uom} />
          {/*<ProductPrice price={product.price} shopType="lenta" uom={uom} />*/}
          {/*<ProductPrice*/}
          {/*  price={{ price: 100, basePrice: 101, time: new Date().toString() }}*/}
          {/*  shopType={"lenta"}*/}
          {/*  uom={uom}*/}
          {/*/>*/}
          {/*<ProductPrice*/}
          {/*  price={{ price: 100, basePrice: 100, time: new Date().toString() }}*/}
          {/*  shopType={"lenta"}*/}
          {/*  uom={uom}*/}
          {/*/>*/}
        </div>
        {product.ean && <p className="text-gray-500">Арт. {product.ean}</p>}
        <ProductPriceUpdatedAt />
      </div>
      <ProductHistory />
    </>
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
  return <Product product={state.product} />
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
