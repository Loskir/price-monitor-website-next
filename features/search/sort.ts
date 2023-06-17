import { SortOrder, SortType } from "../../api"

export type SortTypeHuman = (typeof SortTypeHuman)[keyof typeof SortTypeHuman]
export const SortTypeHuman = {
  relevancy: "relevancy",
  nameAsc: "nameAsc",
  nameDesc: "nameDesc",
  priceAsc: "priceAsc",
  priceDesc: "priceDesc",
  unitPriceAsc: "unitPriceAsc",
  unitPriceDesc: "unitPriceDesc",
} as const

export const sortMapper: { [key in SortTypeHuman]: [SortType, SortOrder] | [undefined, undefined] } = {
  [SortTypeHuman.relevancy]: [undefined, undefined],
  [SortTypeHuman.nameAsc]: [SortType.name, SortOrder.asc],
  [SortTypeHuman.nameDesc]: [SortType.name, SortOrder.desc],
  [SortTypeHuman.priceAsc]: [SortType.price, SortOrder.asc],
  [SortTypeHuman.priceDesc]: [SortType.price, SortOrder.desc],
  [SortTypeHuman.unitPriceAsc]: [SortType.unitPrice, SortOrder.asc],
  [SortTypeHuman.unitPriceDesc]: [SortType.unitPrice, SortOrder.desc],
}
