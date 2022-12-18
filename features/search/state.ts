import { createEffect, createEvent, createStore, domain, restore, sample } from "effector-next"
import { Controller, createRequestFx } from "fry-fx"
import { searchProducts } from "../../api"
import { ProductWithPriceModel } from "../../models/Product"

const pageLoaded = createEvent()

const queryChanged = createEvent<string>()
const $query = restore(queryChanged, "")

const readFromQueryFx = createEffect(() => {
  return new URLSearchParams(window.location.search).get("q") ?? ""
})
const saveToQueryFx = createEffect((query: string) => {
  const url = new URL(location.href)
  if (query) {
    url.searchParams.set("q", query)
  } else {
    url.searchParams.delete("q")
  }
  history.replaceState(null, "", url)
})

sample({
  source: pageLoaded,
  target: readFromQueryFx,
})
sample({
  source: readFromQueryFx.doneData,
  target: $query,
})

sample({
  source: $query,
  target: saveToQueryFx,
})

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

export { $isLoading, $products, $query, pageLoaded, queryChanged }
