import { css, cx } from "@emotion/css"
import React from "react"

export const GlobusLogo: React.FC<{ monochrome?: boolean; className?: string }> = (
  { monochrome = false, className },
) => {
  return (
    <img
      className={cx(className, "px-2")}
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
      className={cx(className, "py-1.5")}
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
      className={cx(className, "py-1.5")}
      alt="Globus"
      src={monochrome ? "/logos/auchan_monochrome.svg" : "/logos/auchan.svg"}
    />
  )
}

export const PerekrestokLogo: React.FC<{ monochrome?: boolean; className?: string }> = (
  { monochrome = false, className },
) => {
  return (
    <img
      className={cx(className, css`padding: 7px 0`)}
      alt="Globus"
      src={monochrome ? "/logos/perekrestok_monochrome.svg" : "/logos/perekrestok.svg"}
    />
  )
}

export const ShopLogo: React.FC<{ shopType: string; monochrome?: boolean; className?: string }> = (
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
  if (shopType === "perekrestok") {
    return <PerekrestokLogo monochrome={monochrome} className={className} />
  }
  return <></>
}
