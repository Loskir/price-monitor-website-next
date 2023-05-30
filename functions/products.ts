import { DateTime } from "luxon"
import { type ProductWithPriceModel, UomType } from "../models/Product"

export const splitPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("ru")
  const priceWhole = Math.floor(price)
  const priceDecimal = (price - priceWhole).toFixed(2).slice(2)
  return [formatter.format(priceWhole), priceDecimal]
}
export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("ru", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(price)
}

export const getUpdatedAt = (time: string, locale = "ru") => {
  const date = DateTime.fromISO(time).setLocale(locale)
  // const dateString = date.toFormat("d MMMM в HH:mm ZZZZ")
  const diff = DateTime.now().diff(date, "days")
  let dateString: string
  if (date > DateTime.now().startOf("day")) {
    dateString = "сегодня"
  } else if (diff.days < 60) {
    dateString = date.toRelative({
      unit: "days",
    }) ?? date.toFormat("d MMMM в HH:mm")
  } else {
    dateString = date.toRelative() ?? date.toFormat("d MMMM в HH:mm")
  }
  const isOutdated = diff.days > 2
  return {
    isOutdated,
    dateString: `Обновлено ${dateString}`,
  }
}

export function formatUom(product: ProductWithPriceModel) {
  switch (product.uomType) {
    case UomType.kg:
      return "кг"
    case UomType.l:
      return "л"
    default:
      return product.uomName || "шт"
  }
}
