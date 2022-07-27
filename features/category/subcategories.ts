import { combine, createEvent, createStore, forward, sample } from "effector-next"
import { Controller, createRequestFx } from "fry-fx"
import { getCategories } from "../../api"
import { CategoryModel } from "../../models/Category"
import { CategoryGate, ParentCategoryId } from "./common"

const $categories = createStore<CategoryModel[]>([])

const loadCategoriesFx = createRequestFx<ParentCategoryId, CategoryModel[], Error>(
  async (parentId, controller?: Controller) => {
    return getCategories(parentId, controller?.getSignal())
  },
)

forward({
  from: loadCategoriesFx.doneData,
  to: $categories,
})

const $isLoading = loadCategoriesFx.pending

sample({
  // on gate state change
  clock: CategoryGate.state,
  // forward state
  source: CategoryGate.state.map((v) => v.categoryId),
  // to loadCategories
  target: loadCategoriesFx,
})

const $subcategoriesState = combine({
  isLoading: $isLoading,
  categories: $categories,
})

export { $subcategoriesState, CategoryGate, loadCategoriesFx }
