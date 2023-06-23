import { cx } from "@emotion/css"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { formatPrice, formatUom } from "../../functions/products"
import { generateSlug } from "../../functions/slug"
import { insertNbspIntoName } from "../../functions/utils"
import { ProductWithPriceModel } from "../../models/Product"
import { BigPrice } from "../BigPrice/BigPrice"
import { ShopLogo } from "../ShopLogo/ShopLogo"
import styles from "./ProductListItem.module.css"

const EAN_DISPLAY_LIMIT = 1

const formatEanText = (eans: string[]) => {
  return eans.length > EAN_DISPLAY_LIMIT
    ? `${eans.slice(0, EAN_DISPLAY_LIMIT).join(", ")} и ещё ${eans.length - EAN_DISPLAY_LIMIT}`
    : eans.join(", ")
}

export const ProductListItem: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const uom = formatUom(product)
  return (
    <div className={cx("relative", styles.productListItem)}>
      <div className={cx("ml-20", styles.divider)} />
      <div className="flex py-4">
        <div className="mr-4 rounded-xl w-16 h-16 shrink-0 relative">
          {product.thumbnailUrl && (
            <img
              className={clsx(
                "absolute inset-0 max-h-full m-auto",
                styles.image,
              )}
              src={product.thumbnailUrl}
              alt="Photo"
              loading="lazy"
            />
          )}
        </div>
        <div className="flex flex-col gap-3 grow min-h-16">
          <Link href={`/product/${generateSlug(product)}`}>
            <a className={cx("inline-block hover:text-orange-600 leading-tight font-medium", styles.link)}>
              {insertNbspIntoName(product.name)}
            </a>
          </Link>
          {product.shops.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between">
                <BigPrice isMulti={product.shops.length > 1} price={product.shops[0].price} />
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
        </div>
      </div>
    </div>
  )
}
