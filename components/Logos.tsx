import { cx } from "@emotion/css"
import React from "react"
import { ShopType } from "../models/Product"

export const GlobusLogo: React.FC<{ monochrome?: boolean; className?: string }> = (
  { monochrome = false, className },
) => {
  return (
    <img
      className={cx(className, "h-full px-2")}
      alt="Globus"
      src={monochrome ? "/logos/globus_monochrome.svg" : "/logos/globus.svg"}
    />
  )
}

export const LentaLogo: React.FC<{ monochrome?: boolean; className?: string }> = (
  { monochrome = false, className },
) => {
  return (
    <img
      className={cx(className, "h-full py-1.5")}
      alt="Globus"
      src={monochrome ? "/logos/lenta_monochrome.svg" : "/logos/lenta.svg"}
    />
  )
}

export const AuchanLogo: React.FC<{ monochrome?: boolean; className?: string }> = (
  { monochrome = false, className },
) => {
  return (
    <img
      className={cx(className, "h-full py-1.5")}
      alt="Globus"
      src={monochrome ? "/logos/auchan_monochrome.svg" : "/logos/auchan.svg"}
    />
  )
}

export const ShopLogo: React.FC<{ shopType: ShopType; monochrome?: boolean; className?: string }> = (
  { shopType, monochrome = false, className },
) => {
  if (shopType === "globus") {
    return <GlobusLogo monochrome={monochrome} className={className} />
  }
  if (shopType === "lenta") {
    return <LentaLogo monochrome={monochrome} className={className} />
  }
  if (shopType === "auchan") {
    return <AuchanLogo monochrome={monochrome} className={className} />
  }
  return <></>
}
