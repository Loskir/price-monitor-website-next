import { createEvent, forward, sample } from "effector-next"
import { createGate } from "effector-react"

export type ParentCategoryId = number | null

const CategoryGate = createGate<{
  categoryId: ParentCategoryId
  routerReady: boolean
}>({
  defaultState: { categoryId: null, routerReady: false },
})
const $categoryId = CategoryGate.state.map((v) => v.categoryId)
const $routerReady = CategoryGate.state.map((v) => v.routerReady)

$categoryId.watch((v) => console.log("categoryId changed", v))
CategoryGate.status.watch((v) => console.log("gate", v))
CategoryGate.state.watch((v) => console.log("gate state", v))

const categoryIdChanged = createEvent()

// page loaded → load
// forward({
//   from: CategoryGate.open,
//   to: categoryIdChanged,
// })
// page is loaded + categoryId changed → reload
sample({
  source: {
    isMounted: CategoryGate.status,
    routerReady: $routerReady,
  },
  clock: [
    $categoryId,
    CategoryGate.open,
  ],
  // filter: CategoryGate.status,
  filter: ({ isMounted, routerReady }) => {
    console.log(isMounted, routerReady)
    return isMounted && routerReady
  },
  target: categoryIdChanged,
})

categoryIdChanged.watch(() => console.log("category id changed!"))

export { $categoryId, CategoryGate, categoryIdChanged }
