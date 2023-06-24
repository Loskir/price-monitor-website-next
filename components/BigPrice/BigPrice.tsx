import { css } from "@emotion/css"
import clsx from "clsx"
import React from "react"
import { splitPrice } from "../../functions/products"

export const BigPrice: React.FC<{ isMulti?: boolean; price: number; className?: string }> = ({
  isMulti = false,
  price,
  className,
}) => {
  const [priceWhole, priceDecimal] = splitPrice(price)
  return (
    <span className={clsx("text-2xl", className)}>
      {isMulti && <span className={css`font-size: 0.66em`}>от{" "}</span>}
      <span>
        {priceWhole}
        <span className={clsx("align-super", css`font-size: 0.5em; margin-left: 0.16666em`)}>
          {priceDecimal}
        </span>
      </span>
    </span>
  )
}
