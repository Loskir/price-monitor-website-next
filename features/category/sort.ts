// import connectLocalStorage from "effector-localstorage"
import { combine, createEvent, createStore, restore, sample } from "effector-next"
import { SortOrder, SortType } from "../../api"
// import { pageLoaded } from "./common"

// const sortOrderLS = connectLocalStorage("sortOrder")
// const sortTypeLS = connectLocalStorage("sortType")

const sortChanged = createEvent<SortType>()
const sortOrderFlipped = createEvent()

const $sortOrder = createStore<SortOrder>(SortOrder.asc)
const $sortType = restore(sortChanged, SortType.name)

// sample({
//   clock: pageLoaded,
//   fn: () => sortOrderLS.init(SortOrder.asc),
//   target: $sortOrder,
// })
// sample({
//   clock: pageLoaded,
//   fn: () => sortTypeLS.init(SortType.name),
//   target: $sortType,
// })

// $sortOrder.updates.watch(sortOrderLS)
// $sortType.updates.watch(sortTypeLS)

sample({
  clock: sortOrderFlipped,
  source: $sortOrder.map((v) => {
    return v === SortOrder.asc ? SortOrder.desc : SortOrder.asc
  }),
  target: $sortOrder,
})

const $sort = combine({
  sortType: $sortType,
  sortOrder: $sortOrder,
})

export { $sort, sortChanged, sortOrderFlipped }
