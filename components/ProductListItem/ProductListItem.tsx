import { cx } from "@emotion/css"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { formatPrice, formatUom, splitPrice } from "../../functions/products"
import { generateSlug } from "../../functions/slug"
import { insertNbspIntoName } from "../../functions/utils"
import { ProductWithPriceModel } from "../../models/Product"
import { ShopLogo } from "../Logos"
import { VStack } from "../VStack/VStack"
import styles from "./ProductListItem.module.css"

const EAN_DISPLAY_LIMIT = 1

const formatEanText = (eans: string[]) => {
  return eans.length > EAN_DISPLAY_LIMIT
    ? `${eans.slice(0, EAN_DISPLAY_LIMIT).join(", ")} и ещё ${eans.length - EAN_DISPLAY_LIMIT}`
    : eans.join(", ")
}

const BigPrice: React.FC<{ isMulti?: boolean; price: number }> = ({ isMulti = false, price }) => {
  const [priceWhole, priceDecimal] = splitPrice(price)
  return (
    <span>
      {isMulti && "от "}
      <span className="text-2xl">
        {priceWhole}
        <span className="text-xs align-super ml-0.5">
          {priceDecimal}
        </span>
      </span>
    </span>
  )
}

export const ProductListItem: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const uom = formatUom(product)
  return (
    <div className={cx("relative", styles.productListItem)}>
      <div className={cx("ml-20", styles.divider)} />
      <div className="flex py-4">
        <div className="mr-4 rounded-xl w-16 h-16 shrink-0 relative">
          {product.photoUrl && (
            <img
              className={clsx(
                "absolute inset-0 max-h-full m-auto",
                styles.image,
              )}
              src={product.photoUrl}
              alt="Photo"
            />
          )}
        </div>
        <VStack gap={"4"} className="grow min-h-16">
          <Link href={`/product/${generateSlug(product)}`}>
            <a className={cx("inline-block", styles.title, styles.link)}>{insertNbspIntoName(product.name)}</a>
          </Link>
          {product.shops.length > 0 && (
            <>
              <div className="flex items-center">
                <BigPrice isMulti={product.shops.length > 1} price={product.shops[0].price} />
                <div className="grow" />
                <ShopLogo shopType={product.shops[0].shopType} className="h-8" monochrome />
              </div>
              <div className="flex flex-wrap justify-end text-secondary text-xs">
                {product.shops[0].unitPrice && (
                  <span>
                    {product.shops.length > 1 && "от "}
                    {formatPrice(product.shops[0].unitPrice)} ₽ за {uom}
                  </span>
                )}
                <div className="grow" />
                {product.eans && product.eans.length > 0 && (
                  <span className={"text-right"}>
                    Арт. {formatEanText(product.eans)}
                  </span>
                )}
              </div>
            </>
          )}
        </VStack>
      </div>
    </div>
  )
}
