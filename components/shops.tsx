import clsx from "clsx"
import React from "react"
import { ShopType } from "../models/Product"

export const GlobusIcon: React.FC<{ className?: string }> = ({ className }) => {
  // {/*<div className="w-10 inline-block align-middle mr-2">*/}
  // {/*  <Image src="/globus_logo.svg" width={1237} height={780} />*/}
  // {/*</div>*/}
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/globus_logo.svg" alt="Globus" />
    </div>
  )
}

export const LentaIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/lenta_logo_2.svg" alt="Lenta" />
    </div>
  )
}

export const ShopIcon: React.FC<{ shopType: ShopType; className?: string }> = ({ shopType, className }) => {
  if (shopType === "globus") {
    return <GlobusIcon className={className} />
  }
  if (shopType === "lenta") {
    return <LentaIcon className={className} />
  }
  return <></>
}

export const getShopName = (shopType: ShopType): string => {
  if (shopType === "globus") return "Глобус"
  if (shopType === "lenta") return "Гипер Лента"
  return ""
}
