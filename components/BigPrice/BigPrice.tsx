import React from "react"
import { splitPrice } from "../../functions/products"

export const BigPrice: React.FC<{ isMulti?: boolean; price: number }> = ({
  isMulti = false,
  price,
}) => {
  const [priceWhole, priceDecimal] = splitPrice(price)
  return (
    <span>
      {isMulti && "от "}
      <span className="text-2xl">
        {priceWhole}
        <span className="text-xs align-super ml-0.5">{priceDecimal}</span>
      </span>
    </span>
  )
}
