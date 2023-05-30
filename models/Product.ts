import { z } from "zod"

export enum UomType {
  kg = "kg",
  l = "l",
  pcs = "pcs",
}

export const PriceHistoryPriceModel = z.object({
  price: z.preprocess((v) => Number(v), z.number()),
  basePrice: z.preprocess((v) => Number(v), z.number()),
  time: z.string(),
})
export type PriceHistoryPriceModel = z.infer<typeof PriceHistoryPriceModel>

export interface ProductModel {
  productId: string
  name: string
  slug?: string
  photoUrl?: string
  photoUrls?: string[]
  /** @deprecated */
  ean?: string
  eans?: string[]
  uomType?: UomType
  uomName?: string
  uomValue?: number
}

export interface ProductPriceModel extends PriceHistoryPriceModel {
  unitPrice?: number
  offerValidUntil?: string
}
export type ProductShopEntry = ProductPriceModel & {
  shopType: string
}

export interface ProductWithPriceModel extends ProductModel {
  price?: ProductPriceModel
  shops: ProductShopEntry[]
}

export const PriceHistoryEntryModel = z.object({
  shopType: z.string(),
  prices: z.array(PriceHistoryPriceModel),
})
export type PriceHistoryEntryModel = z.infer<typeof PriceHistoryEntryModel>

export const PriceHistoryModel = z.object({
  shops: z.array(PriceHistoryEntryModel),
})
export type PriceHistoryModel = z.infer<typeof PriceHistoryModel>
