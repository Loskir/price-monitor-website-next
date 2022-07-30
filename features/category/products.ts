import { combine, createStore, domain, forward } from "effector-next"
import { Controller, createRequestFx } from "fry-fx"
import { getProductsByCategory, SortOrder, SortType } from "../../api"
import { ProductWithPriceModel } from "../../models/Product"
import { $categoryId } from "./common"
import { $sort } from "./sort"

const $products = createStore<ProductWithPriceModel[]>([])

type LoadProductsFxPayload = { categoryId: number; sortType: SortType; sortOrder: SortOrder }

const loadProductsFx = createRequestFx<
  LoadProductsFxPayload,
  ProductWithPriceModel[],
  Error
>({
  name: "loadProductsFx",
  domain,
  handler: async ({ categoryId, sortType, sortOrder }, controller?: Controller) => {
    return getProductsByCategory(categoryId, {
      sortType,
      sortOrder,
      signal: controller?.getSignal(),
    })
  },
})

const $categoryIdWithSort = combine({
  $categoryId,
  $sort,
}, ({ $categoryId, $sort }) => ({
  categoryId: $categoryId,
  sortType: $sort.sortType,
  sortOrder: $sort.sortOrder,
}))

$categoryIdWithSort.watch((v) => {
  if (v.categoryId !== null) {
    loadProductsFx({
      categoryId: v.categoryId,
      sortType: v.sortType,
      sortOrder: v.sortOrder,
    })
  }
})

forward({
  from: loadProductsFx.doneData,
  to: $products,
})

const $isLoading = loadProductsFx.pending

const $productsState = combine({
  isLoading: $isLoading,
  products: $products,
})

export { $productsState }
