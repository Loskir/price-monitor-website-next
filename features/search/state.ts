import { createEvent, createStore, domain, restore, sample } from "effector-next"
import { Controller, createRequestFx } from "fry-fx"
import { searchProducts } from "../../api"
import { ProductWithPriceModel } from "../../models/Product"

const queryChanged = createEvent<string>()
const $query = restore(queryChanged, "")

const $products = createStore<ProductWithPriceModel[]>([])

const searchFx = createRequestFx<{ query: string }, ProductWithPriceModel[], Error>({
  name: "searchFx",
  domain,
  handler: async ({ query }, controller?: Controller) => {
    return searchProducts(query, controller?.getSignal())
  },
})

sample({
  source: $query,
  target: searchFx,
  fn: (query) => ({ query }),
})

sample({
  source: searchFx.doneData,
  target: $products,
})
$products.reset(queryChanged)

const $isLoading = searchFx.pending

export { $isLoading, $products, $query, queryChanged }
